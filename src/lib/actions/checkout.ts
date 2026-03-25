"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { buildOrderConfirmationHtml, isBrevoConfigured, sendBrevoEmail } from "@/lib/email/brevo";
import {
  createRazorpayOrderId,
  fetchRazorpayOrder,
  getPublicRazorpayKeyId,
  inrToPaise,
  isRazorpayConfigured,
  verifyRazorpaySignature,
} from "@/lib/payments/razorpay";
import { formatPriceINR } from "@/lib/utils";

const MIN_ORDER_AMOUNT = 200; // ₹200 minimum order

export async function getCartAndTotals(userId: string) {
  const supabase = await createClient();
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", userId);

  if (!cartItems || cartItems.length === 0) {
    return { error: "Your cart is empty." as const, cartItems: null, totalAmount: 0, gst: 0, shipping: 0 };
  }

  const subtotal = cartItems.reduce(
    (acc: number, item: { products?: { base_price?: number }; quantity: number }) =>
      acc + (item.products?.base_price || 0) * item.quantity,
    0
  );

  // Validate minimum order amount
  if (subtotal < MIN_ORDER_AMOUNT) {
    return {
      error: `Minimum order amount is ${formatPriceINR(MIN_ORDER_AMOUNT)}. Add more items to continue.` as const,
      cartItems,
      subtotal,
      gst: 0,
      shipping: 0,
      totalAmount: 0,
      minimumRequired: MIN_ORDER_AMOUNT,
    };
  }

  const shipping = 0;
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + shipping + gst;

  return { error: null, cartItems, subtotal, gst, shipping, totalAmount };
}

async function validateShippingAddress(userId: string, addressId: string | null) {
  const supabase = await createClient();
  let shippingAddressId = addressId;
  if (!shippingAddressId) {
    const { data: defaultAddr } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .eq("is_default", true)
      .single();
    shippingAddressId = defaultAddr?.id ?? null;
  }

  if (!shippingAddressId) {
    return { error: "Please select a shipping address", addressId: null } as const;
  }

  return { error: null, addressId: shippingAddressId } as const;
}

export async function createOrder(
  userId: string,
  addressId: string,
  paymentMethod: "razorpay" | "cod" | "bank_transfer",
  razorpayPaymentId?: string,
  razorpayOrderId?: string,
  razorpaySignature?: string
) {
  const supabase = await createClient();

  // Validate cart
  const { error: cartError, cartItems, totalAmount, subtotal, gst, shipping } = await getCartAndTotals(userId);
  if (cartError || !cartItems) {
    return { error: cartError || "Cart validation failed" };
  }

  // Validate minimum order
  if (subtotal < MIN_ORDER_AMOUNT) {
    return {
      error: `Minimum order amount is ${formatPriceINR(MIN_ORDER_AMOUNT)}. Please add more items to your cart.`,
    };
  }

  // Validate address
  const { error: addressError, addressId: validAddressId } = await validateShippingAddress(userId, addressId);
  if (addressError || !validAddressId) {
    return { error: addressError || "Address validation failed" };
  }

  // Handle Razorpay payment verification
  if (paymentMethod === "razorpay" && razorpayOrderId) {
    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId || "", razorpaySignature || "");
    if (!isValid) {
      return { error: "Payment verification failed. Please try again." };
    }
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: paymentMethod === "cod" ? "pending" : "pending",
      total_amount: totalAmount,
      tax_amount: gst,
      shipping_amount: shipping,
      shipping_address_id: validAddressId,
      payment_status: paymentMethod === "cod" ? "unpaid" : "paid",
      payment_method: paymentMethod,
    })
    .select()
    .single();

  if (orderError) {
    return { error: orderError.message };
  }

  // Create order items
  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.products.base_price,
    total_price: item.products.base_price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    // Rollback order
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: itemsError.message };
  }

  // Record payment
  await supabase.from("payment_records").insert({
    order_id: order.id,
    payment_method: paymentMethod,
    transaction_id: razorpayPaymentId,
    amount: totalAmount,
    status: paymentMethod === "cod" ? "pending" : "completed",
    metadata: {
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
    },
  });

  // Clear cart
  await supabase.from("cart_items").delete().eq("user_id", userId);

  // Update product stock
  for (const item of cartItems) {
    await supabase.rpc("decrement_product_stock", {
      product_id: item.product_id,
      quantity: item.quantity,
    });
  }

  // Send confirmation email
  if (isBrevoConfigured()) {
    const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", userId).single();
    const { data: address } = await supabase.from("addresses").select("*").eq("id", validAddressId).single();

    const itemLines = orderItems.map((item: any) => ({
      name: item.products?.name || "Product",
      qty: item.quantity,
      lineTotal: formatPriceINR(item.total_price),
    }));

    await sendBrevoEmail({
      toEmail: profile?.email || "",
      subject: `Order Confirmed - #${order.id.toString().substring(0, 8)}`,
      htmlContent: buildOrderConfirmationHtml({
        orderId: order.id.toString().substring(0, 8),
        totalFormatted: formatPriceINR(totalAmount),
        itemLines,
        customerName: profile?.full_name,
      }),
    });
  }

  revalidatePath("/cart");
  revalidatePath("/account/orders");

  return { success: true, orderId: order.id };
}

export async function createRazorpayPaymentOrder() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a payment order." };
  }

  const userId = user.id;
  const { error, cartItems, totalAmount } = await getCartAndTotals(userId);
  if (error || !cartItems) {
    return { error };
  }

  if (totalAmount < MIN_ORDER_AMOUNT) {
    return {
      error: `Minimum order amount is ${formatPriceINR(MIN_ORDER_AMOUNT)}. Add more items to continue.`,
    };
  }

  const receipt = `order_${userId}_${Date.now()}`;

  const result = await createRazorpayOrderId(totalAmount, receipt);
  if (result.error) {
    return { error: result.error };
  }

  return {
    orderId: result.orderId,
    amount: result.amountPaise,
    currency: result.currency,
    keyId: getPublicRazorpayKeyId(),
  };
}

export async function validateCartMinimum(userId: string) {
  const { error, subtotal, minimumRequired } = await getCartAndTotals(userId);
  if (error) {
    return { valid: false, error, subtotal, minimumRequired };
  }
  return { valid: true, subtotal, minimumRequired: MIN_ORDER_AMOUNT };
}

// Legacy exports for PlaceOrderForm compatibility
export async function createRazorpayOrderAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create an order." };
  }

  const userId = user.id;
  const addressId = formData.get("addressId") as string;
  const { error, cartItems, totalAmount } = await getCartAndTotals(userId);
  if (error || !cartItems) {
    return { error };
  }

  if (totalAmount < MIN_ORDER_AMOUNT) {
    return {
      error: `Minimum order amount is ${formatPriceINR(MIN_ORDER_AMOUNT)}. Add more items to continue.`,
    };
  }

  const receipt = `order_${userId}_${Date.now()}`;
  const result = await createRazorpayOrderId(totalAmount, receipt);
  if (result.error) {
    return { error: result.error };
  }

  return {
    orderId: result.orderId,
    amountPaise: result.amountPaise,
    currency: result.currency,
    keyId: getPublicRazorpayKeyId(),
    prefill: {
      email: user.email || "",
      name: user.user_metadata?.full_name || "",
    },
  };
}

export async function placeOrder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to place an order." };
  }

  const userId = user.id;
  const addressId = formData.get("addressId") as string;
  const paymentMethod = formData.get("paymentMethod") as "razorpay" | "cod" | "bank_transfer";
  const requestGst = formData.get("gstInvoice") === "true";

  const result = await createOrder(userId, addressId, paymentMethod);
  if (result.error) {
    return { error: result.error };
  }
  return { success: true, orderId: result.orderId };
}

export async function verifyRazorpayAndPlaceOrder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to verify payment." };
  }

  const userId = user.id;
  const addressId = formData.get("addressId") as string;
  const paymentMethod = formData.get("paymentMethod") as "razorpay" | "cod" | "bank_transfer";
  const razorpayOrderId = formData.get("razorpay_order_id") as string;
  const razorpayPaymentId = formData.get("razorpay_payment_id") as string;
  const razorpaySignature = formData.get("razorpay_signature") as string;

  const result = await createOrder(
    userId,
    addressId,
    paymentMethod,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
  );

  if (result.error) {
    return { error: result.error };
  }
  return { success: true, orderId: result.orderId };
}
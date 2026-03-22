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

async function getCartAndTotals(userId: string) {
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
  const shipping = 0;
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + shipping + gst;

  return { error: null, cartItems, totalAmount, subtotal, gst, shipping };
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

  if (shippingAddressId) {
    const { data: validAddr } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .eq("id", shippingAddressId)
      .maybeSingle();
    if (!validAddr) {
      return { error: "Invalid shipping address. Please return to checkout and select an address again.", shippingAddressId: null };
    }
  }

  return { error: null, shippingAddressId };
}

/** Create Razorpay order — call before opening Checkout on the client */
export async function createRazorpayOrderAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  if (!isRazorpayConfigured()) {
    return { error: "Payment gateway is not configured." };
  }

  const addressId = (formData.get("addressId") as string) || "";
  const cartResult = await getCartAndTotals(user.id);
  if (cartResult.error || !cartResult.cartItems) {
    return { error: cartResult.error || "Cart error" };
  }
  const { cartItems, totalAmount } = cartResult;

  const { error: addrErr, shippingAddressId } = await validateShippingAddress(user.id, addressId || null);
  if (addrErr || (addressId && !shippingAddressId)) {
    return { error: addrErr || "Invalid address" };
  }

  const receipt = `u_${user.id.slice(0, 8)}_${Date.now()}`;
  const rzp = await createRazorpayOrderId(totalAmount, receipt);
  if ("error" in rzp) {
    return { error: rzp.error };
  }

  const { data: profile } = await supabase.from("profiles").select("full_name, phone_number").eq("id", user.id).single();

  const keyId = getPublicRazorpayKeyId();
  if (!keyId) {
    return { error: "Missing NEXT_PUBLIC_RAZORPAY_KEY_ID" };
  }

  return {
    keyId,
    orderId: rzp.orderId,
    amountPaise: rzp.amountPaise,
    currency: rzp.currency || "INR",
    prefill: {
      email: user.email ?? "",
      name: profile?.full_name?.trim() || user.email?.split("@")[0] || "Customer",
      contact: profile?.phone_number || "",
    },
  };
}

/** After Razorpay success — verify and persist order */
export async function verifyRazorpayAndPlaceOrder(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const razorpayOrderId = formData.get("razorpay_order_id") as string;
  const razorpayPaymentId = formData.get("razorpay_payment_id") as string;
  const razorpaySignature = formData.get("razorpay_signature") as string;
  const addressId = formData.get("addressId") as string;
  const requestGstInvoice = formData.get("gstInvoice") === "true";
  const paymentMethod = (formData.get("paymentMethod") as string) || "razorpay";

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return { error: "Missing payment details." };
  }

  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return { error: "Invalid payment signature." };
  }

  const rzpOrder = await fetchRazorpayOrder(razorpayOrderId);
  if (!rzpOrder) {
    return { error: "Could not verify payment order." };
  }

  const { cartItems, totalAmount, error, gst, shipping } = await getCartAndTotals(user.id);
  if (error || !cartItems) {
    return { error: error || "Cart is empty." };
  }

  const expectedPaise = inrToPaise(totalAmount);
  if (Number(rzpOrder.amount) !== expectedPaise) {
    console.error("[checkout] amount mismatch", rzpOrder.amount, expectedPaise);
    return { error: "Payment amount does not match your cart. Please try again." };
  }

  const { error: addrErr, shippingAddressId } = await validateShippingAddress(user.id, addressId || null);
  if (addrErr) {
    return { error: addrErr };
  }

  const taxAmountFinal = gst;
  const shippingAmount = shipping;

  const notesParts = [
    `payment:razorpay`,
    `razorpay_payment_id:${razorpayPaymentId}`,
    requestGstInvoice ? "gst_invoice:requested" : "gst_invoice:not_requested",
    `method:${paymentMethod}`,
  ].join(" | ");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "processing",
      total_amount: totalAmount,
      tax_amount: taxAmountFinal,
      shipping_amount: shippingAmount,
      discount_amount: 0,
      shipping_address_id: shippingAddressId || null,
      payment_status: "paid",
      notes: notesParts,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message || "Failed to create order" };
  }

  const orderItems = cartItems.map((item: { product_id: string; quantity: number; products?: { base_price?: number; name?: string } }) => {
    const unitPrice = item.products?.base_price || 0;
    const totalPrice = unitPrice * item.quantity;
    return {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    return { error: itemsError.message };
  }

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  if (isBrevoConfigured() && user.email) {
    const itemLines = cartItems.map((item: { products?: { name?: string; base_price?: number }; quantity: number }) => {
      const unit = item.products?.base_price || 0;
      const line = unit * item.quantity;
      return {
        name: item.products?.name || "Product",
        qty: item.quantity,
        lineTotal: formatPriceINR(line),
      };
    });
    const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    await sendBrevoEmail({
      toEmail: user.email,
      toName: prof?.full_name || undefined,
      subject: `Order confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
      htmlContent: buildOrderConfirmationHtml({
        orderId: order.id,
        totalFormatted: formatPriceINR(totalAmount),
        itemLines,
        customerName: prof?.full_name || undefined,
      }),
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account/orders");
  revalidatePath(`/checkout/success/${order.id}`);

  return { success: true as const, orderId: order.id };
}

/** Demo / dev: place order without Razorpay */
export async function placeOrder(formData: FormData) {
  if (isRazorpayConfigured()) {
    return { error: "Use the Pay with Razorpay button to complete payment." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }

  const userId = user.id;
  const addressId = formData.get("addressId") as string;
  const requestGstInvoice = formData.get("gstInvoice") === "true";
  const paymentMethod = (formData.get("paymentMethod") as string) || "card";

  const { cartItems, totalAmount, error, gst, shipping } = await getCartAndTotals(userId);
  if (error || !cartItems) {
    return { error: error || "Your cart is empty." };
  }

  const { error: addrErr, shippingAddressId } = await validateShippingAddress(userId, addressId || null);
  if (addrErr) {
    return { error: addrErr };
  }

  const taxAmount = gst ?? 0;
  const shippingAmount = shipping ?? 0;

  const notesParts = [
    `payment:${paymentMethod}`,
    requestGstInvoice ? "gst_invoice:requested" : "gst_invoice:not_requested",
  ].join(" | ");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "processing",
      total_amount: totalAmount,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: 0,
      shipping_address_id: shippingAddressId || null,
      payment_status: "paid",
      notes: notesParts,
    })
    .select("id")
    .single();

  if (orderError) return { error: orderError.message };

  const orderItems = cartItems.map((item: any) => {
    const unitPrice = item.products?.base_price || 0;
    const totalPrice = unitPrice * item.quantity;
    return {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return { error: itemsError.message };

  await supabase.from("cart_items").delete().eq("user_id", userId);

  if (isBrevoConfigured() && user.email) {
    const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", userId).single();
    const itemLines = cartItems.map((item: any) => ({
      name: item.products?.name || "Product",
      qty: item.quantity,
      lineTotal: formatPriceINR((item.products?.base_price || 0) * item.quantity),
    }));
    await sendBrevoEmail({
      toEmail: user.email,
      toName: prof?.full_name || undefined,
      subject: `Order confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
      htmlContent: buildOrderConfirmationHtml({
        orderId: order.id,
        totalFormatted: formatPriceINR(totalAmount),
        itemLines,
        customerName: prof?.full_name || undefined,
      }),
    });
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account/orders");
  revalidatePath(`/checkout/success/${order.id}`);
  return { success: true, orderId: order.id };
}

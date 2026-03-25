"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { formatPriceINR } from "@/lib/utils";

const MIN_ORDER_AMOUNT = 200; // ₹200 minimum order

export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please login to add items to cart" };
  }

  // Check product availability
  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity, base_price, name")
    .eq("id", productId)
    .single();

  if (!product) {
    return { error: "Product not found" };
  }

  if (product.stock_quantity < quantity) {
    return { error: `Only ${product.stock_quantity} items available` };
  }

  // Check if item already in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock_quantity) {
      return { error: `Cannot add more. Only ${product.stock_quantity} items available` };
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", existingItem.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/cart");
  revalidatePath("/");

  return { success: true };
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  const supabase = await createClient();

  if (quantity <= 0) {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function getCartSummary(userId: string) {
  const supabase = await createClient();

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", userId);

  if (!cartItems || cartItems.length === 0) {
    return { items: [], subtotal: 0, count: 0, belowMinimum: false, minimumRequired: MIN_ORDER_AMOUNT };
  }

  const subtotal = cartItems.reduce(
    (acc: number, item: any) => acc + (item.products?.base_price || 0) * item.quantity,
    0
  );

  return {
    items: cartItems,
    subtotal,
    count: cartItems.length,
    belowMinimum: subtotal < MIN_ORDER_AMOUNT,
    minimumRequired: MIN_ORDER_AMOUNT,
  };
}

export async function clearCart(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}
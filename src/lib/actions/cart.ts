"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCartFromForm(formData: FormData) {
  const productId = formData.get("productId") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  return addToCart(productId, quantity);
}

export async function addToCart(productId: string, quantity: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/");
  return { success: true };
}

export async function removeFromCartForm(formData: FormData) {
  const id = formData.get("cartItemId") as string;
  return removeFromCart(id);
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: true };
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  if (quantity < 1) return removeFromCart(cartItemId);

  const { data: row } = await supabase
    .from("cart_items")
    .select("id, products(stock_quantity)")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .single();

  const stock = (row?.products as { stock_quantity?: number } | null)?.stock_quantity;
  if (stock !== undefined && stock !== null && quantity > stock) {
    return { error: `Only ${stock} units available in stock.` };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: true };
}

export async function saveForLaterForm(formData: FormData) {
  const id = formData.get("cartItemId") as string;
  return saveForLater(id);
}

export async function saveForLater(cartItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: item } = await supabase
    .from("cart_items")
    .select("product_id, quantity")
    .eq("id", cartItemId)
    .eq("user_id", user.id)
    .single();

  if (!item) return { error: "Item not found" };

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", item.product_id)
    .single();

  if (!existing) {
    await supabase.from("wishlist_items").insert({
      user_id: user.id,
      product_id: item.product_id,
    });
  }

  await supabase.from("cart_items").delete().eq("id", cartItemId).eq("user_id", user.id);
  revalidatePath("/cart");
  revalidatePath("/account/wishlist");
  return { success: true };
}

export async function applyCoupon(formData: FormData) {
  const code = formData.get("code") as string;
  if (!code?.trim()) return { error: "Please enter a coupon code." };

  // Placeholder: in production, validate against a coupons table
  const validCoupons: Record<string, number> = { WELCOME10: 0.1, "FREESHIP": 15 };
  const discount = validCoupons[code.trim().toUpperCase()];
  if (discount === undefined) return { error: "Invalid or expired coupon." };

  return { success: true, discount: typeof discount === "number" ? discount : 0 };
}

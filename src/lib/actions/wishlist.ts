"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addToCart } from "./cart";

export async function addToWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) return { success: true, message: "Already in wishlist" };

  const { count } = await supabase
    .from("wishlist_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count || 0) >= 50) return { error: "Wishlist limit of 50 items reached." };

  const { error } = await supabase.from("wishlist_items").insert({
    user_id: user.id,
    product_id: productId,
  });

  if (error) return { error: error.message };
  revalidatePath("/account/wishlist");
  revalidatePath("/");
  return { success: true };
}

export async function removeFromWishlistForm(formData: FormData) {
  const id = formData.get("wishlistItemId") as string;
  return removeFromWishlist(id);
}

export async function removeFromWishlist(wishlistItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("id", wishlistItemId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/wishlist");
  return { success: true };
}

export async function addWishlistItemToCartForm(formData: FormData) {
  const id = formData.get("wishlistItemId") as string;
  return addWishlistItemToCart(id);
}

export async function addWishlistItemToCart(wishlistItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: item } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("id", wishlistItemId)
    .eq("user_id", user.id)
    .single();

  if (!item) return { error: "Item not found" };

  const result = await addToCart(item.product_id, 1);
  if (result.error) return result;

  await supabase.from("wishlist_items").delete().eq("id", wishlistItemId).eq("user_id", user.id);
  revalidatePath("/account/wishlist");
  revalidatePath("/cart");
  return { success: true };
}

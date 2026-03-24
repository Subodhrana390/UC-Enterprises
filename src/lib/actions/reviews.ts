"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const productId = formData.get("productId") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;
  const content = formData.get("content") as string;
  const headline = formData.get("headline") as string;

  if (!productId || !content) return { error: "Product and content are required." };

  const { data: existingReview, error: existingError } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existingReview) {
    return { error: "You have already reviewed this product." };
  }

  // Check if user has purchased the product
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("user_id", user.id);
  
  if (!orders || orders.length === 0) {
    return { error: "You must purchase this product before reviewing it." };
  }
  
  const orderIds = orders.map(o => o.id);
  const { data: orderItem } = await supabase
    .from("order_items")
    .select("id")
    .eq("product_id", productId)
    .in("order_id", orderIds)
    .limit(1);

  if (!orderItem || orderItem.length === 0) {
    return { error: "You must purchase this product before reviewing it." };
  }

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    product_id: productId,
    rating: Math.min(5, Math.max(1, rating)),
    comment: content,
  });

  if (error) return { error: error.message };
  revalidatePath("/account/reviews");
  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function updateReview(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const rating = parseInt(formData.get("rating") as string) || 5;
  const content = formData.get("content") as string;
  const headline = formData.get("headline") as string;

  const { data: review } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!review) return { error: "Review not found" };

  const { error } = await supabase
    .from("reviews")
    .update({
      rating: Math.min(5, Math.max(1, rating)),
      comment: content,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/reviews");
  revalidatePath(`/products/${review.product_id}`);
  revalidatePath(`/reviews/${id}/edit`);
  return { success: true };
}

export async function deleteReviewForm(formData: FormData) {
  const id = formData.get("reviewId") as string;
  return deleteReview(id);
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: review } = await supabase
    .from("reviews")
    .select("product_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!review) return { error: "Review not found" };

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/reviews");
  revalidatePath(`/products/${review.product_id}`);
  return { success: true };
}

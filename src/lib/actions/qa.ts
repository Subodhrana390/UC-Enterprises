"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Submit a question (customer)
export async function submitProductQuestion(productId: string, question: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to ask a question." };
  }

  if (!question.trim()) {
    return { error: "Question cannot be empty." };
  }

  const { error } = await supabase.from("product_qa").insert({
    product_id: productId,
    user_id: user.id,
    question: question.trim(),
    is_public: true,
  });

  if (error) {
    console.error("Error submitting question:", error);
    return { error: "Failed to submit question." };
  }

  revalidatePath(`/products/${productId}`);
  return { success: true, message: "Your question has been submitted!" };
}

// Get questions for a product (public only)
export async function getProductQuestions(productId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_qa")
    .select(`
      *,
      profiles:user_id (
        full_name
      ),
      answerer:answered_by (
        full_name
      )
    `)
    .eq("product_id", productId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  return data || [];
}

// Admin: Answer a question
export async function answerQuestion(qaId: string, answer: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("product_qa")
    .update({
      answer: answer.trim(),
      answered_by: user.id,
    })
    .eq("id", qaId);

  if (error) {
    console.error("Error answering question:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  return { success: true };
}

// Admin: Toggle question visibility
export async function toggleQuestionVisibility(qaId: string, isPublic: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_qa")
    .update({ is_public: isPublic })
    .eq("id", qaId);

  if (error) {
    console.error("Error toggling visibility:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  return { success: true };
}

// Admin: Delete question
export async function deleteQuestion(qaId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_qa")
    .delete()
    .eq("id", qaId);

  if (error) {
    console.error("Error deleting question:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  return { success: true };
}

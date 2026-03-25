"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProductQA(productId?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("product_qa")
    .select(`
      *,
      profiles(full_name, avatar_url),
      products(name, slug)
    `)
    .order("created_at", { ascending: false });

  if (productId) {
    query = query.eq("product_id", productId);
  }

  return query;
}

export async function getAllQA() {
  const supabase = await createClient();
  return supabase
    .from("product_qa")
    .select(`
      *,
      profiles(full_name, avatar_url),
      products(name, slug)
    `)
    .order("created_at", { ascending: false });
}

export async function answerQA(qaId: string, answer: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("product_qa")
    .update({
      answer,
      answered_by: user.id,
      is_public: true,
    })
    .eq("id", qaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  return { success: true };
}

export async function deleteQA(qaId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("product_qa").delete().eq("id", qaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  return { success: true };
}

export async function toggleQAPublic(qaId: string, isPublic: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("product_qa")
    .update({ is_public: isPublic })
    .eq("id", qaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  return { success: true };
}

// User-facing QA functions
export async function submitQuestion(productId: string, question: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please login to ask questions" };
  }

  const { error } = await supabase.from("product_qa").insert({
    product_id: productId,
    user_id: user.id,
    question,
    is_public: true,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getProductQuestions(productId: string) {
  const supabase = await createClient();
  return supabase
    .from("product_qa")
    .select(`
      *,
      profiles(full_name, avatar_url)
    `)
    .eq("product_id", productId)
    .eq("is_public", true)
    .order("created_at", { ascending: false });
}
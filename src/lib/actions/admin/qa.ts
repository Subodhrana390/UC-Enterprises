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

  const { data, error } = await supabase
    .from("product_qa")
    .select(`
      *,
      author:profiles!product_qa_user_id_fkey (
        full_name, 
        avatar_url
      ),
      responder:profiles!product_qa_answered_by_fkey (
        full_name
      ),
      products (
        name, 
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Error:", error.message);
    return { data: null, error };
  }

  return { data };
}

export async function answerQA(qaId: string, answer: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Verify User Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    console.error(`Attempt to answer QA by non-admin: ${user.id} (Role: ${profile?.role})`);
    return { error: "Only admins can answer questions." };
  }

  // 2. Perform Update
  const { data, error } = await supabase
    .from("product_qa")
    .update({
      answer: answer.trim(),
      answered_by: user.id,
      is_public: true,
    })
    .eq("id", qaId)
    .select();

  if (error) {
    console.error("Answer QA Update Error:", error);
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    console.warn(`Answer QA Update failed: No row found for ID ${qaId}. User: ${user.id}`);
    return { error: "Question not found or permission denied (RLS)." };
  }

  revalidatePath("/admin/qa");
  revalidatePath("/");
  return { success: true, data: data[0] };
}

export async function deleteQA(qaId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Verify User Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Only admins can delete questions." };
  }

  const { error } = await supabase.from("product_qa").delete().eq("id", qaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  revalidatePath("/");
  return { success: true };
}

export async function toggleQAPublic(qaId: string, isPublic: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // 1. Verify User Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Only admins can toggle visibility." };
  }

  const { error } = await supabase
    .from("product_qa")
    .update({ is_public: isPublic })
    .eq("id", qaId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/qa");
  revalidatePath("/");
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
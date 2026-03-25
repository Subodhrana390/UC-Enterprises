"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Submit quotation request
export async function submitQuotationRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to request a quotation." };
  }

  const subject = formData.get("subject") as string;
  const items = formData.get("items") as string;
  const message = formData.get("message") as string;

  if (!subject || !items) {
    return { error: "Subject and items are required." };
  }

  let parsedItems;
  try {
    parsedItems = JSON.parse(items);
  } catch {
    return { error: "Invalid items format." };
  }

  const { error } = await supabase.from("quote_requests").insert({
    user_id: user.id,
    subject,
    items: parsedItems,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting quotation:", error);
    return { error: "Failed to submit quotation request." };
  }

  revalidatePath("/account/quotes");
  return { success: true, message: "Quotation request submitted successfully!" };
}

// Get user's quotation requests
export async function getUserQuotations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotations:", error);
    return [];
  }

  return data || [];
}

// Get single quotation
export async function getQuotationById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching quotation:", error);
    return null;
  }

  return data;
}

// Admin: Get all quotations
export async function getAllQuotations() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quote_requests")
    .select(`
      *,
      profiles:user_id (
        full_name,
        phone_number
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotations:", error);
    return [];
  }

  return data || [];
}

// Admin: Update quotation
export async function updateQuotation(id: string, offeredPrice: number, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("quote_requests")
    .update({
      offered_price: offeredPrice,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating quotation:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/quotes");
  return { success: true };
}

// Admin: Delete quotation
export async function deleteQuotation(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("quote_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting quotation:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/quotes");
  return { success: true };
}

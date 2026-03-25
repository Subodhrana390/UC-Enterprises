"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Get all fabrication requests for admin
export async function getFabricationRequests() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("fabrication_requests")
    .select(`
      *,
      profiles:user_id (
        full_name,
        phone_number
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching fabrication requests:", error);
    return [];
  }

  return data || [];
}

// Submit fabrication request from customer
export async function submitFabricationRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const serviceType = formData.get("serviceType") as string;
  const quantity = formData.get("quantity") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const gst = formData.get("gst") as string;
  const timeline = formData.get("timeline") as string || "standard";

  if (!serviceType || !email || !fullName) {
    return { error: "Service type, full name, and email are required." };
  }

  const description = JSON.stringify({
    contact: fullName,
    email,
    company: company || "N/A",
    gst: gst || "N/A",
    timeline,
    quantity: quantity || "N/A"
  });

  const { error } = await supabase.from("fabrication_requests").insert({
    user_id: user?.id || null,
    service_type: serviceType,
    description,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting fabrication request:", error);
    return { error: "Failed to submit request. Please try again." };
  }

  revalidatePath("/fabrication");
  revalidatePath("/admin/fabrication");
  return { success: true, message: "Quote request received. Our team will contact you within 24 hours." };
}

// Update fabrication request status
export async function updateFabricationStatus(id: string, status: string, adminNotes?: string) {
  const supabase = await createClient();

  const updates: any = { status };
  if (adminNotes) {
    updates.admin_notes = adminNotes;
  }
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("fabrication_requests")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating fabrication status:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/fabrication");
  return { success: true };
}

// Delete fabrication request
export async function deleteFabricationRequest(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("fabrication_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting fabrication request:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/fabrication");
  return { success: true };
}

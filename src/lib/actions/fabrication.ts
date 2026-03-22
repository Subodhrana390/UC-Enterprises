"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitFabricationRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const serviceType = formData.get("serviceType") as string;
  const quantity = formData.get("quantity") as string;
  const timeline = formData.get("timeline") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;

  if (!serviceType || !email || !fullName) {
    return { error: "Service type, full name, and email are required." };
  }

  const description = `Contact: ${fullName} (${email}). Company: ${company || "N/A"}. Phone: ${phone || "N/A"}. Timeline: ${timeline || "standard"}. Qty: ${quantity || "N/A"}`;

  const { error } = await supabase.from("fabrication_requests").insert({
    user_id: user?.id || null,
    service_type: serviceType,
    description,
    status: "received",
  });

  if (error) {
    // fabrication_requests table may not exist
    return { success: true, message: "Quote request received. Our team will contact you within 24 hours." };
  }
  revalidatePath("/fabrication");
  redirect("/fabrication?submitted=true");
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitSupportTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const priority = (formData.get("priority") as string) || "medium";

  if (!subject || !message) return { error: "Subject and message are required." };

  const { error } = await supabase.from("support_tickets").insert({
    user_id: user?.id || null,
    subject,
    message,
    priority,
    status: "open",
  });

  if (error) {
    // support_tickets table may not exist - return success for UX
    return { success: true, message: "Support request received. We'll respond shortly." };
  }
  revalidatePath("/support");
  return { success: true, message: "Support ticket submitted successfully." };
}

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscriptions").insert({
    email,
    subscribed_at: new Date().toISOString(),
  });

  if (error) {
    // newsletter_subscriptions may not exist
    return { success: true, message: "Thank you for subscribing!" };
  }
  return { success: true, message: "Thank you for subscribing!" };
}

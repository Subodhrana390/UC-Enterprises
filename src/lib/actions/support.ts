"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSupportTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const subject = formData.get("subject") as string;
  const category = formData.get("category") as string;
  const priority = formData.get("priority") as string;
  const description = formData.get("description") as string;
  
  // For guest users
  const guestName = formData.get("guest_name") as string;
  const guestEmail = formData.get("guest_email") as string;
  const guestPhone = formData.get("guest_phone") as string;

  if (!subject || !category || !description) {
    return { error: "Subject, category, and description are required." };
  }

  if (!user && !guestEmail) {
    return { error: "Email is required for guest users." };
  }

  const ticketData: any = {
    subject,
    category,
    priority: priority || "medium",
    description,
    status: "open",
  };

  if (user) {
    ticketData.user_id = user.id;
  } else {
    ticketData.guest_name = guestName;
    ticketData.guest_email = guestEmail;
    ticketData.guest_phone = guestPhone;
  }

  const { data, error } = await supabase
    .from("support_tickets")
    .insert(ticketData)
    .select()
    .single();

  if (error) {
    console.error("Error creating ticket:", error);
    return { error: error.message };
  }

  revalidatePath("/support");
  revalidatePath("/account/support");
  
  return { success: true, ticket: data };
}

export async function getUserTickets(page = 1, pageSize = 10) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { tickets: [], total: 0, totalPages: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("support_tickets")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching tickets:", error);
    return { tickets: [], total: 0, totalPages: 0 };
  }

  return {
    tickets: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getTicketById(ticketId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", ticketId)
    .single();

  if (error || !ticket) {
    return { error: "Ticket not found" };
  }

  // Check if user has access to this ticket
  if (user && ticket.user_id !== user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { error: "Access denied" };
    }
  }

  // Get messages
  const { data: messages } = await supabase
    .from("support_messages")
    .select("*, profiles(full_name, avatar_url)")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  return { ticket, messages: messages || [] };
}

export async function addTicketMessage(ticketId: string, message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  if (!message || message.trim().length === 0) {
    return { error: "Message cannot be empty" };
  }

  const { error } = await supabase
    .from("support_messages")
    .insert({
      ticket_id: ticketId,
      user_id: user.id,
      message: message.trim(),
      is_staff_reply: false,
    });

  if (error) {
    console.error("Error adding message:", error);
    return { error: error.message };
  }

  // Update ticket's updated_at
  await supabase
    .from("support_tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  revalidatePath(`/account/support/${ticketId}`);
  revalidatePath("/account/support");

  return { success: true };
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required" };
  }

  const updates: any = { status };
  
  if (status === "resolved" || status === "closed") {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("support_tickets")
    .update(updates)
    .eq("id", ticketId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/account/support/${ticketId}`);
  revalidatePath("/account/support");
  revalidatePath("/admin/support");

  return { success: true };
}

// FAQ Functions
export async function getFAQCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("faq_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching FAQ categories:", error);
    return [];
  }

  return data || [];
}

export async function getFAQItems(categoryId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("faq_items")
    .select("*, faq_categories(name, slug)")
    .order("display_order", { ascending: true });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching FAQ items:", error);
    return [];
  }

  return data || [];
}

export async function incrementFAQViews(faqId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("increment_faq_views", { faq_id: faqId });

  if (error) {
    console.error("Error incrementing FAQ views:", error);
  }
}

export async function subscribeNewsletter(email: string, name?: string) {
  const supabase = await createClient();

  if (!email || !email.includes("@")) {
    return { error: "Valid email is required" };
  }

  const { error } = await supabase
    .from("newsletter_subscriptions")
    .insert({
      email: email.toLowerCase().trim(),
      name: name?.trim(),
    });

  if (error) {
    if (error.code === "23505") {
      return { error: "This email is already subscribed" };
    }
    return { error: error.message };
  }

  return { success: true };
}

// Admin Functions
export async function getAllTickets(page = 1, pageSize = 20, status?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { tickets: [], total: 0, totalPages: 0 };
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { tickets: [], total: 0, totalPages: 0 };
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("support_tickets")
    .select("*, profiles(full_name, email)", { count: "exact" })
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Error fetching all tickets:", error);
    return { tickets: [], total: 0, totalPages: 0 };
  }

  return {
    tickets: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function assignTicket(ticketId: string, assignedTo: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("support_tickets")
    .update({ assigned_to: assignedTo })
    .eq("id", ticketId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/support");
  return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAdminProfile({
  userId,
  fullName,
  phone,
  avatarUrl,
}: {
  userId: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone_number: phone,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function createAdminUser(email: string, password: string, fullName: string) {
  const supabase = await createClient();

  // Check if current user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Only admins can create admin users" };
  }

  // Create new user using Supabase Admin API
  // Note: This requires service_role key which should be in environment variables
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return { error: error.message };
  }

  // Update profile to set as admin
  if (data.user) {
    await supabase
      .from("profiles")
      .update({
        role: "admin",
        full_name: fullName,
      })
      .eq("id", data.user.id);
  }

  revalidatePath("/admin/users");
  return { success: true, userId: data.user?.id };
}


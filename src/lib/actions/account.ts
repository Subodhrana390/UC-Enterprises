"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const companyName = formData.get("companyName") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      company_name: companyName || null,
      full_name: `${firstName || ""} ${lastName || ""}`.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/profile");
  return { success: true };
}

export async function addAddress(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const label = formData.get("label") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const country = formData.get("country") as string;
  const type = (formData.get("type") as string) || "shipping";
  const isDefault = formData.get("isDefault") === "true";

  if (!street || !city || !zip || !country) {
    return { error: "Street, city, zip, and country are required." };
  }

  if (isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: user.id,
    full_name: label || "Customer",
    phone_number: "",
    address_line1: street,
    city,
    state: state || "",
    pincode: zip,
    type,
    is_default: isDefault,
  });

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

export async function updateAddress(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const label = formData.get("label") as string;
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const country = formData.get("country") as string;
  const isDefault = formData.get("isDefault") === "true";

  if (isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      full_name: label || "Customer",
      address_line1: street,
      city,
      state: state || "",
      pincode: zip,
      is_default: isDefault,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

export async function deleteAddressForm(formData: FormData) {
  const id = formData.get("addressId") as string;
  return deleteAddress(id);
}

export async function deleteAddress(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

export async function setDefaultAddressForm(formData: FormData) {
  const id = formData.get("addressId") as string;
  return setDefaultAddress(id);
}

export async function setDefaultAddress(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }
  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  revalidatePath("/account/settings");
  return { success: true };
}

export async function updateNotificationSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({
      notify_order_updates: formData.get("orderUpdates") === "on",
      notify_price_alerts: formData.get("priceAlerts") === "on",
      notify_stock_alerts: formData.get("stockAlerts") === "on",
      notify_newsletter: formData.get("newsletter") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/settings");
  return { success: true };
}

export async function updateDisplaySettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("profiles")
    .update({
      currency: formData.get("currency") as string,
      language: formData.get("language") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/settings");
  return { success: true };
}

export async function requestDeactivation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // In production, you'd add a deactivation_requested flag and workflow
  const { error } = await supabase
    .from("profiles")
    .update({ deactivation_requested: true, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/account/settings");
  return { success: true, message: "Deactivation request submitted." };
}

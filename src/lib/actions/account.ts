"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadPublicImage } from "./admin";

export async function updateProfile(userId: string, fullName: string, phone_number: string, avatarFile: File | null) {
  const supabase = await createClient();

  let avatarUrl = "";

  if (avatarFile) {
    const upload = await uploadPublicImage(avatarFile, "avatars", "users");
    if (upload.error) return { error: upload.error.message };
    if (upload.data) avatarUrl = upload.data;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone_number: phone_number || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) return { error: error.message };
  revalidatePath("/account/profile");
  return { success: true };
}

export async function addAddress(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };


  const addressLabel = (formData.get("label") as string) || "Home";
  const receiverName = (formData.get("full_name") as string);
  const street = formData.get("street") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const phone = formData.get("phone") as string;
  const country = formData.get("country") as string;
  const type = (formData.get("type") as string) || "shipping";
  const isDefault = formData.get("isDefault") === "true";

  if (!street || !city || !zip || !country || !receiverName || !phone) {
    return { error: "Name, Street, City, Pincode, Country, and Phone are required." };
  }

  try {
    if (isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);
    }


    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      label: addressLabel,
      full_name: receiverName,
      phone_number: phone,
      address_line1: street,
      city: city,
      state: state || "",
      pincode: zip,
      type: type,
      is_default: isDefault,
    });

    if (error) {
      console.error("Database Error:", error);
      return { error: error.message };
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return { success: true };

  } catch (err) {
    return { error: "An unexpected error occurred." };
  }
}

export async function updateAddress(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("addresses")
    .update({
      label: formData.get("label"),
      full_name: formData.get("full_name"),
      address_line1: formData.get("street"),
      city: formData.get("city"),
      pincode: formData.get("zip"),
      phone_number: formData.get("phone"),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/account/addresses");
  return { success: true };
}

// --- Form Wrappers ---
export async function setDefaultAddressForm(formData: FormData) {
  const id = formData.get("addressId") as string;
  if (!id) return { error: "Address ID is missing" };
  return setDefaultAddress(id);
}

export async function deleteAddressForm(formData: FormData) {
  const id = formData.get("addressId") as string;
  if (!id) return { error: "Address ID is missing" };
  return deleteAddress(id);
}

export async function setDefaultAddress(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {

    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);


    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteAddress(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  try {
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
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


export async function getUserDashboardData(userId: string) {
  try {
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (profileError) throw profileError;

    // Fetch last 5 orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);
    if (ordersError) throw ordersError;

    // Fetch wishlist count
    const { count: wishlistCount, error: wishlistError } = await supabase
      .from("wishlist_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (wishlistError) throw wishlistError;

    // Fetch addresses
    const { data: addresses, error: addressesError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId);
    if (addressesError) throw addressesError;

    return {
      profile,
      orders,
      wishlistCount: wishlistCount || 0,
      addresses: addresses || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      profile: null,
      orders: [],
      wishlistCount: 0,
      addresses: [],
    };
  }
}
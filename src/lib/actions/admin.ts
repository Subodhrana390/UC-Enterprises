"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdminBrands() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");
  
  if (error) {
    console.error("Error fetching admin brands:", error);
    return [];
  }
  return data;
}

export async function getAdminUsers() {
  const supabase = await createClient();
  // In a real app, you'd fetch from auth.users via a secure RPC or a public.users table
  const { data, error } = await supabase
    .from("profiles") // Assuming a profiles table linked to auth.users
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
  return data;
}

export async function getInventoryStatus() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, sku, stock_quantity, base_price")
    .order("stock_quantity", { ascending: true });

  if (error) {
    console.error("Error fetching inventory status:", error);
    return [];
  }
  return data;
}

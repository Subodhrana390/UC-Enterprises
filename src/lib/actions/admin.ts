"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

// Products CRUD
export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name?.toLowerCase().replace(/\s+/g, "-");
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const brandId = formData.get("brandId") as string;
  const categoryId = formData.get("categoryId") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string) || 0;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string) || 0;

  if (!name || !sku || !brandId || !categoryId) return { error: "Name, SKU, brand, and category are required." };

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    sku,
    description: description || null,
    brand_id: brandId,
    category_id: categoryId,
    base_price: basePrice,
    stock_quantity: stockQuantity,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = {};
  const fields = ["name", "slug", "sku", "description", "brand_id", "category_id", "base_price", "stock_quantity", "is_featured"];
  fields.forEach((f) => {
    const v = formData.get(f);
    if (v !== null && v !== undefined && v !== "") {
      if (f === "base_price") updates[f] = parseFloat(v as string);
      else if (f === "stock_quantity" || f === "is_featured") updates[f] = f === "is_featured" ? v === "true" : parseInt(v as string);
      else updates[f] = v;
    }
  });

  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function deleteProductForm(formData: FormData) {
  const id = formData.get("productId") as string;
  return deleteProduct(id);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  return { success: true };
}

// Categories CRUD
export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name?.toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required." };

  const { error } = await supabase.from("categories").insert({ name, slug, description: description || null });
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description;

  const { error } = await supabase.from("categories").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

// Brands CRUD
export async function createBrand(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || name?.toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description") as string;
  const isFeatured = formData.get("isFeatured") === "true";

  if (!name) return { error: "Name is required." };

  const { error } = await supabase.from("brands").insert({ name, slug, description: description || null, is_featured: isFeatured });
  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  return { success: true };
}

export async function updateBrand(id: string, formData: FormData) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = {};
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const isFeatured = formData.get("isFeatured");
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description;
  if (isFeatured !== undefined) updates.is_featured = isFeatured === "true";

  const { error } = await supabase.from("brands").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  return { success: true };
}

// Inventory
export async function adjustStockForm(formData: FormData) {
  const productId = formData.get("productId") as string;
  const delta = parseInt(formData.get("delta") as string) || 0;
  return adjustStock(productId, delta);
}

export async function adjustStock(productId: string, quantity: number) {
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("stock_quantity").eq("id", productId).single();
  if (!product) return { error: "Product not found" };

  const newQty = Math.max(0, (product.stock_quantity || 0) + quantity);
  const { error } = await supabase.from("products").update({ stock_quantity: newQty }).eq("id", productId);
  if (error) return { error: error.message };
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { success: true };
}

// Orders/Quotes
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  if (error) return { error: error.message };
  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
  return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toOptionalNumber(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

async function uploadPublicImage(
  file: File,
  bucket: string,
  folder: string,
) {
  if (!file || file.size === 0) return { data: null, error: null };
  const supabase = await createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) return { data: null, error };
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { data: data.publicUrl, error: null };
}

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
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || toSlug(name || "");
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const brandId = ((formData.get("brand_id") ?? formData.get("brandId")) as string) || null;
  const categoryId = ((formData.get("category_id") ?? formData.get("categoryId")) as string) || null;
  const basePrice = toOptionalNumber(formData.get("base_price") ?? formData.get("basePrice"));
  const compareAtPrice = toOptionalNumber(formData.get("compare_at_price") ?? formData.get("compareAtPrice"));
  const minOrderQuantity = toOptionalNumber(formData.get("min_order_quantity") ?? formData.get("minOrderQuantity")) ?? 1;
  const stockQuantity = toOptionalNumber(formData.get("stock_quantity") ?? formData.get("stockQuantity")) ?? 0;
  const isFeatured = formData.get("isFeatured") === "true";
  const isLatest = formData.get("isLatest") !== "false";
  const imageFiles = formData
    .getAll("productImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (!name || !sku || basePrice === null) return { error: "Name, SKU, and valid base price are required." };

  const uploadedImageUrls: string[] = [];
  for (const image of imageFiles) {
    const upload = await uploadPublicImage(image, "product-images", "products");
    if (upload.error) return { error: `Product image upload failed: ${upload.error.message}` };
    if (upload.data) uploadedImageUrls.push(upload.data);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name,
    slug,
    sku,
    description: description || null,
    brand_id: brandId,
    category_id: categoryId,
    base_price: basePrice,
    compare_at_price: Number.isNaN(compareAtPrice as number) ? null : compareAtPrice,
    min_order_quantity: Math.max(1, minOrderQuantity),
    stock_quantity: stockQuantity,
    is_featured: isFeatured,
    is_latest: isLatest,
    images: uploadedImageUrls,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const updates: Record<string, unknown> = {};
  const name = formData.get("name") as string | null;
  const slug = formData.get("slug") as string | null;
  const sku = formData.get("sku") as string | null;
  const description = formData.get("description");
  const brandId = formData.get("brand_id") ?? formData.get("brandId");
  const categoryId = formData.get("category_id") ?? formData.get("categoryId");
  const basePrice = toOptionalNumber(formData.get("base_price") ?? formData.get("basePrice"));
  const compareAtPrice = formData.has("compare_at_price") || formData.has("compareAtPrice")
    ? toOptionalNumber(formData.get("compare_at_price") ?? formData.get("compareAtPrice"))
    : undefined;
  const minOrderQuantity = toOptionalNumber(formData.get("min_order_quantity") ?? formData.get("minOrderQuantity"));
  const stockQuantity = toOptionalNumber(formData.get("stock_quantity") ?? formData.get("stockQuantity"));
  const isFeatured = formData.get("is_featured") ?? formData.get("isFeatured");
  const isLatest = formData.get("is_latest") ?? formData.get("isLatest");

  if (name !== null && name !== "") updates.name = name;
  if (slug !== null && slug !== "") updates.slug = slug;
  if (sku !== null && sku !== "") updates.sku = sku;
  if (description !== null) updates.description = description === "" ? null : description;
  if (brandId !== null) updates.brand_id = brandId === "" ? null : brandId;
  if (categoryId !== null) updates.category_id = categoryId === "" ? null : categoryId;
  if (basePrice !== null) updates.base_price = basePrice;
  if (compareAtPrice !== undefined) updates.compare_at_price = compareAtPrice;
  if (minOrderQuantity !== null) updates.min_order_quantity = Math.max(1, minOrderQuantity);
  if (stockQuantity !== null) updates.stock_quantity = Math.max(0, stockQuantity);
  if (isFeatured !== null) updates.is_featured = isFeatured === "true";
  if (isLatest !== null) updates.is_latest = isLatest === "true";

  const existingImages = formData
    .getAll("existingImages")
    .filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  const imageFiles = formData
    .getAll("productImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (imageFiles.length > 0 || existingImages.length > 0) {
    const uploadedImageUrls: string[] = [];
    for (const image of imageFiles) {
      const upload = await uploadPublicImage(image, "product-images", "products");
      if (upload.error) return { error: `Product image upload failed: ${upload.error.message}` };
      if (upload.data) uploadedImageUrls.push(upload.data);
    }
    updates.images = [...existingImages, ...uploadedImageUrls];
  }

  const supabase = await createClient();
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
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || toSlug(name || "");
  const description = formData.get("description") as string;
  const parentId = (formData.get("parentId") as string) || null;
  let icon = (formData.get("icon") as string) || null;
  const iconFile = formData.get("iconFile");

  if (!name) return { error: "Name is required." };
  if (iconFile instanceof File && iconFile.size > 0) {
    const upload = await uploadPublicImage(iconFile, "category-icons", "categories");
    if (upload.error) return { error: `Category icon upload failed: ${upload.error.message}` };
    icon = upload.data;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description: description || null,
    parent_id: parentId,
    icon,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string) || (name ? toSlug(name) : "");
  const description = formData.get("description") as string;
  const parentId = formData.get("parentId") as string;
  const icon = formData.get("icon") as string;
  const iconFile = formData.get("iconFile");

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (slug) updates.slug = slug;
  if (description !== undefined) updates.description = description || null;
  if (parentId !== null) updates.parent_id = parentId || null;
  if (icon !== null) updates.icon = icon || null;
  if (iconFile instanceof File && iconFile.size > 0) {
    const upload = await uploadPublicImage(iconFile, "category-icons", "categories");
    if (upload.error) return { error: `Category icon upload failed: ${upload.error.message}` };
    updates.icon = upload.data;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(updates).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function saveCategoryForm(formData: FormData) {
  const id = formData.get("id") as string | null;
  if (id) return updateCategory(id, formData);
  return createCategory(formData);
}

export async function deleteCategoryForm(formData: FormData) {
  const id = formData.get("categoryId") as string;
  return deleteCategory(id);
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
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

export async function saveBrandForm(formData: FormData) {
  const id = formData.get("id") as string | null;
  if (id) return updateBrand(id, formData);
  return createBrand(formData);
}

export async function deleteBrandForm(formData: FormData) {
  const id = formData.get("brandId") as string;
  return deleteBrand(id);
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  revalidatePath("/admin/products");
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

export async function saveProductForm(formData: FormData) {
  const id = formData.get("id") as string | null;
  if (id) return updateProduct(id, formData);
  return createProduct(formData);
}

export async function saveInventoryForm(formData: FormData) {
  const id = formData.get("productId") as string;
  const updateData = new FormData();
  const currentStock = parseInt((formData.get("currentStock") as string) || "0", 10) || 0;
  const deltaRaw = parseInt((formData.get("delta") as string) || "0", 10) || 0;
  const stockQuantityRaw = formData.get("stockQuantity") as string;
  const stockQuantity = stockQuantityRaw ? parseInt(stockQuantityRaw, 10) : currentStock + deltaRaw;
  updateData.set("stock_quantity", String(Math.max(0, Number.isNaN(stockQuantity) ? currentStock : stockQuantity)));
  return updateProduct(id, updateData);
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


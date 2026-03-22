"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase =  await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

export async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), brands(*)")
    .eq("is_featured", true)
    .limit(8);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return data;
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(*),
      brands(*),
      pricing_tiers(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(categorySlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories!inner(*), brands(*)")
    .eq("categories.slug", categorySlug);

  if (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    return [];
  }

  return data;
}

export async function searchProducts({ 
  query, 
  category, 
  manufacturer, 
  minPrice, 
  maxPrice,
  sort = "relevant"
}: { 
  query?: string; 
  category?: string; 
  manufacturer?: string; 
  minPrice?: number; 
  maxPrice?: number;
  sort?: string;
}) {
  const supabase = await createClient();
  let q = supabase
    .from("products")
    .select("*, categories!inner(*), brands!inner(*)");

  if (query) {
    q = q.ilike("name", `%${query}%`);
  }

  if (category) {
    q = q.eq("categories.slug", category);
  }

  if (manufacturer) {
    q = q.eq("brands.name", manufacturer);
  }

  if (minPrice !== undefined) {
    q = q.gte("base_price", minPrice);
  }

  if (maxPrice !== undefined) {
    q = q.lte("base_price", maxPrice);
  }

  // Sorting
  switch (sort) {
    case "price-low":
      q = q.order("base_price", { ascending: true });
      break;
    case "price-high":
      q = q.order("base_price", { ascending: false });
      break;
    case "stock-high":
      q = q.order("stock_quantity", { ascending: false });
      break;
    default:
      q = q.order("is_featured", { ascending: false });
  }

  const { data, error } = await q;

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data;
}

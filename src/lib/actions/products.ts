"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getShopCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      icon,
      products (count)
    `)
    .order("name", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data.map(cat => ({
    ...cat,
    productCount: cat.products?.[0]?.count || 0
  }));
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

export async function getLatestProducts(limit = 8) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      brands (name),
      categories (name)
    `)
    .eq("is_latest", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest products:", error);
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
      brands (name, slug),
      categories (name, slug)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching product ${id}:`, error.message);
    return null;
  }

  if (!data) return null;

  const { data: reviewRows, error: reviewError } = await supabase
    .from("reviews")
    .select(`
      id, 
      rating, 
      comment, 
      created_at, 
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  if (reviewError) {
    console.error(`Error fetching reviews for ${id}:`, reviewError.message);
  }

  const reviews = reviewRows ?? [];

  const totalRating = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    ...data,
    productReviews: reviews,
    avgRating: parseFloat(avgRating.toFixed(1)),
    reviewCount: reviews.length
  };
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
  minRating,
  availability,
  sort = "relevant"
}: {
  query?: string;
  category?: string;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: "in" | "out";
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

  if (minRating !== undefined) {
    q = q.gte("rating", minRating);
  }

  if (availability === "in") {
    q = q.gt("stock_quantity", 0);
  }
  if (availability === "out") {
    q = q.lte("stock_quantity", 0);
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
    case "newest":
      q = q.order("created_at", { ascending: false });
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

export async function getRelatedProducts(categorySlug: string, currentProductId: string, limit = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories!inner(slug, name),
      brands(*),
      reviews(
        rating
      )
    `)
    .eq("categories.slug", categorySlug)
    .neq("id", currentProductId)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching related products:", error);
    return [];
  }

  const productsWithMeta = data.map((product) => {
    const reviews = product.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewCount
      : 0;

    return {
      ...product,
      review_count: reviewCount,
      average_rating: averageRating.toFixed(1)
    };
  });

  return productsWithMeta;
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    sku: formData.get("sku") as string,
    base_price: parseFloat(formData.get("price") as string),
    stock_quantity: parseInt(formData.get("inventory") as string),
    category_id: formData.get("category_id") as string,
    brand_id: formData.get("brand_id") as string,
    status: formData.get("status") as string || "active",
  };

  const { error } = await supabase.from("products").insert([rawFormData]);

  if (error) {
    console.error(error);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

/**
 * Fetches all brands/vendors for the product management forms.
 * Ordered alphabetically for a better merchant experience.
 */
export async function getBrands() {
  const supabase = await createClient();

  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return brands;
}
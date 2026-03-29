/**
 * Category utility functions
 */

import { createClient } from "../supabase/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null | undefined;
  icon?: string | null;
  productCount?: number;
  [key: string]: any;
}

/**
 * Check if a category is a top-level (parent) category
 */
export function isParentCategory(category: Category): boolean {
  return category.parent_id === null || category.parent_id === undefined;
}

/**
 * Check if a category is a subcategory
 */
export function isSubcategory(category: Category): boolean {
  return category.parent_id !== null && category.parent_id !== undefined;
}

/**
 * Get all parent categories from a list
 */
export function getParentCategories(categories: Category[]): Category[] {
  return categories.filter(isParentCategory);
}

/**
 * Get all subcategories from a list
 */
export function getSubcategories(categories: Category[]): Category[] {
  return categories.filter(isSubcategory);
}

/**
 * Get subcategories for a specific parent
 */
export function getSubcategoriesForParent(categories: Category[], parentId: string): Category[] {
  return categories.filter(cat => cat.parent_id === parentId);
}

export async function getAllCategoriesTreeManual() {
  const supabase = await createClient();

  // Fetch all categories
  const { data: allCategories, error } = await supabase
    .from("categories")
    .select("id, name, slug, icon, parent_id")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  const buildTree = (parentId: string | null): any[] => {
    return allCategories
      .filter((category) => category.parent_id === parentId)
      .map((category) => ({
        ...category,
        subcategories: buildTree(category.id),
        productCount: 0
      }));
  };

  return buildTree(null);
}
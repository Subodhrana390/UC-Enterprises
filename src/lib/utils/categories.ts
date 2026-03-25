/**
 * Category utility functions
 */

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

/**
 * Build a category tree structure
 */
export function buildCategoryTree(categories: Category[]): (Category & { subcategories: Category[] })[] {
  const parents = getParentCategories(categories);
  const children = getSubcategories(categories);
  
  return parents.map(parent => ({
    ...parent,
    subcategories: children.filter(child => child.parent_id === parent.id)
  }));
}

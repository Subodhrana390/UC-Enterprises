# Pagination Implementation

Pagination has been implemented across both shop and admin sections to handle large datasets efficiently.

## Components Created

### 1. UI Components
- `src/components/ui/pagination.tsx` - Base pagination UI primitives
- `src/components/shared/PaginationControls.tsx` - Reusable pagination controls with URL state management

## Server Actions Updated

### Products Actions (`src/lib/actions/products.ts`)
- `searchProducts()` - Added pagination support (page, pageSize parameters)
- `getProductsByCategory()` - Added pagination support
- Returns: `{ products, total, totalPages }`

### Admin Actions (`src/lib/actions/admin.ts`)
New paginated functions added:
- `getAdminProducts(page, pageSize)` - Paginated products for admin
- `getAdminOrders(page, pageSize)` - Paginated orders
- `getAdminUsersPaginated(page, pageSize)` - Paginated users
- `getAdminInventory(page, pageSize)` - Paginated inventory
- `getAdminBrandsPaginated(page, pageSize)` - Paginated brands
- `getAdminCategories(page, pageSize)` - Paginated categories
- `getAdminQuotes(page, pageSize)` - Paginated quotes

## Pages Updated

### Shop Side
1. **Search Page** (`src/app/(shop)/search/page.tsx`)
   - 20 products per page
   - Maintains filter state in URL

2. **Category Page** (`src/app/(shop)/categories/[slug]/page.tsx`)
   - 20 products per page
   - Pagination per category

3. **Account Orders** (`src/app/(account)/account/orders/page.tsx`)
   - 10 orders per page

### Admin Side
1. **Products** (`src/app/(admin)/admin/products/page.tsx`) - 20 per page
2. **Orders** (`src/app/(admin)/admin/orders/page.tsx`) - 20 per page
3. **Brands** (`src/app/(admin)/admin/brands/page.tsx`) - 20 per page
4. **Categories** (`src/app/(admin)/admin/categories/page.tsx`) - 20 per page
5. **Inventory** (`src/app/(admin)/admin/inventory/page.tsx`) - 20 per page
6. **Users** (`src/app/(admin)/admin/users/page.tsx`) - 20 per page
7. **Quotes** (`src/app/(admin)/admin/quotes/page.tsx`) - 20 per page

## Features

- Server-side pagination using Supabase `.range(from, to)`
- URL-based page state (preserves filters and search params)
- Smart page number display (shows ellipsis for large page counts)
- Disabled prev/next buttons at boundaries
- Consistent 20 items per page for admin, 10-20 for shop
- Total count tracking with `{ count: "exact" }`

## Usage Example

```tsx
// In page component
const { products, total, totalPages } = await getAdminProducts(page, 20);

// Render pagination
<PaginationControls 
  currentPage={page} 
  totalPages={totalPages} 
  basePath="/admin/products" 
/>
```

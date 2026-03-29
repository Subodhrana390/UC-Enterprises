import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProductsByCategory } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/server";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const queryParams = await searchParams;

  const page = queryParams.page
    ? parseInt(queryParams.page as string)
    : 1;
  const supabase = await createClient();

  // Get current category
  const { data: currentCategory } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  const { data: subcategoriesWithCounts = [] } = await supabase
    .from("category_product_counts")
    .select("id, name, slug, product_count,parent_id")
    .eq("parent_id", currentCategory.id);


  const parentProductsResult = await getProductsByCategory(
    slug,
    page,
    20
  );

  const { products: allProducts, total, totalPages } =
    parentProductsResult;

  const categoryName = currentCategory.name;

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-medium text-[#616161] mb-8 uppercase tracking-wider">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/categories">Collections</Link>
          <span>/</span>
          <span className="text-black">{categoryName}</span>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-[#ebebeb] pb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            {categoryName}
          </h1>

          <p className="text-[#616161] text-sm md:text-base max-w-2xl">
            {currentCategory.description ||
              `Discover our full range of ${categoryName}.`}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">

              {/* Subcategories */}
              {subcategoriesWithCounts && subcategoriesWithCounts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-6 border-b pb-2">
                    Subcategories
                  </h3>

                  <div className="space-y-3">
                    {subcategoriesWithCounts.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categories/${sub.slug}`}
                        className="flex justify-between text-sm hover:underline"
                      >
                        <span>{sub.name}</span>
                        <span className="text-xs text-gray-500">
                          ({sub.product_count})
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Manufacturer filter */}
              <div>
                <h3 className="text-sm font-semibold mb-6 border-b pb-2">
                  Manufacturer
                </h3>

                <div className="space-y-3">
                  {[
                    "STMicroelectronics",
                    "Texas Instruments",
                    "NXP",
                    "Microchip",
                  ].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Checkbox />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-10 border-b pb-4">
              <span className="text-sm text-[#616161]">
                {total} products
              </span>

              <Select defaultValue="popular">
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="popular">
                    Featured
                  </SelectItem>
                  <SelectItem value="price-low">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="newest">
                    Newest
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {allProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  brand={p.brands}
                  price={p.base_price}
                  image={p.image_url}
                  images={p.images}
                  rating={p.rating}
                  reviewCount={p.reviews.length}
                  stock_quantity={p.stock_quantity}
                />
              ))}
            </div>

            {/* Empty state */}
            {allProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">
                  No products found in this category.
                </p>
              </div>
            )}

            {/* Pagination */}
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              basePath={`/categories/${slug}`}
            />

          </div>
        </div>
      </main>
    </div>
  );
}
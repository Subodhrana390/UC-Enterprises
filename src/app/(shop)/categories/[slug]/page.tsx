import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getShopCategories, getProductsByCategory } from "@/lib/actions/products";
import { createClient } from "@/lib/supabase/server";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const page = queryParams.page ? parseInt(queryParams.page as string) : 1;

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

  // Get all categories to find subcategories
  const allCategories = await getShopCategories();
  const subcategories = allCategories.filter(cat => cat.parent_id === currentCategory.id);

  // Get products for this category with pagination
  const result = await getProductsByCategory(slug, page, 20);
  const { products, total, totalPages } = result;

  let allProducts = [...products];
  if (subcategories.length > 0 && page === 1) {
    for (const sub of subcategories) {
      const subResult = await getProductsByCategory(sub.slug, 1, 5);
      allProducts = [...allProducts, ...subResult.products];
    }
    allProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
  }

  const categoryName = currentCategory.name;

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-16">

        {/* Shopify Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-medium text-[#616161] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="opacity-50">/</span>
          <Link href="/categories" className="hover:text-black transition-colors">Collections</Link>
          <span className="opacity-50">/</span>
          <span className="text-black">{categoryName}</span>
        </nav>

        {/* Collection Header */}
        <header className="mb-12 border-b border-[#ebebeb] pb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1a1c1d] mb-6">
            {categoryName}
          </h1>
          <p className="text-[#616161] text-sm md:text-base max-w-2xl leading-relaxed">
            {currentCategory.description || `Discover our full range of ${categoryName}. Engineered for reliability and precision in modern industrial applications.`}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="text-sm font-semibold mb-6 pb-2 border-b border-[#ebebeb]">
                  Filter by
                </h3>
                <div className="space-y-8">
                  {/* Subcategories Filter */}
                  {subcategories.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-[#1a1c1d] mb-4 block">Subcategory</label>
                      <div className="space-y-3">
                        {subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/categories/${sub.slug}`}
                            className="flex items-center justify-between group cursor-pointer text-sm text-[#303030] hover:text-black"
                          >
                            <span className="group-hover:underline underline-offset-4 decoration-1">{sub.name}</span>
                            <span className="text-xs text-[#616161]">({sub.productCount})</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-[#1a1c1d] mb-4 block">Manufacturer</label>
                    <div className="space-y-3">
                      {["STMicroelectronics", "Texas Instruments", "NXP", "Microchip"].map((brand) => (
                        <label key={brand} className="flex items-center gap-3 group cursor-pointer text-sm text-[#303030] hover:text-black">
                          <Checkbox id={brand} className="rounded-sm border-[#d2d2d2] data-[state=checked]:bg-black data-[state=checked]:border-black" />
                          <span className="group-hover:underline underline-offset-4 decoration-1">{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Section */}
          <div className="flex-1">

            {/* Toolbar: Horizontal Filter/Sort */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#f5f5f5]">
              <span className="text-sm text-[#616161]">
                {total} products
              </span>

              <div className="flex items-center gap-4">
                <span className="text-sm text-[#1a1c1d]">Sort by:</span>
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[160px] h-9 border-[#ebebeb] rounded-sm text-sm focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
              {allProducts.map((p: any) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  brand={p.brands}
                  price={p.base_price || p.price}
                  image={p.image_url}
                  images={p.images}
                  stock_quantity={p.stock_quantity}
                />
              ))}
            </div>

            {allProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#616161] text-sm">No products found in this category.</p>
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
import { getShopCategories, searchProducts } from "@/lib/actions/products";
import { SearchClient } from "@/components/shop/SearchClient";
import { PaginationControls } from "@/components/shared/PaginationControls";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;

  const query = (params.q as string) || "";
  const category = (params.category as string) || "";
  const manufacturer = (params.manufacturer as string) || "";
  const minPrice = params.minPrice ? parseFloat(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice as string) : undefined;
  const minRating = params.minRating ? parseFloat(params.minRating as string) : undefined;
  const availability = (params.availability as "in" | "out" | undefined) || undefined;
  const sort = (params.sort as string) || "relevance";
  const page = params.page ? parseInt(params.page as string) : 1;

  const [searchResult, categories] = await Promise.all([searchProducts({
    query,
    category,
    manufacturer,
    minPrice,
    maxPrice,
    minRating,
    availability,
    sort,
    page,
    pageSize: 20
  }), getShopCategories()]);

  const { products, total, totalPages } = searchResult;
  const highestPrice = Math.max(1000, ...products.map((p: { base_price?: number }) => Number(p.base_price) || 0));

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Shopify Search Header */}
        <header className="mb-6 md:mb-8 border-b border-[#ebebeb] pb-6 md:pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {query ? `Search results for "${query}"` : "All Products"}
            </h1>
            <p className="text-sm text-[#616161]">
              {total} {total === 1 ? 'product' : 'products'} found
            </p>
          </div>
        </header>
        <SearchClient
          initialProducts={products}
          totalCount={total}
          query={query}
          categories={categories ?? []}
          maxPrice={highestPrice}
        />
        <PaginationControls currentPage={page} totalPages={totalPages} basePath="/search" />
      </main>
    </div>
  );
}
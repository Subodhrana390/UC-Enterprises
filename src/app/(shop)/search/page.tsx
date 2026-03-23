import { searchProducts } from "@/lib/actions/products";
import { SearchClient } from "@/components/shop/SearchClient";

// Shopify standard: Ensure the page is dynamic to reflect filter changes instantly
export const dynamic = "force-dynamic";

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  
  // Clean up params for Shopify-style filtering
  const query = (params.q as string) || "";
  const category = (params.category as string) || "";
  const manufacturer = (params.manufacturer as string) || "";
  const minPrice = params.minPrice ? parseFloat(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice as string) : undefined;
  const sort = (params.sort as string) || "relevance"; // Shopify default is usually 'featuerd' or 'relevance'

  const products = await searchProducts({
    query,
    category,
    manufacturer,
    minPrice,
    maxPrice,
    sort
  });

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Shopify Search Header */}
        <header className="mb-8 border-b border-[#ebebeb] pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {query ? `Search results for "${query}"` : "All Products"}
            </h1>
            <p className="text-sm text-[#616161]">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        </header>
        <SearchClient 
          initialProducts={products} 
          totalCount={products.length} 
          query={query} 
          activeFilters={{
            category,
            manufacturer,
            minPrice,
            maxPrice,
            sort
          }}
        />
      </main>
    </div>
  );
}
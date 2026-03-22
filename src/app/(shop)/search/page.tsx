import { searchProducts } from "@/lib/actions/products";
import { SearchClient } from "@/components/shop/SearchClient";

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const query = params.q as string || "";
  const category = params.category as string || "";
  const manufacturer = params.manufacturer as string || "";
  const minPrice = params.minPrice ? parseFloat(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice as string) : undefined;
  const sort = params.sort as string || "relevant";

  const products = await searchProducts({
    query,
    category,
    manufacturer,
    minPrice,
    maxPrice,
    sort
  });

  return (
    <SearchClient 
      initialProducts={products} 
      totalCount={products.length} 
      query={query} 
    />
  );
}

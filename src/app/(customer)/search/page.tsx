"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/format";
import { Search } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function searchProducts() {
      setLoading(true);
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq("status", "Active")
        .limit(20);

      if (data) setProducts(data);
      setLoading(false);
    }

    searchProducts();
  }, [query, supabase]);

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-col gap-2">
           <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Search Results</p>
           <h1 className="text-3xl font-black tracking-tight text-zinc-950">
             {query ? `Showing results for "${query}"` : "Explore our catalog"}
           </h1>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Searching products...
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex flex-col border border-orange-100 bg-white p-4 transition hover:shadow-xl hover:shadow-orange-200/50"
              >
                <div className="relative aspect-square overflow-hidden bg-orange-50 mb-4">
                  <Image
                    src={product.image_url || "/images/prod_main.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {product.categories?.name}
                  </p>
                  <h3 className="font-bold text-zinc-950 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-auto text-lg font-black text-zinc-950">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-orange-200 bg-white py-20 text-center">
            <Search className="mx-auto h-12 w-12 text-zinc-200 mb-4" />
            <p className="text-sm font-semibold text-zinc-500">
              No products found for "{query}". Try a different keyword.
            </p>
            <Link href="/products" className="mt-4 inline-block text-sm font-black uppercase tracking-widest text-primary">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

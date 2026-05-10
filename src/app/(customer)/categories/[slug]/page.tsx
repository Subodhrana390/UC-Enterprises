"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/format";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = useMemo(() => createClient(), []);
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryPage() {
      const { data: categoryData } = await supabase.from("categories").select("*").eq("slug", slug).single();

      if (categoryData) {
        const { data: productData } = await supabase
          .from("products")
          .select("id, name, slug, price, image_url, stock_quantity")
          .eq("category_id", categoryData.id)
          .order("created_at", { ascending: false });

        setCategory(categoryData);
        setProducts(productData || []);
      }

      setLoading(false);
    }

    if (slug) {
      fetchCategoryPage();
    }
  }, [slug, supabase]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-sm font-semibold text-zinc-500">Loading category...</div>;
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-zinc-950">Category not found</h1>
        <Link href="/categories" className="mt-4 inline-block text-sm font-black uppercase tracking-widest text-primary">
          View all categories
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]">
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Link href="/">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/categories">Categories</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{category.name}</span>
        </div>

        <div className="mt-6 border border-orange-100 bg-zinc-950 p-8 text-white">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">Category</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{category.name}</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300">
            Explore live products under this category with updated pricing and storefront links.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="group overflow-hidden border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-square bg-orange-50">
                <Image
                  src={product.image_url || "/images/prod_main.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition duration-500 group-hover:scale-105"
                  unoptimized
                />
              </div>
                <div className="space-y-2 p-5">
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    {product.stock_quantity > 0 ? "In stock" : "Back soon"}
                  </p>
                  <h2 className="line-clamp-2 text-lg font-bold text-zinc-950 transition group-hover:text-primary">{product.name}</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-zinc-950">{formatCurrency(product.price)}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">View details</span>
                  </div>
                </div>
              </Link>
              <div className="px-5 pb-5">
                <Link href={`/get-quote?product=${product.slug}`} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary">
                  Get Best Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!products.length && (
          <div className="mt-10 border border-dashed border-orange-200 bg-white p-10 text-center text-sm font-semibold text-zinc-600">
            No products are currently published in this category.
          </div>
        )}
      </section>
    </div>
  );
}

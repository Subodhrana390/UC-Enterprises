"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, FolderTree, ShoppingBag, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/format";
import { storeDepartments } from "@/lib/storefront";

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStorefrontData() {
      const [{ data: productData }, { data: categoryData }] = await Promise.all([
        supabase.from("products").select("id, name, slug, price, image_url, status").order("created_at", { ascending: false }).limit(8),
        supabase.from("categories").select("id, name, slug").order("name", { ascending: true }).limit(6),
      ]);

      setProducts(productData || []);
      setCategories(categoryData || []);
      setLoading(false);
    }

    fetchStorefrontData();
  }, [supabase]);

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#fffdf8_100%)]">
      <section className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="relative overflow-hidden border border-orange-100 bg-zinc-950 p-8 text-white lg:col-span-2">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
          <p className="relative z-10 text-xs font-black uppercase tracking-[0.3em] text-orange-300">Trusted Indian B2B Supply</p>
          <h1 className="relative z-10 mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
            Hardware welding, electronic goods, lab chemicals, powders, and general supply in one storefront
          </h1>
          <p className="relative z-10 mt-4 max-w-xl text-sm leading-6 text-zinc-300">
            Browse real product data, category pages, customer account tools, and quote-focused business flows built for industrial buyers, labs, resellers, and general procurement teams.
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap gap-4">
            <Link href="/products" className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-300/40">
              Shop products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/bulk-inquiry" className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-widest text-white">
              Bulk inquiry
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <Link href="/deals" className="border border-orange-100 bg-white p-6 shadow-sm transition hover:shadow-lg">
            <BadgePercent className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl font-black text-zinc-950">Deals for volume buyers</h2>
            <p className="mt-2 text-sm text-zinc-600">Bulk pricing, GST invoicing, and support for repeat orders in welding, electronics, chemicals, and general supply.</p>
          </Link>
          <Link href="/track-order" className="border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:shadow-lg">
            <FolderTree className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl font-black text-zinc-950">Track orders quickly</h2>
            <p className="mt-2 text-sm text-zinc-600">Use your account order history or contact support for offline order dispatch updates.</p>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Main Segments</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-950">What we mainly deal in</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {storeDepartments.map((segment) => (
            <Link key={segment.id} href={`/categories?segment=${segment.id}`} className="border border-orange-100 bg-white p-6 shadow-sm transition hover:border-primary hover:shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">{segment.label}</p>
              <p className="mt-4 text-sm leading-6 text-zinc-600">{segment.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Categories</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-950">Browse your product categories</h2>
          </div>
          <Link href="/categories" className="text-sm font-black uppercase tracking-widest text-primary">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="border border-orange-100 bg-white p-5 text-center shadow-sm transition hover:border-primary hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-primary">
                <FolderTree className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-bold text-zinc-950">{category.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Live Products</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-950">Popular catalogue picks</h2>
          </div>
          <Link href="/products" className="text-sm font-black uppercase tracking-widest text-primary">
            Browse all
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[360px] animate-pulse border border-orange-100 bg-white" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span className="text-xs font-black">4.8</span>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600">{product.status || "Active"}</span>
                  </div>
                  <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-zinc-950 transition group-hover:text-primary">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-zinc-950">{formatCurrency(product.price)}</span>
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                      View
                      <ShoppingBag className="h-4 w-4" />
                    </span>
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
        )}
      </section>
    </div>
  );
}

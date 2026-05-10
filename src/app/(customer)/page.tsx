"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgePercent, ChevronLeft, ChevronRight, FolderTree, ShoppingBag, Star } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/format";
import { storeDepartments } from "@/lib/storefront";

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    async function fetchStorefrontData() {
      const [{ data: productData }, { data: categoryData }, { data: bannerData }] = await Promise.all([
        supabase.from("products").select("id, name, slug, price, image_url, status").order("created_at", { ascending: false }).limit(8),
        supabase.from("categories").select("id, name, slug").order("name", { ascending: true }).limit(6),
        supabase.from("banners").select("*").eq("is_active", true).order("position", { ascending: true }),
      ]);

      setProducts(productData || []);
      setCategories(categoryData || []);
      setBanners(bannerData || []);
      setLoading(false);
    }

    fetchStorefrontData();
  }, [supabase]);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const goToBanner = useCallback((index: number) => setCurrentBanner(index), []);
  const prevBanner = useCallback(() => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length), [banners.length]);
  const nextBanner = useCallback(() => setCurrentBanner((p) => (p + 1) % banners.length), [banners.length]);

  // Static fallback hero
  const staticHero = (
    <div className="relative overflow-hidden border border-orange-100 bg-zinc-950 p-8 text-white lg:col-span-2">
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
      <p className="relative z-10 text-xs font-black uppercase tracking-[0.3em] text-orange-300">Trusted Indian B2B Supply</p>
      <h1 className="relative z-10 mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-6xl">
        Laboratory chemicals, glassware, tools, safety equipment, and industrial goods in one storefront
      </h1>
      <p className="relative z-10 mt-4 max-w-xl text-sm leading-6 text-zinc-300">
        Browse real product data, category pages, customer account tools, and quote-focused business flows built for industrial buyers, labs, resellers, and general procurement teams.
      </p>
      <div className="relative z-10 mt-8 flex flex-wrap gap-4">
        <Link href="/products" className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-300/40">Shop products<ArrowRight className="h-4 w-4" /></Link>
        <Link href="/bulk-inquiry" className="inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-sm font-black uppercase tracking-widest text-white">Bulk inquiry</Link>
      </div>
    </div>
  );

  // Dynamic banner carousel
  const dynamicHero = banners.length > 0 ? (
    <div className="relative overflow-hidden border border-orange-100 lg:col-span-2 group">
      {/* Slides */}
      <div className="relative h-[320px] md:h-[400px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 transition-all duration-700 ease-in-out"
            style={{ opacity: index === currentBanner ? 1 : 0, transform: index === currentBanner ? "scale(1)" : "scale(1.05)", zIndex: index === currentBanner ? 10 : 1 }}
          >
            {/* Background */}
            {banner.image_url ? (
              <div className="absolute inset-0">
                <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-zinc-950">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute left-1/2 bottom-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              </div>
            )}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-300">UC Enterprises</p>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white md:text-5xl leading-tight">{banner.title}</h2>
              {banner.subtitle && <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-300">{banner.subtitle}</p>}
              {banner.link_url && (
                <div className="mt-6">
                  <Link href={banner.link_url} className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-300/40 hover:bg-primary/90 transition-colors">
                    {banner.link_text || "Explore"}<ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (<>
        <button onClick={prevBanner} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={nextBanner} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"><ChevronRight className="w-5 h-5" /></button>
      </>)}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, index) => (
            <button key={index} onClick={() => goToBanner(index)} className={`h-2 rounded-full transition-all duration-300 ${index === currentBanner ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"}`} />
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_35%,#fffdf8_100%)]">
      <section className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-3">
        {dynamicHero || staticHero}

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
          <Link href="/categories" className="text-sm font-black uppercase tracking-widest text-primary">View all</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="border border-orange-100 bg-white p-5 text-center shadow-sm transition hover:border-primary hover:shadow-lg">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-primary"><FolderTree className="h-6 w-6" /></div>
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
          <Link href="/products" className="text-sm font-black uppercase tracking-widest text-primary">Browse all</Link>
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
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">View<ShoppingBag className="h-4 w-4" /></span>
                  </div>
                </div>
                </Link>
                <div className="px-5 pb-5">
                  <Link href={`/get-quote?product=${product.slug}`} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary">Get Best Quote</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

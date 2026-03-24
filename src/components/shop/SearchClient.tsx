"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

export function SearchClient({
  initialProducts,
  totalCount,
  query,
  categories,
  maxPrice,
}: {
  initialProducts: Array<Record<string, unknown>>;
  totalCount: number;
  query: string;
  categories: Array<{ id: string; slug: string; name: string }>;
  maxPrice: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchText, setSearchText] = useState(query);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice") ?? 0),
    Number(searchParams.get("maxPrice") ?? maxPrice),
  ]);

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "relevance";
  const currentAvailability = searchParams.get("availability") ?? "";
  const currentRating = searchParams.get("minRating") ?? "0";

  // FIX 1: Explicitly handle string | null | undefined for applyFilters
  const applyFilters = useCallback((updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value && value.length > 0) params.set(key, value);
      else params.delete(key);
    }

    const next = params.toString();
    const current = searchParams.toString();
    if (next === current) return;

    startTransition(() => {
      router.replace(next.length > 0 ? `/search?${next}` : "/search", { scroll: false });
    });
  }, [router, searchParams]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      applyFilters({ q: searchText.trim() });
    }, 300);
    return () => window.clearTimeout(id);
  }, [applyFilters, searchText]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      applyFilters({
        minPrice: String(priceRange[0]),
        maxPrice: String(priceRange[1]),
      });
    }, 250);
    return () => window.clearTimeout(id);
  }, [applyFilters, priceRange]);

  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: "Relevance" },
      { value: "price-low", label: "Price: Low to High" },
      { value: "price-high", label: "Price: High to Low" },
      { value: "newest", label: "Newest" },
    ],
    [],
  );

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div className="pb-4 border-b border-[#ebebeb]">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1a1c1d]">Filters</h2>
          </div>

          <FilterSection title="Search">
            <Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by name..." />
          </FilterSection>

          <FilterSection title="Category">
            {/* FIX 2: Ensure the value is string | undefined, avoiding null */}
            <Select
              value={currentCategory || "all"}
              onValueChange={(v) => applyFilters({ category: v === "all" ? undefined : v })}
            >
              <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterSection>

          <FilterSection title="Availability">
            <Select
              value={currentAvailability || "all"}
              onValueChange={(v) => applyFilters({ availability: v === "all" ? undefined : v })}
            >
              <SelectTrigger><SelectValue placeholder="Any availability" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </FilterSection>

          <FilterSection title="Price Range">
            <div className="space-y-3">
              <FilterSection title="Price Range">
                <div className="space-y-3">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={Math.ceil(maxPrice)}
                    step={50}
                    onValueChange={(v) => {
                      if (Array.isArray(v)) {
                        setPriceRange([v[0], v[1]]);
                      }
                    }}
                  />
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>Rs {priceRange[0]}</span>
                    <span>Rs {priceRange[1]}</span>
                  </div>
                </div>
              </FilterSection>
              <div className="text-xs text-gray-600 flex justify-between">
                <span>Rs {priceRange[0]}</span>
                <span>Rs {priceRange[1]}</span>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Minimum Rating">
            <Select
              value={currentRating}
              onValueChange={(v) => applyFilters({ minRating: v === "0" ? undefined : v })}
            >
              <SelectTrigger><SelectValue placeholder="Any rating" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any rating</SelectItem>
                <SelectItem value="3">3 stars and up</SelectItem>
                <SelectItem value="4">4 stars and up</SelectItem>
                <SelectItem value="4.5">4.5 stars and up</SelectItem>
              </SelectContent>
            </Select>
          </FilterSection>
        </aside>

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-[#ebebeb] gap-4">
            <p className="text-sm text-[#616161]">{totalCount} products found</p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#1a1c1d]">Sort by:</span>
              <Select value={currentSort} onValueChange={(v) => applyFilters({ sort: v || undefined })}>
                <SelectTrigger className="w-48 h-10 border-[#ebebeb] rounded-sm text-sm focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isPending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
              {initialProducts.map((item) => {
                const productImages = Array.isArray(item.images) ? (item.images as string[]) : [];
                return (
                  <ProductCard
                    key={String(item.id)}
                    id={String(item.id)}
                    name={String(item.name ?? "")}
                    description={typeof item.description === "string" ? item.description : undefined}
                    brand={{
                      name: (item as { brands?: { name: string } }).brands?.name || "Generic",
                    }}
                    price={Number(item.base_price ?? 0)}
                    image={productImages[0] || undefined}
                    images={productImages}
                    stock_quantity={Number(item.stock_quantity ?? 0)}
                    rating={Number(item.avg_rating ?? item.rating ?? 0)}
                    reviewCount={Number(item.review_count ?? 0)}
                    sku={typeof item.sku === "string" ? item.sku : undefined}
                    compareAtPrice={
                      Number(item.mrp_price) > Number(item.base_price)
                        ? Number(item.mrp_price)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium border-b border-[#f5f5f5] pb-2">{title}</h3>
      {children}
    </div>
  );
}
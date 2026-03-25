"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { SearchFilters } from "./SearchFilters";

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

  // Build active filter chips
  const activeFilters = useMemo(() => {
    const filters: Array<{ key: string; label: string; value: string }> = [];
    
    if (searchText && searchText !== query) {
      filters.push({ key: "q", label: "Search", value: searchText });
    }
    
    if (currentCategory) {
      const cat = categories.find(c => c.slug === currentCategory);
      if (cat) {
        filters.push({ key: "category", label: "Category", value: cat.name });
      }
    }
    
    if (currentAvailability) {
      filters.push({ 
        key: "availability", 
        label: "Availability", 
        value: currentAvailability === "in" ? "In Stock" : "Out of Stock" 
      });
    }
    
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      filters.push({ 
        key: "price", 
        label: "Price", 
        value: `₹${priceRange[0]} - ₹${priceRange[1]}` 
      });
    }
    
    if (currentRating !== "0") {
      filters.push({ 
        key: "minRating", 
        label: "Rating", 
        value: `${currentRating}★ and up` 
      });
    }
    
    return filters;
  }, [searchText, query, currentCategory, categories, currentAvailability, priceRange, maxPrice, currentRating]);

  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case "q":
        setSearchText("");
        applyFilters({ q: undefined });
        break;
      case "category":
        applyFilters({ category: undefined });
        break;
      case "availability":
        applyFilters({ availability: undefined });
        break;
      case "price":
        setPriceRange([0, maxPrice]);
        applyFilters({ minPrice: undefined, maxPrice: undefined });
        break;
      case "minRating":
        applyFilters({ minRating: undefined });
        break;
    }
  };

  const handleClearAll = () => {
    setSearchText("");
    setPriceRange([0, maxPrice]);
    applyFilters({ 
      q: undefined, 
      category: undefined, 
      availability: undefined, 
      minPrice: undefined, 
      maxPrice: undefined, 
      minRating: undefined 
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <SearchFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={(v) => applyFilters({ category: v })}
        currentAvailability={currentAvailability}
        onAvailabilityChange={(v) => applyFilters({ availability: v })}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        maxPrice={maxPrice}
        currentRating={currentRating}
        onRatingChange={(v) => applyFilters({ minRating: v })}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAll}
      />

      <div className="flex-1 min-w-0">
        {/* Active Filter Chips - Desktop only, at top of content */}
        {activeFilters.length > 0 && (
          <div className="hidden lg:flex flex-wrap gap-2 mb-6 pb-4 border-b">
            {activeFilters.map((filter) => (
              <Badge 
                key={filter.key} 
                variant="secondary" 
                className="pl-3 pr-2 py-1.5 text-sm gap-1.5 hover:bg-secondary/80"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{filter.value}</span>
                <button
                  onClick={() => handleRemoveFilter(filter.key)}
                  className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearAll}
              className="h-7 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b">
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'product' : 'products'} found
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
            <Select value={currentSort} onValueChange={(v) => applyFilters({ sort: v || undefined })}>
              <SelectTrigger className="w-full sm:w-[180px] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : initialProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
  
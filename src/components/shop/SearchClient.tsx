"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  initialProducts: any[];
  totalCount: number;
  query: string;
  categories: any[];
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
  const paramsString = searchParams.toString();

  const applyFilters = useCallback(
    (updates: any) => {
      const params = new URLSearchParams(paramsString);

      Object.entries(updates).forEach(([key, value]: [string, any]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      const next = params.toString();

      if (next === paramsString) return;

      startTransition(() =>
        router.replace(next ? `/search?${next}` : "/search", {
          scroll: false,
        })
      );
    },
    [router, paramsString]
  );

  useEffect(() => {
    const id = setTimeout(
      () => applyFilters({ q: searchText.trim() }),
      1000
    );
    return () => clearTimeout(id);
  }, [searchText, applyFilters]);

  /**
   * Debounced price slider
   */
  useEffect(() => {
    const id = setTimeout(
      () =>
        applyFilters({
          minPrice: String(priceRange[0]),
          maxPrice: String(priceRange[1]),
        }),
      250
    );

    return () => clearTimeout(id);
  }, [priceRange, applyFilters]);

  /**
   * Faster category lookup map
   */
  const categoryMap = useMemo(
    () =>
      Object.fromEntries(
        categories.map((c) => [c.slug, c.name])
      ),
    [categories]
  );

  /**
   * Active filter chips
   */
  const activeFilters = useMemo(() => {
    const filters = [];

    if (searchText && searchText !== query)
      filters.push({
        key: "q",
        label: "Search",
        value: searchText,
      });

    const currentCategory =
      searchParams.get("category") ?? "";

    if (currentCategory)
      filters.push({
        key: "category",
        label: "Category",
        value: categoryMap[currentCategory],
      });

    const availability =
      searchParams.get("availability") ?? "";

    if (availability)
      filters.push({
        key: "availability",
        label: "Availability",
        value:
          availability === "in"
            ? "In Stock"
            : "Out of Stock",
      });

    const minRating =
      searchParams.get("minRating") ?? "0";

    if (minRating !== "0")
      filters.push({
        key: "minRating",
        label: "Rating",
        value: `${minRating}★ and up`,
      });

    if (
      priceRange[0] > 0 ||
      priceRange[1] < maxPrice
    )
      filters.push({
        key: "price",
        label: "Price",
        value: `₹${priceRange[0]} - ₹${priceRange[1]}`,
      });

    return filters;
  }, [
    searchParams,
    searchText,
    query,
    priceRange,
    maxPrice,
    categoryMap,
  ]);

  /**
   * Clear filters
   */
  const handleClearAll = useCallback(() => {
    setSearchText("");
    setPriceRange([0, maxPrice]);

    applyFilters({
      q: undefined,
      category: undefined,
      availability: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
    });
  }, [applyFilters, maxPrice]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

      <SearchFilters
        searchText={searchText}
        onSearchChange={setSearchText}

        categories={categories}

        currentCategory={searchParams.get("category") ?? undefined}
        onCategoryChange={(value) =>
          applyFilters({ category: value })
        }

        currentAvailability={searchParams.get("availability") ?? undefined}
        onAvailabilityChange={(value) =>
          applyFilters({ availability: value })
        }

        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        maxPrice={maxPrice}

        currentRating={searchParams.get("minRating") ?? undefined}
        onRatingChange={(value) =>
          applyFilters({ minRating: value })
        }

        activeFilters={activeFilters}

        onRemoveFilter={(key) =>
          applyFilters({ [key]: undefined })
        }

        onClearAll={handleClearAll}
      />

      <div className="flex-1 min-w-0">

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <p className="text-sm text-muted-foreground">
            {totalCount} results
          </p>

          <Select
            value={
              searchParams.get("sort") ??
              "relevance"
            }
            onValueChange={(v) =>
              applyFilters({ sort: v })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="relevance">
                Relevance
              </SelectItem>
              <SelectItem value="price-low">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high">
                Price: High to Low
              </SelectItem>
              <SelectItem value="newest">
                Newest
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products */}
        {isPending ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map(
              (_, i) => (
                <ProductCardSkeleton key={i} />
              )
            )}
          </div>
        ) : initialProducts.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {initialProducts.map((item) => {
              const images =
                Array.isArray(item.images)
                  ? item.images
                  : [];

              return (
                <ProductCard
                  key={String(item.id)}
                  id={String(item.id)}
                  name={String(item.name)}
                  price={Number(item.base_price ?? 0)}
                  image={images[0]}
                  images={images}
                  stock_quantity={Number(
                    item.stock_quantity ?? 0
                  )}
                  rating={Number(
                    item.avg_rating ??
                    item.rating ??
                    0
                  )}
                  reviewCount={
                    Array.isArray(item.reviews)
                      ? item.reviews.length
                      : 0
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
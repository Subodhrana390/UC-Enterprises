"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";

export type ProductCarouselItem = {
  id: string;
  name: string;
  description?: string | null;
  brands?: { name: string };
  base_price: number;
  mrp_price?: number;
  images?: string[];
  sku?: string;
  stock_quantity?: number;
  rating?: number;
  review_count?: number;
};

export function ProductCarousel({
  title,
  subtitle,
  products,
  autoplay = false,
  loading = false,
}: {
  title: string;
  subtitle?: string;
  products: ProductCarouselItem[];
  autoplay?: boolean;
  loading?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pageCount = useMemo(() => Math.max(1, products.length), [products.length]);

  useEffect(() => {
    if (!autoplay || paused || products.length <= 1) return;
    const id = window.setInterval(() => {
      if (!trackRef.current) return;
      const nextIndex = (index + 1) % pageCount;
      const child = trackRef.current.children.item(nextIndex) as HTMLElement | null;
      child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      setIndex(nextIndex);
    }, 3500);
    return () => window.clearInterval(id);
  }, [autoplay, index, pageCount, paused, products.length]);

  function scrollTo(nextIndex: number) {
    if (!trackRef.current) return;
    const bounded = ((nextIndex % pageCount) + pageCount) % pageCount;
    const child = trackRef.current.children.item(bounded) as HTMLElement | null;
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setIndex(bounded);
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[360px] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-5" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-500 mt-1">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => scrollTo(index - 1)} aria-label="Previous products">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" onClick={() => scrollTo(index + 1)} aria-label="Next products">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory" ref={trackRef}>
        <div className="flex gap-4 md:gap-6">
          {products.map((p) => (
            <div key={p.id} className="min-w-[82%] sm:min-w-[48%] lg:min-w-[24%] snap-start">
              <ProductCard
                id={p.id}
                name={p.name}
                description={p.description}
                brand={p.brands}
                price={p.base_price}
                compareAtPrice={p.mrp_price}
                images={p.images}
                sku={p.sku}
                stock_quantity={p.stock_quantity}
                rating={p.rating}
                reviewCount={p.review_count}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {products.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-blue-600" : "w-2.5 bg-gray-300"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

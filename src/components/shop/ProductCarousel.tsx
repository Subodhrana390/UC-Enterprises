"use client";

import { useEffect, useRef, useState } from "react";
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
  reviewCount?: number;
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const getVisibleItems = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };

  const [visibleItems, setVisibleItems] = useState(getVisibleItems());
  const totalSlides = Math.ceil(products.length / visibleItems);

  useEffect(() => {
    const handleResize = () => setVisibleItems(getVisibleItems());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!autoplay || isPaused || products.length <= visibleItems) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoplay, isPaused, products.length, visibleItems, totalSlides]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.scrollWidth / totalSlides;
    container.scrollTo({
      left: scrollAmount * currentSlide,
      behavior: 'smooth'
    });
  }, [currentSlide, totalSlides]);

  const scrollTo = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    } else {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

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

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="space-y-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {products.length > visibleItems && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => scrollTo('prev')}
              aria-label="Previous products"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => scrollTo('next')}
              aria-label="Next products"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </Button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="overflow-x-hidden scrollbar-hide"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
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
              reviewCount={p.reviewCount}
            />
          ))}
        </div>
      </div>

      {products.length > visibleItems && totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-blue-600" : "w-2 bg-gray-300"
                }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

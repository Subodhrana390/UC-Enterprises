"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlistButton } from "./AddToWishlistButton";
import { formatPriceINR } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  brand?: { name: string };
  price: number;
  compareAtPrice?: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount: number;
  sku?: string;
  stock_quantity?: number;
}

export function ProductCard({
  id,
  name,
  description,
  brand,
  price,
  compareAtPrice,
  image,
  images = [],
  rating = 0,
  reviewCount = 0,
  sku,
  stock_quantity = 0,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const allImages = images.length > 0 ? images : [image || "/placeholder-product.png"];
  const hasMultipleImages = allImages.length > 1;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 1200);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, allImages.length]);

  const inStock = stock_quantity > 0;
  const discount = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div
      className="group flex flex-col h-full bg-white transition-all duration-300 md:hover:shadow-xl md:p-3 p-2 rounded-xl border border-gray-100 hover:border-blue-100 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${id}`} className="flex flex-col flex-1 cursor-pointer">
        <div className="aspect-square rounded-lg mb-2 md:mb-3 relative overflow-hidden border border-gray-50 shrink-0 flex items-center justify-center">
          <div className="relative w-[85%] h-[85%]">
            <Image
              src={allImages[currentImageIndex]}
              alt={`${name} - view ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain transition-opacity duration-500"
              priority={currentImageIndex === 0}
            />
          </div>

          {/* Carousel Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-4 bg-blue-600" : "w-1 bg-gray-300"
                    }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <div className="bg-rose-600 text-white text-[9px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded shadow-lg">
                {discount}% OFF
              </div>
            )}
          </div>

          <div className="absolute top-1.5 right-1.5 z-10" onClick={(e) => e.preventDefault()}>
            <AddToWishlistButton
              productId={id}
              productName={name}
              productPrice={price}
              productImage={allImages[0]}
              stockQuantity={stock_quantity}
              brandName={brand?.name}
              description={description ?? undefined}
              variant="outline"
              className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white/90 backdrop-blur shadow-sm border-0 p-0"
            />
          </div>

          {/* Stock Status */}
          <div className="absolute bottom-1.5 left-1.5 z-10">
            <div className={`backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-bold uppercase flex items-center shadow-sm border ${inStock ? "bg-white/90 text-green-700 border-green-100" : "bg-gray-100/90 text-gray-500 border-gray-200"
              }`}>
              {inStock && <span className="w-1 h-1 rounded-full bg-green-500 mr-1 animate-pulse"></span>}
              {inStock ? "In Stock" : "Sold Out"}
            </div>
          </div>

          {/* Desktop Hover Add to Cart */}
          <div className="absolute inset-x-2 bottom-2 hidden md:block translate-y-12 group-hover:translate-y-0 transition-transform duration-300 z-20" onClick={(e) => e.preventDefault()}>
            <AddToCartButton
              productId={id}
              productName={name}
              productPrice={price}
              productImage={allImages[0]}
              stockQuantity={stock_quantity}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold text-xs shadow-xl flex items-center justify-center gap-2 h-9"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-600 text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest truncate">{brand?.name || "Generic"}</span>
          </div>

          <h3 className="font-semibold text-xs md:text-sm text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1 break-words">
            {name}
          </h3>

          <div className="flex items-center gap-1.5 mb-2 h-5 select-none">
            {/* Rating Section */}


            <div className="flex items-center text-sm">
              {[1, 2, 3, 4, 5].map((star) => {
                let iconName = "star";
                let fillValue = 0;
                let colorClass = "text-yellow-200";

                if (rating >= star) {
                  fillValue = 1;
                  colorClass = "text-yellow-500";
                } else if (rating >= star - 0.5) {
                  iconName = "star_half";
                  fillValue = 1;
                  colorClass = "text-yellow-500";
                }

                return (
                  <span
                    key={star}
                    className={`material-symbols-outlined text-base ${colorClass} text-[10px]`}
                    style={{ fontVariationSettings: `'FILL' ${fillValue}` }}
                  >
                    {iconName}
                  </span>
                );
              })}
            </div>


            {/* Separator Dot (Optional but adds a nice touch) */}
            <span className="text-gray-300 text-[10px]">•</span>

            {/* Review Count */}
            <span className="text-[10px] md:text-[11px] text-gray-500 font-medium tabular-nums hover:text-blue-600 cursor-pointer transition-colors">
              {reviewCount.toLocaleString()} reviews
            </span>
          </div>

          {/* Price pushed to bottom */}
          <div className="mt-auto">
            <div className="flex items-baseline flex-wrap gap-1 md:gap-2">
              <span className="text-sm md:text-lg font-black text-slate-900">{formatPriceINR(price)}</span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-[10px] md:text-xs text-gray-400 line-through">{formatPriceINR(compareAtPrice)}</span>
              )}
            </div>
            <p className="text-[8px] md:text-[10px] text-gray-500 font-medium leading-none">Inc. GST</p>
          </div>
        </div>
      </Link>

      <div className="mt-3 md:hidden">
        <AddToCartButton
          productId={id}
          productName={name}
          productPrice={price}
          productImage={allImages[0]}
          stockQuantity={stock_quantity}
          className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center justify-center h-9"
        />
      </div>
    </div>
  );
}
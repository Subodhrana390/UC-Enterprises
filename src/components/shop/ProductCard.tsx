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
      className="group flex flex-col h-full bg-white p-4 rounded-3xl border border-slate-100 transition-all duration-500 hover:shadow-[30px_30px_60px_-15px_rgba(203,213,225,0.6)] hover:border-slate-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${id}`} className="flex flex-col flex-1 cursor-pointer">
        {/* Image Container - Using slate-50 to make white product images pop */}
        <div className="aspect-square rounded-2xl mb-4 relative overflow-hidden shrink-0 flex items-center justify-center bg-slate-50 border border-slate-100/50">
          <div className="relative w-[80%] h-[80%]">
            <Image
              src={allImages[currentImageIndex]}
              alt={`${name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-contain transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
              priority={currentImageIndex === 0}
            />
          </div>

          {/* Minimalist Carousel Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1 z-10">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${i === currentImageIndex ? "w-6 bg-slate-900" : "w-1 bg-slate-200"}`}
                />
              ))}
            </div>
          )}

          {/* Technical Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-white border border-rose-100 text-rose-600 text-[9px] font-black px-2 py-1 rounded-full shadow-sm uppercase tracking-tighter">
                -{discount}% OFF
              </div>
            </div>
          )}

          {/* Wishlist Button - Clean Outline */}
          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
            <AddToWishlistButton
              productId={id}
              productName={name}
              productPrice={price}
              productImage={allImages[0]}
              stockQuantity={stock_quantity}
              brandName={brand?.name}
              description={description ?? undefined}
              variant="outline"
              className="h-9 w-9 rounded-full bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 shadow-sm transition-all"
            />
          </div>

          {/* Desktop Hover Add to Cart - Solid Black */}
          <div className="absolute inset-x-4 bottom-4 hidden md:block translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-20" onClick={(e) => e.preventDefault()}>
            <AddToCartButton
              productId={id}
              productName={name}
              productPrice={price}
              productImage={allImages[0]}
              stockQuantity={stock_quantity}
              className="w-full bg-slate-900 hover:bg-cyan-600 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 flex items-center justify-center gap-2 h-11 transition-all"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 px-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-600 text-[9px] font-black uppercase tracking-[0.3em] truncate">
              {brand?.name || "Industrial Standard"}
            </span>
            <div className={`flex items-center text-[9px] font-black uppercase tracking-tighter ${inStock ? "text-emerald-600" : "text-slate-400"}`}>
              {inStock && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
              {inStock ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          <h3 className="font-black text-sm text-slate-800 group-hover:text-cyan-700 transition-colors leading-tight mb-2 line-clamp-2 uppercase italic tracking-tight">
            {name}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="material-symbols-outlined text-[12px]"
                  style={{
                    fontVariationSettings: `'FILL' ${rating >= star ? 1 : 0}`,
                    color: rating >= star ? '#0891b2' : '#e2e8f0'
                  }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              ({reviewCount})
            </span>
          </div>

          {/* Pricing - Bold & Technical */}
          <div className="mt-auto pt-4 border-t border-slate-50">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tighter italic">
                {formatPriceINR(price)}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-[10px] text-slate-300 line-through font-bold">
                  {formatPriceINR(compareAtPrice)}
                </span>
              )}
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">Inclusive of GST</p>
          </div>
        </div>
      </Link>

      {/* Mobile Add to Cart - Solid Industrial Look */}
      <div className="mt-5 md:hidden">
        <AddToCartButton
          productId={id}
          productName={name}
          productPrice={price}
          productImage={allImages[0]}
          stockQuantity={stock_quantity}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-200 h-11 transition-all"
        />
      </div>
    </div>
  );
}
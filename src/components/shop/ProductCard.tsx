"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  brand?: { name: string };
  price: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  sku?: string;
  stock_quantity?: number;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  images,
  rating = 0,
  reviewCount = 0,
  sku,
  stock_quantity = 0,
}: ProductCardProps) {
  const displayImage = images?.[0] || image || "/placeholder-product.png";
  const inStock = stock_quantity > 0;
  return (
    <div className="group">
      <div className="bg-surface-container-low aspect-square rounded-xl mb-4 relative overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors h-8 w-8"
        >
          <span className="material-symbols-outlined text-sm">favorite</span>
        </Button>
        {inStock && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-tighter uppercase text-on-surface flex items-center shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            In Stock
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
          <Button className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-xl flex items-center justify-center gap-2 h-11">
            <span className="material-symbols-outlined text-sm">shopping_cart</span>
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">{brand?.name}</span>
        {sku && <span className="text-[9px] text-on-surface-variant font-mono bg-surface-container-low px-1 rounded">{sku}</span>}
      </div>
      <h3 className="font-bold text-on-surface group-hover:text-blue-600 transition-colors truncate">
        {name}
      </h3>
      <div className="flex items-center gap-1 my-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="material-symbols-outlined text-sm"
              style={{
                fontVariationSettings: i < Math.floor(rating) ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              star
            </span>
          ))}
        </div>
        <span className="text-xs text-on-surface-variant">({reviewCount})</span>
      </div>
      <p className="text-xl font-black text-on-surface">
        ${price.toFixed(2)} <span className="text-sm font-normal text-on-surface-variant">/ unit</span>
      </p>
    </div>
  );
}

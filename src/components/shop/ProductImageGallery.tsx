"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const displayImages = images.length > 0 ? images : ["/placeholder-product.png"];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${productName} - view ${selectedIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {displayImages.slice(0, 8).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-md overflow-hidden bg-gray-50 cursor-pointer transition-all ${
                selectedIndex === index
                  ? "ring-2 ring-blue-600 ring-offset-2"
                  : "border border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === 7 && displayImages.length > 8 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                  +{displayImages.length - 7}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

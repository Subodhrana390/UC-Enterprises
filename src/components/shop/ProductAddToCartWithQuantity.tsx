"use client";

import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";

export function ProductAddToCartWithQuantity({ productId, maxStock = 999 }: { productId: string; maxStock?: number }) {
  const [quantity, setQuantity] = useState(1);
  const clamped = Math.min(Math.max(1, quantity), maxStock);

  return (
    <div className="flex gap-3 h-auto w-full">
      {/* Quantity Selector */}
      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden shrink-0">
        <button
          type="button"
          disabled={clamped <= 1}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        
        <span className="w-10 text-center font-semibold text-sm text-gray-900">
          {clamped}
        </span>
        
        <button
          type="button"
          disabled={clamped >= maxStock}
          onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
          className="px-3 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>

      {/* Add To Cart Button */}
      <AddToCartButton
        productId={productId}
        quantity={clamped}
        className="flex-1 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 px-6"
      />
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "./AddToCartButton";

export function ProductAddToCartWithQuantity({ productId, maxStock = 999 }: { productId: string; maxStock?: number }) {
  const [quantity, setQuantity] = useState(1);
  const clamped = Math.min(Math.max(1, quantity), maxStock);

  return (
    <div className="flex gap-4 h-16">
      <div className="flex items-center bg-white rounded-xl px-2 border border-border/60 shadow-sm">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-3 hover:text-primary transition-colors font-black text-lg"
        >
          —
        </button>
        <span className="w-12 text-center font-black text-lg">{clamped}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
          className="p-3 hover:text-primary transition-colors font-black text-lg"
        >
          +
        </button>
      </div>
      <AddToCartButton
        productId={productId}
        quantity={clamped}
        className="flex-1 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-3"
      />
    </div>
  );
}

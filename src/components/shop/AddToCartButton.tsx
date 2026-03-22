"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addToCartFromForm } from "@/lib/actions/cart";

export function AddToCartButton({ productId, quantity = 1, className, children }: { productId: string; quantity?: number; className?: string; children?: React.ReactNode }) {
  const [pending, startTransition] = useTransition();

  return (
    <form action={(fd) => startTransition(() => { addToCartFromForm(fd); })}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={String(quantity)} />
      <Button type="submit" disabled={pending} className={className}>
        {children ?? (
          <>
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Engineering Cart
          </>
        )}
      </Button>
    </form>
  );
}

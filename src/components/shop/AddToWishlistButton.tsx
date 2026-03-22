"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { addToWishlist } from "@/lib/actions/wishlist";

async function addToWishlistFormAction(formData: FormData) {
  const productId = formData.get("productId") as string;
  await addToWishlist(productId);
}

export function AddToWishlistButton({ productId, className, variant = "outline" }: { productId: string; className?: string; variant?: "default" | "outline" }) {
  const [pending, startTransition] = useTransition();

  return (
    <form action={(fd) => startTransition(() => addToWishlistFormAction(fd))}>
      <input type="hidden" name="productId" value={productId} />
      <Button type="submit" disabled={pending} variant={variant} className={className}>
        <span className="material-symbols-outlined">favorite</span>
      </Button>
    </form>
  );
}

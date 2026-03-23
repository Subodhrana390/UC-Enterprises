"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { removeFromWishlistForm, addWishlistItemToCartForm } from "@/lib/actions/wishlist";

export function WishlistRemoveButton({ wishlistItemId }: { wishlistItemId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <form action={(fd) => startTransition(() => { removeFromWishlistForm(fd); })}>
      <input type="hidden" name="wishlistItemId" value={wishlistItemId} />
      <button
        type="submit"
        disabled={pending}
        className="text-red-500/40 hover:text-red-600 transition-all scale-100 hover:scale-110 active:scale-95 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
      </button>
    </form>
  );
}

export function WishlistAddToCartButton({ wishlistItemId }: { wishlistItemId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <form action={(fd) => startTransition(() => { addWishlistItemToCartForm(fd); })}>
      <input type="hidden" name="wishlistItemId" value={wishlistItemId} />
      <Button type="submit" disabled={pending} className="bg-primary text-white h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/10">
        <span className="material-symbols-outlined text-lg">shopping_cart</span>
        Add to Cart
      </Button>
    </form>
  );
}

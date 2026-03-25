"use client";

import { useTransition } from "react";
import { addToWishlist } from "@/lib/actions/wishlist";
import { removeFromCart } from "@/lib/actions/cart";

export function CartItemActions({ cartItemId }: { cartItemId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-6 mt-6">
      <form action={(fd) => startTransition(() => { addToWishlist(fd.get("cartItemId") as string); })}>
        <input type="hidden" name="cartItemId" value={cartItemId} />
        <button
          type="submit"
          disabled={pending}
          className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">bookmark</span> Save for Later
        </button>
      </form>
      <form action={(fd) => startTransition(() => { removeFromCart(fd.get("cartItemId") as string); })}>
        <input type="hidden" name="cartItemId" value={cartItemId} />
        <button
          type="submit"
          disabled={pending}
          className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">delete</span> Remove
        </button>
      </form>
    </div>
  );
}

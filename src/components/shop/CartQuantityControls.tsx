"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateCartQuantity } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CartQuantityControls({
  cartItemId,
  quantity,
  maxStock,
}: {
  cartItemId: string;
  quantity: number;
  /** Warehouse cap; omit for no cap (9999). If 0, only decrease/remove is allowed. */
  maxStock?: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const cap =
    maxStock === undefined || maxStock === null
      ? 9999
      : maxStock <= 0
        ? quantity
        : maxStock;

  function apply(next: number) {
    const clamped = Math.max(1, Math.min(cap, next));
    startTransition(async () => {
      const result = await updateCartQuantity(cartItemId, clamped);
      if (result && "error" in result && result.error) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-border/40">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={pending || quantity <= 1}
        className="h-9 w-9 shrink-0 rounded-lg font-black"
        onClick={() => apply(quantity - 1)}
        aria-label="Decrease quantity"
      >
        −
      </Button>
      <span className="min-w-[2.5rem] text-center font-black text-sm tabular-nums">{quantity}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={pending || quantity >= cap}
        className="h-9 w-9 shrink-0 rounded-lg font-black"
        onClick={() => apply(quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
}

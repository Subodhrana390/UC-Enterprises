"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteProductForm } from "@/lib/actions/admin";

export function ProductDeleteButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form action={(fd) => startTransition(() => { deleteProductForm(fd); })}>
      <input type="hidden" name="productId" value={productId} />
      <Button type="submit" variant="ghost" size="icon" disabled={pending} className="rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all ml-2">
        <span className="material-symbols-outlined text-lg">delete</span>
      </Button>
    </form>
  );
}

"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { adjustStockForm } from "@/lib/actions/admin";

export function InventoryAdjustButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="ghost" className="rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-10 px-6">
        Adjust Reserve
      </Button>
    );
  }

  return (
    <form action={(fd) => startTransition(() => adjustStockForm(fd))} className="flex gap-2 items-center" onSubmit={() => setTimeout(() => setOpen(false), 100)}>
      <input type="hidden" name="productId" value={productId} />
      <input name="delta" type="number" placeholder="+/- qty" className="w-20 h-9 rounded-lg border px-2 text-xs font-bold" defaultValue={0} required />
      <Button type="submit" disabled={pending} size="sm" className="h-9 text-[9px]">Apply</Button>
      <Button type="button" variant="ghost" size="sm" className="h-9 text-[9px]" onClick={() => setOpen(false)}>Cancel</Button>
    </form>
  );
}

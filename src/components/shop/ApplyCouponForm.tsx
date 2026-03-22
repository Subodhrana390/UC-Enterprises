"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applyCoupon } from "@/lib/actions/cart";

export function ApplyCouponForm() {
  const [state, formAction] = useActionState(
    async (_: { error?: string; success?: boolean } | null, fd: FormData) => {
      const result = await applyCoupon(fd);
      if (result?.error) return { error: result.error };
      return { success: true };
    },
    null
  );

  return (
    <div>
      <form action={formAction} className="flex gap-2">
        <Input name="code" className="flex-grow bg-white/10 border-none rounded-xl h-12 text-sm px-4 focus:ring-2 focus:ring-white transition-all font-bold placeholder:text-white/20" placeholder="ENTER CODE" />
        <Button type="submit" className="h-12 px-6 bg-white text-primary font-black text-[10px] rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest">
          Apply
        </Button>
      </form>
      {state?.success && <span className="text-xs text-emerald-300 block mt-2">Coupon applied!</span>}
      {state?.error && <span className="text-xs text-rose-300 block mt-2">{state.error}</span>}
    </div>
  );
}

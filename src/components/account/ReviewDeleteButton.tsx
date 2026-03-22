"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteReviewForm } from "@/lib/actions/reviews";

export function ReviewDeleteButton({ reviewId }: { reviewId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form action={(fd) => startTransition(() => deleteReviewForm(fd))}>
      <input type="hidden" name="reviewId" value={reviewId} />
      <Button type="submit" variant="ghost" disabled={pending} className="h-10 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl px-6">
        Discard
      </Button>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateReview } from "@/lib/actions/reviews";

export function EditReviewForm({
  reviewId,
  defaultRating,
  defaultContent,
  defaultHeadline,
}: {
  reviewId: string;
  defaultRating: number;
  defaultContent: string;
  defaultHeadline?: string;
}) {
  const [rating, setRating] = useState(defaultRating);
  const [state, formAction] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      fd.set("rating", String(rating));
      const result = await updateReview(reviewId, fd);
      return result?.error ? { error: result.error } : { success: true };
    },
    null
  );

  return (
    <form action={formAction} className="space-y-10">
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 px-1">Procurement Satisfaction</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className="transition-transform active:scale-90">
              <span className={`material-symbols-outlined text-3xl ${star <= rating ? "text-primary" : "text-border"}`} style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "" }}>
                star
              </span>
            </button>
          ))}
        </div>
        <p className="text-sm font-black">{rating} / 5</p>
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 px-1">Feedback Headline</label>
        <Input name="headline" defaultValue={defaultHeadline} className="h-14 bg-surface border-border/40 rounded-xl px-6 focus:ring-2 focus:ring-primary font-black text-on-surface uppercase tracking-tight" />
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 px-1">Technical Deep-Dive</label>
        <Textarea name="content" defaultValue={defaultContent} className="min-h-[240px] bg-surface border-border/40 rounded-xl px-6 py-6 focus:ring-2 focus:ring-primary font-medium text-sm leading-relaxed text-on-surface" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">Review updated.</p>}
      <div className="pt-10 border-t border-border/20 flex flex-col sm:flex-row items-center justify-end gap-6">
        <Button type="submit" className="w-full sm:w-auto h-14 bg-primary text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl px-12 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          Publish Manifest Update
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { createReview } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";

export function ProductReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", rating.toString());
    formData.append("content", content);

    const result = await createReview(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setContent("");
      setRating(5);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-md mt-6 border border-green-200 text-sm font-medium">
        Thank you! Your review has been submitted successfully.
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h3 className="text-lg font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded text-sm mb-4">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Rating</label>
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined cursor-pointer hover:scale-110 transition-transform"
                style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                onClick={() => setRating(star)}
              >
                star
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Review</label>
          <textarea
            required
            className="w-full border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
            placeholder="Share your experience with this product..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full md:w-auto uppercase tracking-widest text-xs font-bold">
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}

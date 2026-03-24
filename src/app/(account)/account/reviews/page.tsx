import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ChevronLeft, Star, Pencil, Trash2 } from "lucide-react";
import { ReviewDeleteButton } from "@/components/account/ReviewDeleteButton";

export default async function ReviewsHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      product_id,
      products (
        id,
        name,
        images
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#f6f6f7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Navigation & Header */}
        <header className="mb-10">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-[#616161] hover:text-[#1a1c1d] mb-4 font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-[#1a1c1d] tracking-tight">Product Reviews</h1>
          <p className="text-[#616161] text-base mt-2">
            Your honest feedback helps us and other shoppers.
          </p>
        </header>

        <div className="space-y-6">
          {reviews && reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white border border-[#ebebed] rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* Product Image Section */}
                    <div className="relative w-24 h-24 bg-[#f9f9f9] rounded-xl border border-[#f1f1f1] shrink-0 overflow-hidden flex items-center justify-center">
                      <Image
                        src={review.products?.images?.[0] || "/placeholder.png"}
                        alt={review.products?.name || "Product"}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-base font-bold text-[#1a1c1d] hover:text-[#008060] transition-colors">
                              <Link href={`/products/${review.product_id}`}>
                                {review.products?.name || "Unknown Product"}
                              </Link>
                            </h2>
                            <div className="flex items-center gap-2.5 mt-1.5">
                              <RatingStars rating={review.rating} />
                              <Badge variant="secondary" className="bg-[#e3f1df] text-[#008060] hover:bg-[#e3f1df] border-none text-[10px] uppercase tracking-wider h-5 px-2 font-bold">
                                Verified Buy
                              </Badge>
                            </div>
                          </div>
                          <time className="text-xs text-[#616161] font-medium bg-[#f6f6f7] px-2 py-1 rounded-md">
                            {new Date(review.created_at).toLocaleDateString("en-IN", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </time>
                        </div>

                        <div className="mt-4 relative">
                          <span className="absolute -left-2 -top-1 text-3xl text-[#e3e3e3] font-serif leading-none">&ldquo;</span>
                          <p className="text-sm text-[#4a4a4a] leading-relaxed pl-3 italic">
                            {review.comment || "The customer didn't leave a written note."}
                          </p>
                        </div>
                      </div>


                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-dashed border-[#e3e3e3] rounded-3xl py-24 text-center">
              <div className="w-16 h-16 bg-[#f6f6f7] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-[#d2d2d2] w-8 h-8" />
              </div>
              <p className="text-[#1a1c1d] font-semibold">No reviews yet</p>
              <p className="text-sm text-[#616161] mb-8">Items you review will appear here.</p>
              <Link href="/account/orders">
                <Button className="bg-[#008060] hover:bg-[#006e52] text-white rounded-full px-8 h-11 font-bold shadow-md">
                  Browse Recent Purchases
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#ffb800" : "none"}
          stroke={star <= rating ? "#ffb800" : "#d2d2d2"}
          strokeWidth={star <= rating ? 0 : 2}
        />
      ))}
    </div>
  );
}
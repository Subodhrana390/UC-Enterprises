import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ReviewDeleteButton } from "@/components/account/ReviewDeleteButton";

export default async function ReviewsHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, products(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1a1c1d]">My Reviews</h1>
          <p className="text-sm text-[#616161] mt-1">
            Manage the feedback you've shared on products.
          </p>
        </header>

        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div
                key={review.id}
                className="bg-white border border-[#ebebeb] rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  {/* Product Thumbnail */}
                  <div className="w-20 h-20 bg-[#f7f7f7] rounded-lg border border-[#f1f1f1] flex-shrink-0 relative overflow-hidden">
                    <Image
                      src={review.products?.images?.[0] || "/placeholder.png"}
                      alt={review.products?.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-semibold text-[#1a1c1d]">
                          {review.products?.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          <RatingStars rating={review.rating} />
                          <Badge className="bg-[#eaf4fe] text-[#005bd3] border-none text-[10px] font-medium px-2 py-0">
                            Verified
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-[#616161]">
                        {new Date(review.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <p className="text-sm text-[#303030] leading-relaxed italic">
                      "{review.content || review.comment}"
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <Link href={`/reviews/${review.id}/edit`}>
                        <Button variant="outline" className="h-8 text-xs border-[#d2d2d2] font-medium hover:bg-[#f6f6f6]">
                          Edit
                        </Button>
                      </Link>
                      <ReviewDeleteButton reviewId={review.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-dashed border-[#d2d2d2] rounded-xl py-16 text-center">
              <span className="material-symbols-outlined text-[#8c8c8c] text-4xl mb-2">
                rate_review
              </span>
              <p className="text-sm text-[#616161]">You haven't written any reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Shopify style stars (Gold/Yellow)
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex text-[#ffb800]">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-lg"
          style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
    </div>
  );
}
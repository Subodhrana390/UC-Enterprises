import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { EditReviewForm } from "@/components/account/EditReviewForm";
import { ReviewDeleteButton } from "@/components/account/ReviewDeleteButton";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: review } = await supabase
    .from("reviews")
    .select("*, products(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!review) notFound();

  const product = review.products as any;
  const content = review.content || review.comment || "";
  const headline = review.headline || "";

  return (
    <main className="p-8 lg:p-12">
      <section className="max-w-4xl mx-auto w-full">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4 opacity-40">
              <Link href="/account" className="hover:text-primary transition-colors">Account</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <Link href="/account/reviews" className="hover:text-primary transition-colors">My Reviews</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary">Edit Feedback</span>
            </nav>
            <h1 className="text-4xl font-black tracking-tight text-on-surface uppercase font-headline">Edit Feedback</h1>
          </div>
          <Link href="/account/reviews" className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-border/40 hover:bg-white transition-all shadow-sm">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-border/40 shadow-xl shadow-primary/5 space-y-6">
              <div className="aspect-square bg-surface rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-6 relative">
                <Image
                  src={product?.images?.[0] || "/placeholder-product.png"}
                  alt={product?.name || "Product"}
                  fill
                  className="object-contain p-8 grayscale-[0.2]"
                />
              </div>
              <div>
                <Badge className="bg-primary text-white border-none text-[9px] font-black font-mono tracking-tighter mb-3">{product?.sku || "—"}</Badge>
                <h2 className="text-2xl font-black leading-none uppercase tracking-tight mb-2">{product?.name || "Product"}</h2>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                  Reviewed {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-border/40 shadow-sm space-y-10">
              <EditReviewForm
                reviewId={review.id}
                defaultRating={review.rating || 4}
                defaultContent={content}
                defaultHeadline={headline}
              />
              <div className="flex justify-start -mt-6">
                <ReviewDeleteButton reviewId={review.id} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

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
    <main className="p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-on-surface mb-2 uppercase font-headline">My Reviews</h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-60">
            Manage your feedback on components and architectural solutions.
          </p>
        </header>

        <div className="space-y-8">
          {reviews && reviews.length > 0 ? reviews.map((review: any) => (
            <div key={review.id} className="bg-white p-8 rounded-3xl flex flex-col md:flex-row gap-10 items-start border border-border/40 hover:shadow-xl hover:shadow-primary/5 transition-all relative group">
              <div className="w-32 h-32 bg-surface rounded-2xl overflow-hidden flex-shrink-0 border border-border/20 shadow-inner flex items-center justify-center p-4 relative">
                <Image src={review.products?.images?.[0] || ""} alt={review.products?.name} fill className="object-contain p-2 grayscale-[0.2]" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                  <div>
                    <h2 className="font-black text-2xl text-on-surface uppercase tracking-tight font-headline mb-3">{review.products?.name}</h2>
                    <div className="flex items-center gap-6">
                      <div className="flex text-blue-600">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "" }}>
                            star
                          </span>
                        ))}
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest text-primary border-primary/20 bg-primary/5 px-2 py-0.5 rounded-sm">
                        Verified Purchase
                      </Badge>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] opacity-40">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-8 opacity-80 max-w-2xl">
                  "{review.content}"
                </p>
                <div className="flex items-center gap-4">
                  <Link href={`/reviews/${review.id}/edit`}>
                    <Button className="h-10 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all px-6">
                      <span className="material-symbols-outlined text-sm mr-2">edit</span>
                      Edit Feedback
                    </Button>
                  </Link>
                  <Button variant="ghost" className="h-10 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl px-6">
                    Discard
                  </Button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center space-y-4 opacity-40">
                <span className="material-symbols-outlined text-6xl">rate_review</span>
                <p className="text-[10px] font-black uppercase tracking-widest">You have not submitted any technical feedback yet.</p>
            </div>
          )}

          {/* Quick Review Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-surface/50 p-8 rounded-3xl border border-border/40 flex flex-col justify-between group hover:bg-white transition-all">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-black text-lg uppercase tracking-tight">Circuit Optimizer v2</h3>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>
                <RatingSmall rating={3} />
                <p className="text-xs text-on-surface-variant font-medium mt-6 line-clamp-2 opacity-60">"The software interface for this optimizer is incredibly intuitive for our junior engineers..."</p>
              </div>
              <div className="mt-8 flex justify-between items-center border-t border-border/10 pt-6">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">August 05, 2023</span>
                <Link href="#" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Quick Manifest</Link>
              </div>
            </div>
            
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 flex flex-col group border-dashed">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-black text-lg uppercase tracking-tight text-primary">Heavy-Duty Busbar (800A)</h3>
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-primary text-white border-none py-0.5">Draft Saved</Badge>
              </div>
              <p className="text-xs text-on-surface-variant font-medium italic opacity-60 mb-6">"Waiting for final stress test results before finalizing technical feedback..."</p>
              <div className="mt-auto flex justify-between items-center border-t border-primary/10 pt-6">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Saved July 29</span>
                <Button className="h-8 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg px-4">Complete Feedback</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 border-t border-border/20 pt-16 text-center max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-5xl text-blue-600 mb-6 opacity-40">rate_review</span>
          <h3 className="text-3xl font-black uppercase tracking-tight font-headline mb-4">New Project Implementation?</h3>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] leading-loose opacity-60 mb-10">
            Share your technical insights with the community and earn Architect Credits for your next B2B procurement phase.
          </p>
          <Button className="h-14 px-10 bg-primary text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
            Initiate New Review
          </Button>
        </div>
      </div>
    </main>
  );
}

function RatingSmall({ rating }: { rating: number }) {
  return (
    <div className="flex text-blue-600 scale-90 origin-left">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "" }}>
          star
        </span>
      ))}
    </div>
  );
}

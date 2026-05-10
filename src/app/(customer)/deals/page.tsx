"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, Clock, Flame, Tag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) };
    };
    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="flex items-center gap-1.5 mt-3">
      <Clock className="w-3.5 h-3.5 text-red-500" />
      <span className="text-xs font-black text-red-600">
        {timeLeft.days > 0 && `${timeLeft.days}d `}{String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">left</span>
    </div>
  );
}

export default function DealsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeals() {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from("deals")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });

      // Filter: show deals that are currently active (within date range or no dates set)
      const filtered = (data || []).filter((d) => {
        if (d.start_date && new Date(d.start_date) > new Date()) return false;
        if (d.end_date && new Date(d.end_date) < new Date()) return false;
        return true;
      });

      setDeals(filtered);
      setLoading(false);
    }
    fetchDeals();
  }, [supabase]);

  return (
    <div className="bg-[linear-gradient(180deg,#fff4e5_0%,#ffffff_100%)]">
      <section className="container mx-auto px-4 py-14">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Live Deals</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Value-led offers for Indian businesses</h1>
          <p className="text-sm text-zinc-600">
            Our best offers are usually tied to quantity, recurring purchase cycles, and GST-ready commercial orders across welding supplies, electronics, chemicals, powders, and general items.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[280px] animate-pulse border border-orange-100 bg-white rounded-sm" />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <div key={deal.id} className="group relative border border-orange-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Badge overlay */}
                {deal.badge_text && (
                  <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-500/30">
                    {deal.badge_text}
                  </div>
                )}

                {/* Image */}
                {deal.image_url ? (
                  <div className="relative h-44 bg-orange-50 overflow-hidden">
                    <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                    <BadgePercent className="w-16 h-16 text-primary/20" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-3">
                  {deal.discount_percentage && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                      <Tag className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-black text-green-700">{deal.discount_percentage}% OFF</span>
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-zinc-950 group-hover:text-primary transition-colors">{deal.title}</h2>
                  {deal.description && <p className="text-sm leading-6 text-zinc-600 line-clamp-2">{deal.description}</p>}
                  {deal.end_date && <CountdownTimer endDate={deal.end_date} />}
                  {deal.link_url && (
                    <Link href={deal.link_url} className="inline-flex items-center gap-2 mt-2 text-sm font-black uppercase tracking-widest text-primary hover:underline">
                      View Deal<ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { title: "Welding and hardware volume pricing", description: "Special commercial pricing for repeat industrial orders, contractors, and workshop supply requirements." },
              { title: "Industrial & Electrical combo savings", description: "Bundle electrical accessories and project equipment for your facility." },
              { title: "Lab chemicals and powders support", description: "Priority handling and negotiated rates for recurring lab consumables and powder supply procurement." },
            ].map((deal) => (
              <div key={deal.title} className="border border-orange-100 bg-white p-6 shadow-sm">
                <BadgePercent className="h-8 w-8 text-primary" />
                <h2 className="mt-4 text-xl font-bold text-zinc-950">{deal.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{deal.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 border border-zinc-200 bg-zinc-950 p-8 text-white">
          <h2 className="text-2xl font-black">Need a custom commercial quote?</h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300">
            Share your product list, target quantity, city, and GST details. We will respond with pricing and delivery feasibility.
          </p>
          <Link href="/bulk-inquiry" className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-300">
            Start bulk inquiry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

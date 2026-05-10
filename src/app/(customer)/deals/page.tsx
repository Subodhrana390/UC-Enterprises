import Link from "next/link";
import { ArrowRight, BadgePercent } from "lucide-react";

const deals = [
  {
    title: "Welding and hardware volume pricing",
    description: "Special commercial pricing for repeat industrial orders, contractors, and workshop supply requirements.",
  },
  {
    title: "Electronic goods combo savings",
    description: "Bundle electronics and accessories for offices, stores, schools, and project deployments.",
  },
  {
    title: "Lab chemicals and powders support",
    description: "Priority handling and negotiated rates for recurring lab consumables and powder supply procurement.",
  },
];

export default function DealsPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#fff4e5_0%,#ffffff_100%)]">
      <section className="container mx-auto px-4 py-14">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Deals</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Value-led offers for Indian businesses</h1>
          <p className="text-sm text-zinc-600">
            Our best offers are usually tied to quantity, recurring purchase cycles, and GST-ready commercial orders across welding supplies, electronics, chemicals, powders, and general items.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {deals.map((deal) => (
            <div key={deal.title} className="border border-orange-100 bg-white p-6 shadow-sm">
              <BadgePercent className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-xl font-bold text-zinc-950">{deal.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{deal.description}</p>
            </div>
          ))}
        </div>

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

import { Building2, FileText, PhoneCall } from "lucide-react";
import { supportEmail, supportPhone } from "@/lib/storefront";

export default function BulkInquiryPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]">
      <section className="container mx-auto px-4 py-14">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Bulk Inquiry</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Commercial sourcing for Indian businesses</h1>
          <p className="text-sm leading-6 text-zinc-600">
            We support enterprise procurement, recurring supply, GST invoicing, delivery planning, and product substitution for welding hardware, electronic goods, lab chemicals, powders, and general order items.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="border border-orange-100 bg-white p-6 shadow-sm">
            <Building2 className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-zinc-950">Who this is for</h2>
            <p className="mt-2 text-sm text-zinc-600">Factories, workshops, labs, contractors, institutes, retailers, and procurement teams.</p>
          </div>
          <div className="border border-orange-100 bg-white p-6 shadow-sm">
            <FileText className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-zinc-950">What to share</h2>
            <p className="mt-2 text-sm text-zinc-600">Product names, quantity, city, required date, GST details, and any preferred brand.</p>
          </div>
          <div className="border border-orange-100 bg-white p-6 shadow-sm">
            <PhoneCall className="h-7 w-7 text-primary" />
            <h2 className="mt-4 text-lg font-bold text-zinc-950">How to reach us</h2>
            <p className="mt-2 text-sm text-zinc-600">{supportPhone}<br />{supportEmail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

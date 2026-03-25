import Link from "next/link";
import { QuotationForm } from "@/components/shop/QuotationForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function QuotePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/quote");
  }

  return (
    <div className="bg-white min-h-screen">
      <main className="pt-10 pb-24 px-4 md:px-8 max-w-[1200px] mx-auto">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-black">Request Quotation</span>
        </nav>

        {/* Header */}
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black mb-4">
            Request for Quotation
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed">
            Need bulk pricing or custom solutions? Submit your requirements and our sales team will provide a detailed quotation within 24 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <QuotationForm />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">
                Why Request a Quote?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-green-600 mt-0.5">check_circle</span>
                  <span>Bulk order discounts up to 30%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-green-600 mt-0.5">check_circle</span>
                  <span>Custom packaging and labeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-green-600 mt-0.5">check_circle</span>
                  <span>Extended payment terms for businesses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base text-green-600 mt-0.5">check_circle</span>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <div className="bg-black rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-300 mb-4">
                Our sales team is available Monday to Saturday, 9 AM to 6 PM IST.
              </p>
              <Link 
                href="/support" 
                className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold hover:underline"
              >
                Contact Support
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: rawCartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id);

  const cartItems = rawCartItems || [];
  const subtotal = cartItems.reduce((acc, item: any) => acc + (item.products?.base_price * item.quantity), 0);
  const shipping = subtotal > 0 ? 0 : 0; // PROMO FREE
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + shipping + gst;

  const steps = [
    { number: 1, title: "Shipping Architecture", active: true },
    { number: 2, title: "Payment Protocol", active: false },
    { number: 3, title: "Final Review", active: false },
  ];

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-10 pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Checkout steps */}
          <div className="lg:col-span-8 space-y-12">
            <header className="mb-10">
              <h1 className="font-headline text-4xl font-black tracking-tighter text-on-surface mb-2 uppercase">Secure Checkout</h1>
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-60">
                Complete your order for UCEnterprises high-precision components.
              </p>
            </header>

            {/* Step 1: Shipping */}
            <section className="bg-white p-10 rounded-3xl border border-border/40 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-[120px]">local_shipping</span>
               </div>
              
              <div className="flex items-center gap-6 mb-10">
                <span className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">1</span>
                <h2 className="font-headline text-2xl font-black tracking-tight uppercase">Select Logistics Hub</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Active Address */}
                <div className="p-6 rounded-2xl border-2 border-primary bg-blue-50/30 relative cursor-pointer shadow-lg shadow-primary/5 group">
                  <div className="absolute top-6 right-6 text-primary">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <p className="font-black text-on-surface mb-2 uppercase tracking-tight">Corporate Headquarters</p>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed uppercase opacity-80">
                    402, Enterprise Plaza, Tech Hub<br/>
                    Bangalore, KA 560100<br/>
                    India
                  </p>
                  <div className="mt-6 flex gap-4">
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Edit Hub Details</button>
                  </div>
                </div>

                {/* Alternative Address */}
                <div className="p-6 rounded-2xl bg-surface border border-border/60 hover:border-primary/40 hover:bg-white transition-all cursor-pointer group">
                  <p className="font-black text-on-surface mb-2 uppercase tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">Regional R&D Lab</p>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed uppercase opacity-40 group-hover:opacity-60 transition-opacity">
                    Plot 12, Industrial Area Phase II<br/>
                    Pune, MH 411013<br/>
                    India
                  </p>
                  <div className="mt-6">
                    <button className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest hover:text-primary transition-colors">Deliver to this Hub</button>
                  </div>
                </div>

                {/* Add New */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-on-surface-variant hover:bg-white hover:border-primary/20 transition-all cursor-pointer group">
                  <span className="material-symbols-outlined text-3xl mb-3 group-hover:scale-110 transition-transform">add_location</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Register New Hub</span>
                </div>
              </div>

              {/* GST Invoice Support */}
              <div className="mt-10 pt-10 border-t border-border/20">
                <label className="flex items-center gap-4 cursor-pointer group bg-surface/50 p-4 rounded-xl border border-transparent hover:border-primary/10 transition-all">
                  <Checkbox id="gst" className="w-6 h-6 rounded-lg border-2 border-border/60 data-[state=checked]:bg-primary" />
                  <div className="flex items-center gap-3">
                    <span className="font-black text-on-surface uppercase tracking-tight text-sm">Request Fiscal GST Invoice</span>
                    <Badge variant="outline" className="text-[9px] font-black font-mono border-primary/20 text-primary uppercase py-0 px-1.5">B2B Compliant</Badge>
                  </div>
                </label>
                <p className="mt-3 ml-12 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                  UCEnterprises supports multi-national tax compliance. Enter your GSTIN in the next validation phase.
                </p>
              </div>
            </section>

            {/* Subsequent Steps (Placeholders) */}
            <div className="space-y-6">
              <div className="bg-surface-container-low p-8 rounded-3xl border border-border/20 opacity-40 flex items-center gap-6">
                <span className="w-8 h-8 rounded-xl bg-border/40 text-on-surface flex items-center justify-center font-black">2</span>
                <h2 className="font-headline text-lg font-black tracking-tight uppercase">Payment Protocol</h2>
              </div>
              <div className="bg-surface-container-low p-8 rounded-3xl border border-border/20 opacity-40 flex items-center gap-6">
                <span className="w-8 h-8 rounded-xl bg-border/40 text-on-surface flex items-center justify-center font-black">3</span>
                <h2 className="font-headline text-lg font-black tracking-tight uppercase">Order Review</h2>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-border/40 shadow-xl shadow-primary/5">
                <h3 className="font-headline text-xl font-black mb-8 uppercase tracking-tight">Order Architecture</h3>
                
                {/* Item List */}
                <div className="space-y-6 mb-10">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center group">
                      <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-border/20 relative">
                        <Image src={item.products?.images?.[0] || ""} alt={item.products?.name} fill className="object-contain p-2 grayscale-[0.2]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black text-on-surface uppercase tracking-tight leading-none mb-2">{item.products?.name} <span className="text-[10px] text-on-surface-variant ml-2 opacity-60">x{item.quantity}</span></p>
                        <Badge variant="outline" className="text-[8px] font-black font-mono opacity-40 uppercase py-0 h-4">{item.products?.sku}</Badge>
                      </div>
                        <p className="text-sm font-black text-on-surface font-headline">${(item.products?.base_price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 border-t border-border/20 pt-8">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                    <span>Shipping (Standard Express)</span>
                    <span className="text-blue-600 font-black">PROMO FREE</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                    <span>Estimated Fiscal GST</span>
                    <span>${gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="flex justify-between items-end pt-6">
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Total Amount</p>
                    <p className="text-3xl font-black text-primary tracking-tighter font-headline">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <Button className="w-full mt-10 h-14 bg-primary text-white font-black text-sm rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">
                  Authorize & Pay
                </Button>
              </div>

              {/* Secure Checkout Badges */}
              <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-6 flex flex-col items-center gap-6">
                <div className="flex items-center gap-8 opacity-40">
                  <span className="material-symbols-outlined text-3xl">lock</span>
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                  <span className="material-symbols-outlined text-3xl">shield</span>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-blue-900 uppercase tracking-[0.2em] leading-relaxed opacity-60">
                    Military-Grade Encryption Protocol<br/>
                    & Secure SSL Authentication
                  </p>
                </div>
              </div>

              {/* Support Card */}
              <div className="p-8 rounded-2xl bg-white border border-border/40 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600">help_outline</span>
                  <p className="text-sm font-black uppercase tracking-tight">Need Logistics Support?</p>
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60 leading-relaxed">
                  Our dedicated engineering support team is available 24/7 for order routing assistance.
                </p>
                <Link className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-blue-800 transition-colors" href="/support">
                  Talk to an Architect
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

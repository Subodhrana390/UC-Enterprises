"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function EditReviewPage() {
  const [rating, setRating] = useState(4);
  
  return (
    <main className="p-8 lg:p-12">
      <section className="max-w-4xl mx-auto w-full">
        {/* Breadcrumbs / Header */}
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
          {/* Left Column: Product Context */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-border/40 shadow-xl shadow-primary/5 space-y-6">
              <div className="aspect-square bg-surface rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-6 relative">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2rF7YDaww8daM98ZbADUwjQvG0SRFnlGC-i_44XEA_sycxCap2QccNqDKbeDtDp5mwIpr8Oc8fagj4qhUpsWd_drLKTiNTOMBkQ4QQqF2Z-t4q0l79KBHSep4f_xjDbTMih-oPi1twWY6KVbdF9h9pJOLlEwCLW5qXmXymt9HVIu-_oavAnNE3gxcskE1dgqeSlYMlGrVjHG3dnzRta6RuZXQ5ZLQmfmVW3RKQr1FswoxJXo0EQAmzZIzqI5ibpPtoVY3cDQ2cIKi" 
                  alt="Quantum Core" 
                  fill
                  className="object-contain p-8 grayscale-[0.2]" 
                />
              </div>
              <div>
                <Badge className="bg-primary text-white border-none text-[9px] font-black font-mono tracking-tighter mb-3">UCE-990-X</Badge>
                <h2 className="text-2xl font-black leading-none uppercase tracking-tight mb-2">Quantum Core v4.2 Parallel Processor</h2>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Purchased Dec 12, 2023</p>
              </div>
            </div>

            {/* Rating Selector */}
            <div className="bg-primary text-white p-8 rounded-3xl border-b-8 border-blue-950 shadow-2xl flex flex-col items-center">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-6 opacity-60">Procurement Satisfaction</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <span className={`material-symbols-outlined text-4xl ${star <= rating ? 'text-blue-400' : 'text-white/20'}`} style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "" }}>
                      star
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-2xl font-black mt-4 font-headline">{rating.toFixed(1)}</p>
              <p className="text-[9px] font-black text-center mt-6 uppercase leading-loose opacity-40">
                Directly influences the Technical Authority Index for this manifest.
              </p>
            </div>
          </div>

          {/* Right Column: Form Inputs */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-3xl border border-border/40 shadow-sm space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 px-1">Feedback Headline</label>
                <Input 
                  className="h-14 bg-surface border-border/40 rounded-xl px-6 focus:ring-2 focus:ring-primary font-black text-on-surface uppercase tracking-tight" 
                  value="Exceptional parallel processing, but documentation is sparse."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 px-1">Technical Deep-Dive</label>
                <Textarea 
                  className="min-h-[240px] bg-surface border-border/40 rounded-xl px-6 py-6 focus:ring-2 focus:ring-primary font-medium text-sm leading-relaxed text-on-surface" 
                  defaultValue="Integrating the Quantum Core v4.2 into our legacy enterprise architecture was surprisingly smooth. The clock speeds were consistently 15% higher than the baseline v4.1, especially under sustained thermal loads.
                  
However, the B2B portal documentation provided doesn't quite cover the specific pin-out configurations for the v4.2 revision. I had to reach out to Tier 3 support to get the corrected schematics."
                />
                <div className="flex justify-end pr-2">
                  <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">482 / 2000 CHARS</span>
                </div>
              </div>

              {/* Implementation Gallery */}
              <div className="space-y-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 px-1">Implementation Architecture Gallery</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <GalleryItem src="https://lh3.googleusercontent.com/aida-public/AB6AXuC76Xo8N2gp38mibRpkVBzhPhj0A19lcQzmwByRHzVWbUlHhkPcv0XYaVBF3XvQ0ij3ua55vSSAxK_jaawahzTeGm-auYbYBvevQlYGTZTvDS-AFGEmdOI1ol4y1TxFaMfdbMlsftZRrG_67obOofKt0SNzm0hWbtL_RcL3VUdJEo5rEaO23thweFNSP7pEW_K1FJZR-RBVPk5X_E1VIgj_9_md9McTRy4PXZaCRZgdgMVWWsPJd-lDoyACrT2RZ3cQGdZ8GL-z3xHE" />
                  <GalleryItem src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcbVSYJn46Y_UWks2blFemarStYzQOQ6fpTnbKoe3dpWh9vfvRq_cZ2vp8nP-9keiI1tayyA0unUtwWN-HLRmRPpcP4iRGgCmR0e2J8x7o2mnxQLUto8ndZrlHE6yhduD9LDVaKiUyDxlq9K-291yeobt3FeJDSxYU5v9MyAy4lUUTo9sv2W6JUIuD3KNdragu3C3BcoQbDiXY7qvWuf9k3AuvcSELQXEd3buLmehd8z57mUJKCNca1TpdsxNJlML4Z-DXkS3l40VS" />
                  <button className="aspect-square rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center gap-2 hover:bg-surface hover:border-primary/20 transition-all text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Asset</span>
                  </button>
                </div>
              </div>

              <div className="pt-10 border-t border-border/20 flex flex-col sm:flex-row items-center justify-end gap-6">
                <Button variant="ghost" className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary rounded-xl px-10">
                  Discard Prototype
                </Button>
                <Button className="w-full sm:w-auto h-14 bg-primary text-white font-black text-xs uppercase tracking-[0.15em] rounded-2xl px-12 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  Publish Manifest Update
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border/60 text-on-surface-variant px-3 py-1 bg-white opacity-40">Verified Procurement</Badge>
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border/60 text-on-surface-variant px-3 py-1 bg-white opacity-40">Architecture Validated</Badge>
              <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-border/60 text-on-surface-variant px-3 py-1 bg-white opacity-40">Revised Mar 20, 2024</Badge>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function GalleryItem({ src }: { src: string }) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden group border border-border/20 shadow-sm">
      <Image src={src} alt="Implementation" fill className="object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
      <button className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl">
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
    </div>
  );
}

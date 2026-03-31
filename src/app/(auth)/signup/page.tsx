"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/actions/auth";

export default function SignupPage() {
  const [accountType, setAccountType] = useState<"individual" | "business">("individual");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("accountType", accountType);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      {/* Circuit Background Patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-fixed-dim rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-surface-container-highest rounded-full blur-[120px]"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(0, 8, 22, 0.05) 1px, transparent 0)",
            backgroundSize: "24px 24px"
          }}
        ></div>
      </div>

      {/* Auth Container */}
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-2xl relative z-10 min-h-[700px] border border-border/40">

        {/* Left Side: Signup Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between border-r border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
              <span className="font-headline font-black text-2xl tracking-tighter text-on-surface">UCEnterprises</span>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="font-headline font-black text-3xl tracking-tight text-on-surface">Create Account</h1>
              <p className="text-on-surface-variant leading-relaxed text-sm font-medium">
                Join our B2B marketplace to access wholesale pricing, industrial fabrication, and bulk procurement tools.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 font-medium flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-500 text-lg">error</span>
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Account Type</Label>
                <div className="flex gap-1 p-1 bg-surface-container-low rounded-lg h-11">
                  <button
                    onClick={() => setAccountType("individual")}
                    className={`flex-1 text-xs font-bold rounded-md transition-all ${accountType === 'individual' ? 'bg-white shadow-sm text-[#008060]' : 'text-on-surface-variant hover:text-on-surface'}`}
                    type="button"
                  >
                    Personal
                  </button>
                  <button
                    onClick={() => setAccountType("business")}
                    className={`flex-1 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${accountType === 'business' ? 'bg-white shadow-sm text-[#008060]' : 'text-on-surface-variant hover:text-on-surface'}`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">business</span>
                    Business / GST
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    required
                    className="bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="First Name"
                    type="text"
                  />
                  <Input
                    name="lastName"
                    required
                    className="bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Last Name"
                    type="text"
                  />
                </div>
                <Input
                  name="email"
                  required
                  className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder={accountType === 'business' ? "Work Email Address" : "Email Address"}
                  type="email"
                />

                <div className="relative">
                  <Input
                    name="password"
                    required
                    minLength={6}
                    className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all pr-12"
                    placeholder="Password (min. 6 characters)"
                    type="password"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 text-lg">
                    lock
                  </span>
                </div>

                {accountType === 'business' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="companyName"
                      required
                      className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all"
                      placeholder="Company Legal Name"
                      type="text"
                    />
                    <Input
                      name="gstNumber"
                      className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all uppercase"
                      placeholder="GSTIN (Optional)"
                      type="text"
                    />
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-[#008060]/5 rounded-lg border border-[#008060]/10">
                  <span className="material-symbols-outlined text-[#008060] text-xl">verified</span>
                  <p className="text-[10px] leading-relaxed text-on-surface font-medium">
                    By registering, you agree to the <Link href="#" className="underline font-bold text-[#008060]">Merchant Terms of Service</Link> and acknowledge our B2B Privacy Policy.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#008060] text-white h-14 rounded-lg font-bold tracking-tight shadow-xl shadow-green-900/10 hover:bg-[#006e52] transition-all text-sm"
              >
                {loading ? "Processing..." : "Create an Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-on-surface-variant mt-6 font-medium">
              Already have a store account? <Link href="/login" className="text-blue-600 font-bold hover:underline ml-1">Log in</Link>
            </p>
          </div>

          <div className="mt-12 flex items-center gap-8 text-[9px] text-on-surface-variant/50 uppercase tracking-[0.2em] font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span>
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>Merchant Verified</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Context */}
        <div className="relative bg-surface-container-low p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <span className="material-symbols-outlined absolute top-10 left-10 text-9xl text-primary rotate-12 opacity-5">
              local_shipping
            </span>
            <span className="material-symbols-outlined absolute bottom-10 right-10 text-8xl text-primary -rotate-12 opacity-5">
              receipt_long
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-xs space-y-6">
            <h2 className="font-headline font-black text-2xl tracking-tight">Merchant Perks</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
              Registered businesses get access to tax-exempt purchasing and dedicated account managers for large-scale fabrication.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-xl border border-border/40 shadow-sm">
                <p className="text-xl font-bold text-[#008060]">GST</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Input Credit</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-border/40 shadow-sm">
                <p className="text-xl font-bold text-[#008060]">Bulk</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Tier Pricing</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="absolute bottom-12 flex items-center gap-6 opacity-30 grayscale text-[10px] font-black tracking-widest uppercase">
            <span>GST Ready</span>
            <span>B2B Verified</span>
            <span>ISO Certified</span>
          </div>
        </div>

      </div>
    </main>
  );
}
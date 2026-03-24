"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface relative overflow-hidden">
      {/* Circuit Background Patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-fixed-dim rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-surface-container-highest rounded-full blur-[120px]"></div>
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

        {/* Left Side: Login Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between border-r border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
              <span className="font-headline font-black text-2xl tracking-tighter text-on-surface">UCEnterprises</span>
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="font-headline font-black text-3xl tracking-tight text-on-surface">Customer Login</h1>
              <p className="text-on-surface-variant leading-relaxed text-sm font-medium">
                Manage your store, track industrial orders, and oversee global fabrication requests.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-700 font-medium flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-500 text-lg">error</span>
                {error}
              </div>
            )}

            {/* Login Form */}
            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    name="email"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all pr-12"
                    placeholder="Email Address"
                    type="email"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 text-lg">
                    person
                  </span>
                </div>

                <div className="relative">
                  <Input
                    name="password"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all pr-12"
                    placeholder="Password"
                    type="password"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 text-lg">
                    lock
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="rounded-sm border-border" />
                  <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer select-none font-medium">Stay logged in</label>
                </div>
                <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">Forgot password?</Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#008060] text-white h-14 rounded-lg font-bold tracking-tight shadow-xl shadow-green-900/10 hover:bg-[#006e52] transition-all flex items-center justify-center gap-2 group text-sm"
              >
                <span>{loading ? "Authenticating..." : "Log in"}</span>
                {!loading && (
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-12 flex items-center gap-8 text-[9px] text-on-surface-variant/50 uppercase tracking-[0.2em] font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">security</span>
              <span>SSL Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Redirect */}
        <div className="relative bg-surface-container-low p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <span className="material-symbols-outlined absolute top-10 right-10 text-9xl text-primary rotate-12 opacity-5">
              inventory_2
            </span>
            <span className="material-symbols-outlined absolute bottom-10 left-10 text-8xl text-primary -rotate-12 opacity-5">
              payments
            </span>
          </div>

          <div className="relative z-10 max-w-xs space-y-6">
            <h2 className="font-headline font-black text-2xl tracking-tight">New to UCEnterprises?</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
              Join the network of industrial merchants. Access wholesale pricing, bulk inventory, and turnkey fabrication services.
            </p>
            <Link href="/signup" className="block w-full">
              <Button variant="outline" className="w-full h-14 border-on-surface/20 hover:bg-on-surface hover:text-white transition-all font-bold text-sm rounded-lg">
                Create an Account
              </Button>
            </Link>
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
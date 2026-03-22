"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
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
                settings_input_component
              </span>
              <span className="font-headline font-black text-2xl tracking-tighter text-on-surface">UCEnterprises</span>
            </div>
            
            <div className="space-y-2 mb-8">
              <h1 className="font-headline font-black text-3xl tracking-tight text-on-surface">Join the Network</h1>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Create your engineering account to unlock global distribution and fabrication tools.
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
                <Label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Account Category</Label>
                <div className="flex gap-1 p-1 bg-surface-container-low rounded-lg h-11">
                  <button 
                    onClick={() => setAccountType("individual")}
                    className={`flex-1 text-xs font-bold rounded-md transition-all ${accountType === 'individual' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                    type="button"
                  >
                    Individual
                  </button>
                  <button 
                    onClick={() => setAccountType("business")}
                    className={`flex-1 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${accountType === 'business' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">business</span>
                    Business
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
                  placeholder={accountType === 'business' ? "Work Email Address" : "Personal Email Address"} 
                  type="email" 
                />

                <div className="relative">
                  <Input 
                    name="password"
                    required
                    minLength={6}
                    className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all pr-12" 
                    placeholder="Create Password (min 6 characters)" 
                    type="password" 
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 text-lg">
                    lock
                  </span>
                </div>
                
                {accountType === 'business' && (
                  <Input 
                    name="companyName"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all" 
                    placeholder="Company Name" 
                    type="text" 
                  />
                )}

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-xl">info</span>
                  <p className="text-[10px] leading-relaxed text-on-surface">
                    By creating an account, you agree to our <Link href="#" className="underline font-bold">Technical Licensing Terms</Link> and our global data privacy standards.
                  </p>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white h-14 rounded-lg font-bold tracking-tight shadow-xl shadow-primary/10 hover:opacity-90 transition-all text-sm"
              >
                {loading ? "Creating Account..." : "Create Master Account"}
              </Button>
            </form>

            <p className="text-center text-xs text-on-surface-variant mt-6 font-medium">
              Already standardized? <Link href="/login" className="text-blue-600 font-bold hover:underline ml-1">Initialize Session</Link>
            </p>
          </div>

          <div className="mt-12 flex items-center gap-8 text-[9px] text-on-surface-variant/50 uppercase tracking-[0.2em] font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>AES-256</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>SOC2</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Context */}
        <div className="relative bg-surface-container-low p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
          {/* Abstract Technical Visuals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <span className="material-symbols-outlined absolute top-10 left-10 text-9xl text-primary rotate-12 opacity-5">
              layers
            </span>
            <span className="material-symbols-outlined absolute bottom-10 right-10 text-8xl text-primary -rotate-12 opacity-5">
              hub
            </span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-xs space-y-6">
            <h2 className="font-headline font-black text-2xl tracking-tight">Enterprise Scale</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Standardize your procurement. Access real-time inventory for over 500,000 components with global shipping.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 p-4 rounded-xl border border-border/40 shadow-sm">
                <p className="text-xl font-bold text-primary">24h</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Rapid Dispatch</p>
              </div>
              <div className="bg-white/80 p-4 rounded-xl border border-border/40 shadow-sm">
                <p className="text-xl font-bold text-primary">500k+</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Live SKUs</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="absolute bottom-12 flex items-center gap-6 opacity-30 grayscale text-[10px] font-black tracking-widest uppercase">
            <span>ISO 9001</span>
            <span>RoHS</span>
            <span>REACH</span>
          </div>
        </div>

      </div>
    </main>
  );
}

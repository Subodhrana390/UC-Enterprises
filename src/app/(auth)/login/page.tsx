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
    // If we get here, redirect didn't happen — so there's an error
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
                settings_input_component
              </span>
              <span className="font-headline font-black text-2xl tracking-tighter text-on-surface">UCEnterprises</span>
            </div>
            
            <div className="space-y-2 mb-8">
              <h1 className="font-headline font-black text-3xl tracking-tight text-on-surface">Precision Access</h1>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Secure gateway to global electronic components and engineering fabrication.
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
                    placeholder="Professional Email" 
                    type="email" 
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 text-lg">
                    alternate_email
                  </span>
                </div>
                
                <div className="relative">
                  <Input 
                    name="password"
                    required
                    className="w-full bg-surface-container-low border-none rounded-lg h-14 px-5 text-sm focus:ring-2 focus:ring-primary/10 transition-all pr-12" 
                    placeholder="Access Token / Password" 
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
                  <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer select-none">Stay authenticated</label>
                </div>
                <Link href="#" className="text-xs text-blue-600 font-bold hover:underline">Reset access?</Link>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white h-14 rounded-lg font-bold tracking-tight shadow-xl shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-2 group text-sm"
              >
                <span>{loading ? "Authenticating..." : "Initialize Session"}</span>
                {!loading && (
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                <span className="bg-white px-4 text-on-surface-variant/60 font-bold">Unified SSO</span>
              </div>
            </div>

            <Button variant="outline" className="w-full h-14 border-border/60 rounded-lg flex items-center justify-center gap-3 text-sm font-bold text-on-surface hover:bg-surface-container-low transition-all">
              <Image 
                alt="Google" 
                width={20} 
                height={20} 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV6ltFysoLrxg-EsHDR6SnvNGBO3j0-XRpJphjlAjX-8y9R17d-mGJnexonAtJAnNaU1OX0NU6dcWU7_abeVEtrlCswHIk8spaUzlkX0On-Bk5ZCoW4Qg0Wc6kgVn1j01rxariQ6xgfbK5XiEoaxvcsxb4cQ8fH6-r42sChBnBt7iKqMRqwILyHb_xJ7022qJcwfTrM0rP-32_qjyFeFy2p-gK64fjdRg61hIFkbChaFfQqcxUmsXDsrsHnqhoEP2_KBFl5fqhzWXY" 
              />
              <span>Continue with Enterprise Google</span>
            </Button>
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

        {/* Right Side: Signup Redirect */}
        <div className="relative bg-surface-container-low p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center text-center">
          {/* Abstract Technical Visuals */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <span className="material-symbols-outlined absolute top-10 right-10 text-9xl text-primary rotate-12 opacity-5">
              developer_board
            </span>
            <span className="material-symbols-outlined absolute bottom-10 left-10 text-8xl text-primary -rotate-12 opacity-5">
              memory
            </span>
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-xs space-y-6">
            <h2 className="font-headline font-black text-2xl tracking-tight">New Engineering Account</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Join UCEnterprises to access custom fabrication tools, volume pricing, and enterprise inventory management.
            </p>
            <Link href="/signup" className="block w-full">
              <Button variant="outline" className="w-full h-14 border-on-surface/20 hover:bg-on-surface hover:text-white transition-all font-bold text-sm rounded-lg">
                Create Master Account
              </Button>
            </Link>
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

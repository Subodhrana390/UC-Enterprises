"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Box, Globe, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { createClient } from "@/utils/supabase/client";

import { Suspense } from "react";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/account/profile";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white border border-zinc-100 shadow-2xl p-10 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-primary mx-auto flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">Customer Login</h1>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Login to track orders, wishlist, cart and quote requests</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="redirectTo" value={returnTo} />
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email ID</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                name="email"
                type="email" 
                placeholder="name@example.com"
                required
                className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Password</label>
              <Link href="/forgot-password" title="Recover Access" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-zinc-950 hover:bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-zinc-200 group rounded-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Login
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest bg-white px-4 text-zinc-400">Quick login options</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 border border-zinc-100 hover:bg-zinc-50 transition-all font-bold text-xs uppercase tracking-widest">
          <Globe className="w-4 h-4" /> Google
        </button>
        <button className="flex items-center justify-center gap-2 py-3 border border-zinc-100 hover:bg-zinc-50 transition-all font-bold text-xs uppercase tracking-widest">
          <Box className="w-4 h-4" /> Github
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-zinc-500 font-medium">
          New customer? {" "}
          <Link href="/register" className="text-primary font-black uppercase tracking-widest hover:underline">Register Account</Link>
        </p>
      </div>
      <div className="pt-4 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-300 uppercase tracking-widest border-t border-zinc-50">
        <ShieldCheck className="w-3 h-3" />
        Secure login with HTTP-only session
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [{ data: cats }, { data: { user: u } }] = await Promise.all([
        supabase.from("categories").select("id, name, slug, parent_id").order("name"),
        supabase.auth.getUser()
      ]);
      setCategories(cats || []);
      setUser(u);
    }
    fetchData();
  }, [supabase]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} user={user} />
      
      <main className="flex-1 bg-zinc-50 flex items-center justify-center py-20 px-6">
        <Suspense fallback={
          <div className="w-full max-w-md bg-white border border-zinc-100 shadow-2xl p-10 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Secure Portal...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

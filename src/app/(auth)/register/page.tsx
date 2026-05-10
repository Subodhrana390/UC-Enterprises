"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, ShieldCheck, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    if (formData.get('password') !== formData.get('confirmPassword')) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    const result = await signup(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result?.success) {
      toast.success("Account created! Please check your email for verification.");
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-xl bg-white border border-zinc-100 shadow-2xl p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary mx-auto flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Customer Registration</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Create your account for orders, quotes, cart and wishlist</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  name="name"
                  type="text" 
                  placeholder="John Doe"
                  required
                  className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  name="company"
                  type="text" 
                  placeholder="Industrial Solutions Ltd"
                  required
                  className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  name="email"
                  type="email" 
                  placeholder="john@company.com"
                  required
                  className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">+91</span>
                <input 
                  name="phone"
                  type="tel" 
                  placeholder="98888 63377"
                  className="w-full bg-zinc-50 border border-zinc-100 pl-14 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">GST Number (Optional)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  name="gst"
                  type="text" 
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none uppercase"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" required className="mt-1 w-4 h-4 border-2 border-zinc-100 rounded-none checked:bg-primary accent-primary" id="terms" />
            <label htmlFor="terms" className="text-[10px] font-bold text-zinc-500 leading-tight uppercase tracking-widest">
              I AGREE TO THE <Link href="/terms-of-service" className="text-primary hover:underline">TERMS OF SERVICE</Link> AND <Link href="/privacy-policy" className="text-primary hover:underline">PRIVACY POLICY</Link> FOR ENTERPRISE ACCESS.
            </label>
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
                Initialize Account
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-zinc-500 font-medium">
            Already registered? {" "}
            <Link href="/login" className="text-primary font-black uppercase tracking-widest hover:underline">Log In Here</Link>
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-300 uppercase tracking-widest border-t border-zinc-50">
          <ShieldCheck className="w-3 h-3" />
          Secure signup and cookie-based session support
        </div>
      </div>
    </div>
  );
}

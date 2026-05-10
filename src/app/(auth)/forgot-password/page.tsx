"use client";

import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="bg-zinc-50 flex items-center justify-center py-20 px-6">
      <div className="w-full max-w-md bg-white border border-zinc-100 shadow-2xl p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary mx-auto flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Forgotten Password Recovery</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest text-center">Reset your encrypted security credentials</p>
        </div>

        <div className="bg-zinc-50 border-l-4 border-primary p-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
            Enter your registered email ID. We will transmit a secure recovery link to reset your access tokens.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email ID / Mobile Number</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="98888 63377 or admin@enterprise.com"
              className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all rounded-none"
            />
          </div>
        </div>

        <Button className="w-full h-14 bg-zinc-950 hover:bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-zinc-200 group rounded-none">
          Send Recovery Link
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        <div className="text-center">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">Return to Terminal Login</Link>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-[9px] font-black text-zinc-300 uppercase tracking-widest border-t border-zinc-50">
          <ShieldCheck className="w-3 h-3" />
          Automated Recovery Protocol v2.4
        </div>
      </div>
    </div>
  );
}

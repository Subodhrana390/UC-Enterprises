"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, Loader2, Search, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-[#050505] flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 space-y-8 rounded-[2rem] relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
             <div className="w-24 h-24 bg-zinc-950 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
                <Terminal className="w-10 h-10 text-primary" />
             </div>
          </div>

          <div className="text-center space-y-2 pt-8">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Admin <span className="text-primary">Portal</span></h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="redirectTo" value="/admin" />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Secure Identifier</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="admin_id@uc.enterprise"
                    required
                    className="w-full bg-zinc-950/50 border border-white/5 px-12 py-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 focus:bg-zinc-950 transition-all rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Key</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-zinc-950/50 border border-white/5 px-12 py-4 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-primary/50 focus:bg-zinc-950 transition-all rounded-2xl"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 group rounded-2xl border-t border-white/10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Establish Connection
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-6 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3 h-3 text-primary" />
                End-to-End Encrypted Session
             </div>
             <Link href="/" className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                Return to Public Site
             </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
           <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
              &copy; 2026 UC Enterprises &bull; Security Infrastructure
           </p>
        </div>
      </motion.div>
    </div>
  );
}

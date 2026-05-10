"use client";

import { useState, useEffect } from "react";
import { RotateCcw, AlertTriangle, ArrowRight, ShieldCheck, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReturnRequest {
  id: string;
  order_id: string;
  reason: string;
  status: string;
  created_at: string;
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchReturns();
  }, []);

  async function fetchReturns() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('returns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReturns(data || []);
    } catch (error: any) {
      console.error('Error fetching returns:', error);
      toast.error("Failed to load return requests");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Returns & Replacements</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Request returns, replacement or support for delivered items</p>
        </div>
        <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-none shadow-lg">
          <RotateCcw className="w-4 h-4 mr-2" /> Request Return
        </Button>
      </div>

      <div className="bg-white border border-zinc-100 shadow-xl p-10 space-y-10">
        <div className="flex items-center gap-6 text-amber-500 bg-amber-50 p-6 border border-amber-100">
          <AlertTriangle className="w-10 h-10 shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-widest">Important Return Note</h3>
            <p className="text-xs font-bold leading-relaxed uppercase tracking-widest text-amber-600/80">
              RETURN ITEMS IN THEIR ORIGINAL PACKING WHERE POSSIBLE. USED, DAMAGED OR OPENED MATERIAL MAY NOT QUALIFY FOR RETURN OR REPLACEMENT.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Fetching your requests...</p>
            </div>
          ) : returns.length > 0 ? (
            returns.map((request) => (
              <div key={request.id} className="flex items-center justify-between border-b border-zinc-100 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Return Request #{request.id.slice(0, 8).toUpperCase()}</h4>
                    <p className="text-lg font-black tracking-tight mt-1">{request.reason}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase px-3 py-1",
                        request.status === 'Approved' ? "bg-emerald-500 text-white" : 
                        request.status === 'Rejected' ? "bg-red-500 text-white" :
                        "bg-zinc-950 text-white"
                      )}>
                        {request.status}
                      </span>
                      <span className="text-[9px] font-black uppercase text-zinc-400">
                        Requested: {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="border-zinc-950 text-zinc-950 font-black uppercase tracking-widest text-[10px] px-6 rounded-none group">
                  View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-100 rounded-3xl">
              <RotateCcw className="w-12 h-12 text-zinc-200 mb-4" />
              <p className="text-sm font-black uppercase tracking-widest text-zinc-400">No return requests found</p>
              <p className="text-[10px] font-bold text-zinc-300 mt-2">YOU HAVEN'T INITIATED ANY RETURNS YET.</p>
            </div>
          )}
        </div>

        <div className="pt-10 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">01. Raise Request</h5>
            <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">SHARE ORDER DETAILS, ISSUE PHOTOS AND THE REASON FOR RETURN OR REPLACEMENT.</p>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">02. Pickup Review</h5>
            <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">OUR TEAM WILL CONFIRM WHETHER PICKUP, REPLACEMENT OR DIRECT SUPPORT IS APPLICABLE.</p>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">03. Final Update</h5>
            <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest">ON APPROVAL, WE WILL PROCESS REPLACEMENT, CREDIT NOTE OR REFUND AS PER POLICY.</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 text-white p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <p className="text-xs font-black uppercase tracking-widest">Support available as per product warranty and seller policy</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">Read Return Policy</button>
      </div>
    </div>
  );
}

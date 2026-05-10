"use client";

import { BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Strategic Analytics</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Real-time Performance Intelligence & Market Data</p>
        </div>
        <Button className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl shadow-lg shadow-primary/20">
          Export Intelligence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Conversion Rate", value: "3.24%", trend: "+1.2%", color: "text-emerald-500", icon: <TrendingUp className="w-5 h-5" /> },
          { label: "Active Sessions", value: "1,284", trend: "+42", color: "text-emerald-500", icon: <Globe className="w-5 h-5" /> },
          { label: "System Load", value: "12%", trend: "Optimal", color: "text-primary", icon: <Zap className="w-5 h-5" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-400">{stat.icon}</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.trend}</span>
            </div>
            <p className="text-3xl font-black tracking-tighter mb-1">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-100 rounded-[3rem] p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8 text-zinc-200" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-zinc-950">Advanced Intelligence Processing</h2>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
            We are currently aggregating deep-market data and procurement patterns. Advanced visualizations will be deployed shortly.
          </p>
        </div>
      </div>
    </div>
  );
}

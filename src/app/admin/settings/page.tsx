"use client";

import { Settings, Shield, Bell, Database, HardDrive, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const sections = [
    { icon: <Shield className="w-5 h-5" />, title: "Security Matrix", desc: "Configure access protocols and RLS policies." },
    { icon: <Bell className="w-5 h-5" />, title: "Node Notifications", desc: "Manage system-wide alerts and procurement triggers." },
    { icon: <Database className="w-5 h-5" />, title: "Database Sync", desc: "Monitor Supabase synchronization and health." },
    { icon: <HardDrive className="w-5 h-5" />, title: "Enterprise Storage", desc: "Configure assets, media, and document quotas." },
    { icon: <Key className="w-5 h-5" />, title: "API Integrations", desc: "Manage authentication tokens and external keys." },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control Center</h1>
        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">System Configuration & Enterprise Architecture</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="group bg-white border border-zinc-100 p-8 rounded-[2rem] hover:border-zinc-950 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-all">
                {section.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest">{section.title}</h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                  {section.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-full border border-white/10">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest">Core Configuration</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic leading-none">System Architecture Locked</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest max-w-lg leading-relaxed">
              Base configurations are managed via environment variables and Supabase policies. Fine-grained UI controls are currently under deployment.
            </p>
          </div>
          <Button variant="outline" className="h-12 border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-2xl">
            Request Protocol Change
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Settings className="w-96 h-96 -mr-20 -mt-20 rotate-12" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function FabricationPage() {
  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-10 pb-24 px-6 max-w-7xl mx-auto">
        {/* Hero Header */}
        <header className="mb-20 text-center md:text-left">
          <Badge className="bg-blue-600 text-white hover:bg-blue-600 border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-blue-200">
            Fabrication Protocol
          </Badge>
          <h1 className="text-6xl font-black font-headline text-on-surface tracking-tighter uppercase leading-none mb-6">Request Custom Quote</h1>
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest max-w-2xl leading-relaxed opacity-60">
            Precision-engineered manufacturing solutions for your next-generation electronics. Upload your manifestations and receive a detailed B2B proposal within 24 hours.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Canvas */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-border/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-[180px]">precision_manufacturing</span>
               </div>
              
              <form className="space-y-16 relative z-10">
                {/* Project Scope Section */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-border/10 pb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">architecture</span>
                    <h3 className="text-2xl font-black font-headline uppercase tracking-tight">Service Architecture</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Service Classification</label>
                      <Select>
                        <SelectTrigger className="h-14 bg-surface border-border/40 rounded-2xl px-6 font-black uppercase tracking-tight text-sm focus:ring-primary">
                          <SelectValue placeholder="Select Service" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/40 font-black uppercase tracking-tight text-xs">
                          <SelectItem value="pcb">PCB Fabrication & Assembly</SelectItem>
                          <SelectItem value="iot">IoT Device Development</SelectItem>
                          <SelectItem value="proto">Rapid Prototyping</SelectItem>
                          <SelectItem value="mech">Mechanical Enclosures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">Estimated Quantity Portfolio</label>
                      <Input 
                        className="h-14 bg-surface border-border/40 rounded-2xl px-6 font-black uppercase tracking-tight text-sm focus:ring-primary" 
                        placeholder="e.g. 500 units" 
                        type="number"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Files Section */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-border/10 pb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                    <h3 className="text-2xl font-black font-headline uppercase tracking-tight">Technical Assets</h3>
                  </div>
                  <div className="border-4 border-dashed border-border/40 rounded-[32px] p-16 text-center bg-surface hover:bg-white hover:border-primary/20 transition-all cursor-pointer group shadow-inner">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant opacity-40 mb-6 group-hover:scale-110 group-hover:text-primary group-hover:opacity-100 transition-all">cloud_upload</span>
                    <p className="text-on-surface font-black uppercase tracking-tight text-lg mb-2">Ingest Gerber Files or Specs</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Accepts .ZIP, .RAR, .PDF (MAX ARCHIVE: 50MB)</p>
                    <Button variant="outline" className="mt-10 h-12 px-10 bg-white border-2 border-border/60 hover:border-primary text-primary font-black text-xs rounded-xl shadow-lg transition-all" type="button">
                      Browse Local Repository
                    </Button>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-border/10 pb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">event_available</span>
                    <h3 className="text-2xl font-black font-headline uppercase tracking-tight">Project Horizon</h3>
                  </div>
                  <RadioGroup defaultValue="standard" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TimelineOption value="urgent" title="Urgent" duration="2-3 Weeks" icon="bolt" />
                    <TimelineOption value="standard" title="Standard" duration="4-6 Weeks" icon="schedule" />
                    <TimelineOption value="flexible" title="Flexible" duration="8+ Weeks" icon="update" />
                  </RadioGroup>
                </div>

                {/* Contact Details */}
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-border/10 pb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">corporate_fare</span>
                    <h3 className="text-2xl font-black font-headline uppercase tracking-tight">Corporate Identity</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormInput label="Full Name" placeholder="John Architect" />
                    <FormInput label="Corporate Email" placeholder="john.a@enterprise.com" type="email" />
                    <FormInput label="Company Entity" placeholder="Tech Industries Inc." />
                    <FormInput label="Direct Line" placeholder="+1 (555) 000-0000" type="tel" />
                  </div>
                </div>

                <div className="pt-10">
                  <Button className="w-full h-20 bg-primary text-white font-black text-xl rounded-3xl shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em]" type="submit">
                    <span className="material-symbols-outlined text-2xl">send</span>
                    Dispatch Quote Manifest
                  </Button>
                  <p className="text-center text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.25em] mt-8 opacity-40 leading-relaxed">
                    By submitting, you agree to our B2B Privacy Protocol and Technical Confidentiality Agreements.
                  </p>
                </div>
              </form>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-primary text-white rounded-[40px] p-10 space-y-10 border-b-8 border-blue-950 shadow-2xl shadow-primary/20 sticky top-28 overflow-hidden group">
               <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                 <span className="material-symbols-outlined text-[200px]">verified</span>
               </div>
              
              <h3 className="text-3xl font-black font-headline tracking-tighter uppercase relative z-10 leading-none">Engineering Authority</h3>
              <div className="space-y-10 relative z-10">
                <FeatureItem icon="verified" title="ISO 9001:2015 Cert" desc="Rigorous quality control processes and compliance with international standards." />
                <FeatureItem icon="bolt" title="24h Prototyping" desc="Turn your manifestations into physical samples with industry-leading speed." />
                <FeatureItem icon="public" title="Global Logistics" desc="Seamless logistics and shipping to over 150 nations worldwide." />
                <FeatureItem icon="support_agent" title="Tier-1 Support" desc="Direct access to senior engineers for Design for Manufacturing (DFM) advice." />
              </div>

              <div className="p-8 bg-white/10 rounded-3xl mt-12 backdrop-blur-sm border border-white/10">
                <h4 className="font-black text-sm uppercase tracking-tight mb-3">Live Enterprise Support?</h4>
                <p className="text-[10px] font-medium leading-loose opacity-60 mb-6 uppercase tracking-widest">Connect with our enterprise architecture team for large-scale contracts.</p>
                <Link className="text-blue-400 font-black text-xs flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest" href="/support">
                  Chat with an Architect <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function TimelineOption({ value, title, duration, icon }: any) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <Label
        htmlFor={value}
        className="flex flex-col items-center justify-center p-8 bg-surface rounded-3xl cursor-pointer border-2 border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-white peer-data-[state=checked]:shadow-xl transition-all group hover:bg-white"
      >
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
           <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
        </div>
        <p className="font-black text-xs uppercase tracking-widest text-on-surface">{title}</p>
        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-2 opacity-60">{duration}</p>
      </Label>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-blue-600 transition-all shadow-lg group-hover:shadow-blue-500/40">
        <span className="material-symbols-outlined text-2xl text-white">{icon}</span>
      </div>
      <div>
        <h4 className="font-black text-sm uppercase tracking-tight mb-2">{title}</h4>
        <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-widest">{desc}</p>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-4">
      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 px-1">{label}</label>
      <Input 
        className="h-14 bg-surface border-border/40 rounded-2xl px-6 font-black uppercase tracking-tight text-sm focus:ring-primary shadow-inner" 
        placeholder={placeholder} 
        type={type}
      />
    </div>
  );
}

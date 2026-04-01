import { Button } from "@/components/ui/button";
import Link from "next/link";
import ServiceCard from "./ServiceCard";
import { Badge } from "@/components/ui/badge";

export default function FabricationServices() {
    return (
        <section className="px-4 md:px-8 py-24 bg-white text-slate-900 overflow-hidden relative border-t border-slate-100">
            {/* Engineering Blueprint Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0V60H60V0ZM1 1H59V59H1V1Z' fill='%2364748b' fill-opacity='1'/%3E%3C/svg%3E")` }}
            />

            {/* Technical Radial Highlight */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-cyan-50 opacity-[0.4] blur-[100px] rounded-full translate-x-1/4 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-start">

                    {/* Text Content */}
                    <div className="lg:w-2/5 lg:sticky lg:top-32">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-3 w-3 bg-cyan-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(8,145,178,0.5)]" />
                            <span className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px]">
                                Local Fabrication Hub
                            </span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
                            Precision <br />
                            <span className="text-slate-300">Fabrication</span>
                        </h2>

                        <p className="text-slate-500 mb-12 text-lg leading-relaxed font-medium max-w-lg border-l-4 border-cyan-500 pl-6">
                            Accelerate your R&D cycle with localized manufacturing. Professional PCB fabrication and turnkey SMT assembly engineered for the Indian ecosystem.
                        </p>

                        <Link href="/fabrication">
                            <Button className="bg-slate-900 hover:bg-cyan-600 text-white px-12 h-16 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-4 shadow-2xl shadow-slate-200 group">
                                Get Technical Quote
                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </Button>
                        </Link>
                    </div>

                    {/* Services Grid */}
                    <div className="lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <ServiceCard
                            icon="layers"
                            title="PCB Prototyping"
                            desc="FR4, Aluminum, and Flexible PCBs. High-precision 4mil trace/space capabilities with standard 24hr turnaround."
                        />
                        <ServiceCard
                            icon="precision_manufacturing"
                            title="SMT Assembly"
                            desc="Fully automated pick-and-place lines. Specialized in 0201 components, BGA rework, and AOI testing."
                        />

                        {/* Feature Card: Custom IoT & R&D */}
                        <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-10 rounded-[2rem] flex flex-col md:flex-row gap-10 items-center group hover:bg-white hover:shadow-[30px_30px_80px_#e2e8f0] transition-all duration-700">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                                        <span className="material-symbols-outlined text-4xl font-light">
                                            memory
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 text-[9px] font-black tracking-[0.2em] px-4 py-1 uppercase">
                                        R&D Division
                                    </Badge>
                                </div>
                                <h3 className="text-3xl font-black mb-4 text-slate-900 uppercase tracking-tight italic">Custom IoT Solutions</h3>
                                <p className="text-slate-500 text-base leading-relaxed max-w-md">
                                    End-to-end hardware design. We transform Punjab's industrial legacy into smart connectivity for Agriculture and Logistics.
                                </p>
                            </div>

                            <div className="w-full md:w-1/3 flex flex-col gap-4">
                                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                    <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2">Live Factory Status</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse" />
                                        <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-tighter">Assembly Lines Active</span>
                                    </div>
                                </div>
                                <Button variant="link" className="text-slate-900 text-[10px] font-black uppercase tracking-widest justify-start p-0 h-auto group-hover:text-cyan-600 transition-colors">
                                    Explore Lab Projects &rarr;
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
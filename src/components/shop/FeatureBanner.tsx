import { Truck, Shield, Headphones, RotateCcw } from "lucide-react";

const features = [
    {
        icon: Truck,
        title: "Express Logistics",
        desc: "Ludhiana-wide & PAN India",
        accent: "text-slate-900"
    },
    {
        icon: Shield,
        title: "SSL-Verified",
        desc: "Enterprise Encryption",
        accent: "text-slate-900"
    },
    {
        icon: Headphones,
        title: "Engineer Support",
        desc: "Direct technical line",
        accent: "text-slate-900"
    },
    {
        icon: RotateCcw,
        title: "Compliance (RMA)",
        desc: "7-day audit window",
        accent: "text-slate-900"
    },
];

const FeatureBanner = () => (
    <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                {features.map((f) => (
                    <div key={f.title} className="flex items-center gap-6 group cursor-default">
                        {/* Icon Container - High Contrast & Sharp Radius */}
                        <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-[10px_10px_30px_#e2e8f0] group-hover:border-cyan-500/30 transition-all duration-500">
                            <f.icon className={`w-7 h-7 ${f.accent} group-hover:text-cyan-600 group-hover:scale-110 transition-all duration-500`} strokeWidth={1.25} />
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-900 leading-tight">
                                {f.title}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight group-hover:text-slate-600 transition-colors">
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeatureBanner;
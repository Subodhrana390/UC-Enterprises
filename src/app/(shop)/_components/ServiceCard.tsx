import Link from "next/link";

export default function ServiceCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="group relative bg-white border border-slate-100 p-10 rounded-[2rem] transition-all duration-500 hover:shadow-[30px_30px_80px_#e2e8f0] hover:-translate-y-1 flex flex-col h-full">

            {/* Top Industrial Accent (Visible on Hover) */}
            <div className="absolute top-0 left-10 w-0 h-[4px] bg-cyan-600 transition-all duration-500 group-hover:w-20 rounded-b-full" />

            {/* Icon - Minimalist Circular Container */}
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 group-hover:rotate-[-5deg]">
                <span className="material-symbols-outlined text-3xl font-light">
                    {icon}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-2xl font-black mb-4 text-slate-900 uppercase tracking-tight italic group-hover:text-cyan-700 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                    {desc}
                </p>
            </div>

            {/* Action Link - Bold Technical Style */}
            <Link
                href="/fabrication"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-all"
            >
                Technical Specs
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                </span>
            </Link>

            {/* Subtle Engineering Dot (Bottom Right) */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </div>
        </div>
    );
}
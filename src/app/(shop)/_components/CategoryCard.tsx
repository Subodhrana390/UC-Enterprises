import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({
    icon,
    title,
    count,
    slug,
}: {
    icon?: string | null;
    title: string;
    count: string;
    slug: string;
}) {
    return (
        <Link href={`/categories/${slug}`} className="group block">
            <div className="relative w-full h-[160px] p-6 rounded-2xl bg-white border border-slate-200 transition-all duration-500 hover:border-slate-900 hover:shadow-[20px_20px_60px_#d1d5db,-20px_-20px_60px_#ffffff] overflow-hidden">

                {/* Background Icon Effect - Subtle Neutral Tone */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 transition-all duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2 group-hover:scale-110 opacity-[0.03] group-hover:opacity-[0.08]">
                    {icon && (
                        <div className="relative w-full h-full">
                            <Image
                                src={icon}
                                alt={title}
                                fill
                                className="object-contain grayscale"
                            />
                        </div>
                    )}
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="space-y-3">
                        {/* Technical Accent Line */}
                        <div className="w-6 h-[3px] bg-slate-900 transition-all duration-500 group-hover:w-10 group-hover:bg-cyan-600" />

                        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-slate-900 transition-colors duration-300 line-clamp-2 uppercase">
                            {title}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold py-1 px-2 rounded bg-slate-50 text-slate-500 border border-slate-200 group-hover:text-cyan-600 group-hover:border-cyan-100 group-hover:bg-cyan-50 transition-all uppercase tracking-tighter">
                                {count} Items
                            </span>
                        </div>

                        {/* Minimalist Arrow */}
                        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                            <span className="material-symbols-outlined text-sm">
                                arrow_forward
                            </span>
                        </div>
                    </div>
                </div>

                {/* Clean Hover State Overlay */}
                <div className="absolute inset-0 bg-slate-900/[0.01] group-hover:bg-transparent transition-all duration-500" />
            </div>
        </Link>
    );
}
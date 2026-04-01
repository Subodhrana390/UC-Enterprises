import React from 'react';
import { Star, CheckCircle2, PenLine, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
    {
        id: 101,
        user: "TechGeek88",
        rating: 5,
        date: "Oct 12, 2025",
        title: "Perfect for high-power applications",
        comment: "Used these MOSFETs in a custom motor controller. Thermal dissipation is excellent and they handled the 40A peaks without breaking a sweat.",
        verified: true
    },
    {
        id: 102,
        user: "HardwareHacker",
        rating: 4,
        date: "Sept 28, 2025",
        title: "Solid, but check the datasheet",
        comment: "Great quality, but note that the pin pitch is slightly tighter than standard breadboard spacing. Great for PCBs though.",
        verified: true
    },
    {
        id: 103,
        user: "EmbeddedDev",
        rating: 5,
        date: "Nov 02, 2025",
        title: "Reliable Sourcing",
        comment: "Consistent performance across multiple batches. UC Enterprises remains our primary choice for specialized IoT components.",
        verified: true
    }
];

const ReviewSection = () => {
    return (
        <section className="bg-white py-6">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <p className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Quality Assurance</p>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Technical <span className="text-slate-300">Feedback</span>
                        </h3>
                    </div>

                </div>

                {/* Sliding Carousel Container */}
                <div className="relative group">
                    <div className="flex overflow-x-auto gap-8 pb-12 scrollbar-hide snap-x snap-mandatory hide-scrollbar">
                        {reviews.map((rev) => (
                            <div
                                key={rev.id}
                                className="min-w-[320px] md:min-w-[450px] snap-center bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-[20px_20px_60px_#e2e8f0] transition-all duration-500 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex text-cyan-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < rev.rating ? "currentColor" : "none"} strokeWidth={2} />
                                            ))}
                                        </div>
                                        {rev.verified && (
                                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                                <CheckCircle2 size={10} />
                                                Verified
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3 italic">{rev.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8">"{rev.comment}"</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{rev.user}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{rev.date}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                        <span className="material-symbols-outlined text-sm">construction</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
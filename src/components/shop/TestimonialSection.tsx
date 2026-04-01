import React from 'react';

const testimonials = [
    {
        id: 1,
        name: "Dr. Aris Thorne",
        role: "Senior Robotics Engineer",
        content: "The precision of the microcontrollers sourced here is unmatched. Finally, a supplier that understands the importance of low-latency components for industrial automation.",
        avatar: "https://i.pravatar.cc/150?u=aris",
        company: "Thorne Dynamics"
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Lead IoT Developer",
        content: "Fast shipping and the components were perfectly shielded. Zero DOA parts in my last three bulk orders. Highly recommended for production-scale deployments.",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        company: "Nexus Labs"
    }
];

const TestimonialSection = () => {
    return (
        <section className="bg-white py-6 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-6">
                    <p className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                        Industry Validation
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                        The Engineering <span className="text-slate-300">Standard</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-slate-50/50 border border-slate-100 p-10 md:p-12 rounded-[2.5rem] transition-all duration-500 hover:bg-white hover:shadow-[40px_40px_80px_-20px_rgba(203,213,225,0.5)] hover:border-slate-200"
                        >
                            {/* Verification Badge */}
                            <div className="absolute top-8 right-8 flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-[10px] text-emerald-500 font-bold">verified</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Verified Partner</span>
                            </div>

                            {/* Quote Icon */}
                            <span className="material-symbols-outlined text-4xl text-slate-200 mb-8 block group-hover:text-cyan-500 transition-colors duration-500">
                                format_quote
                            </span>

                            <p className="text-slate-600 font-medium text-lg leading-relaxed mb-10 relative z-10 italic">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-5 border-t border-slate-100 pt-8">
                                <div className="relative">
                                    <img
                                        src={item.avatar}
                                        alt={item.name}
                                        className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-slate-200"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-600 rounded-full border-2 border-white" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-slate-900 font-black uppercase tracking-tight text-base leading-none mb-1">
                                        {item.name}
                                    </h4>
                                    <div className="flex flex-col">
                                        <span className="text-cyan-600 text-[10px] font-black uppercase tracking-widest">{item.role}</span>
                                        <span className="text-slate-400 text-[9px] font-bold uppercase">{item.company}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
export default function BrandSection() {
    const brands = [
        "Arduino",
        "Raspberry Pi",
        "Texas Instruments",
        "STMicroelectronics",
        "Bosch",
        "Espressif",
        "Analog Devices"
    ];

    return (
        <section className="py-4 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center mb-16">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        Authorized Distribution
                    </p>
                    <div className="h-[2px] w-12 bg-cyan-500 rounded-full" />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-12 md:gap-x-24">
                    {brands.map((brand) => (
                        <div
                            key={brand}
                            className="group relative flex items-center justify-center cursor-pointer transition-all duration-500"
                        >
                            {/* Technical Label Effect */}
                            <div className="absolute -top-4 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-[8px] font-mono font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                                    VERIFIED
                                </span >
                            </div>

                            {/* Brand Text - Shifted to High Contrast Slate */}
                            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-300 group-hover:text-slate-900 transition-colors duration-300 uppercase">
                                {brand}
                            </span>

                            {/* Minimalist Industrial Underline */}
                            <div className="absolute -bottom-3 left-0 w-0 h-[3px] bg-slate-900 group-hover:w-full transition-all duration-500 ease-in-out" />
                        </div>
                    ))}
                </div>

                {/* Optional Trust Footer */}
                <p className="mt-16 text-center text-slate-400 text-[9px] font-medium tracking-widest uppercase">
                    Direct Global Sourcing &bull; Quality Guaranteed &bull; GST Ready
                </p>
            </div>
        </section>
    );
}
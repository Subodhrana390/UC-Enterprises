import { ProductCarousel } from "@/components/shop/ProductCarousel";
import type { ProductCarouselItem } from "@/components/shop/ProductCarousel";

export default function FeatureProductSection({ featuredProducts }: { featuredProducts: ProductCarouselItem[] }) {

    // Technical Empty State
    if (featuredProducts.length === 0) {
        return (
            <section className="py-6 bg-white" id="featured">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-slate-50 border border-slate-100 mb-6 group transition-all duration-500 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/5">
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-cyan-600 transition-colors">inventory_2</span>
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                        Synchronizing Technical Catalog...
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="px-4 md:px-8 py-20 md:py-28 bg-white relative overflow-hidden" id="featured">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(#000 1.2px, transparent 1.2px)`, backgroundSize: '40px 40px' }}
            />

            <div className="max-w-[1920px] mx-auto relative z-10">
                <div className="relative">
                    {/* Industrial Side Accent Bar */}
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1.5 h-40 bg-slate-900 rounded-full opacity-5 hidden xl:block" />

                    <ProductCarousel
                        title="Featured Components"
                        subtitle="Tier-1 industrial electronics and hardware validated for production-grade scale."
                        products={featuredProducts as ProductCarouselItem[]}
                        autoplay
                    />
                </div>
            </div>
        </section>
    )
}
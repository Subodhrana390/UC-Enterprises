import { ProductCarousel, ProductCarouselItem } from "@/components/shop/ProductCarousel";

export default function LatestProductSection({ latestProducts }: { latestProducts: ProductCarouselItem[] }) {

    if (latestProducts.length === 0) {
        return (
            <section className="py-20 bg-white" id="latest">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-ping" />
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                            Fetching Recent Manifest...
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="px-4 md:px-8 py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden" id="latest">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="max-w-[1920px] mx-auto relative z-10">
                <div className="relative">
                    <ProductCarousel
                        title="Latest Arrivals"
                        subtitle="Tier-1 components validated for immediate R&D integration."
                        products={latestProducts as ProductCarouselItem[]}
                        autoplay
                    />
                </div>
            </div>

        </section>
    )
}
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import type { ProductCarouselItem } from "@/components/shop/ProductCarousel";

export default function FeatureProductSection({ featuredProducts }: { featuredProducts: ProductCarouselItem[] }) {

    if (featuredProducts.length === 0) {
        return (
            <div className="max-w-[1920px] mx-auto" id="featured">
                <div className="flex justify-center items-center h-full">
                    <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-12">
                        No featured products found
                    </p>
                </div>
            </div>
        )
    }
    return (
        <section className="px-4 md:px-8 py-10" id="featured">
            <div className="max-w-[1920px] mx-auto">
                <ProductCarousel title="Featured Products" subtitle="Hand-picked products with top demand." products={featuredProducts as ProductCarouselItem[]} autoplay />
            </div>
        </section>
    )
}
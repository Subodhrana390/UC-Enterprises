import { ProductCarousel, ProductCarouselItem } from "@/components/shop/ProductCarousel";

export default function LatestProductSection({ latestProducts }: { latestProducts: ProductCarouselItem[] }) {
    if (latestProducts.length === 0) {
        return (
            <div className="max-w-[1920px] mx-auto" id="latest">
                <div className="flex justify-center items-center h-full">
                    <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-12">
                        No latest products found
                    </p>
                </div>
            </div>
        )
    }
    return (
        <section className="px-4 md:px-8 py-12 md:py-20 bg-surface" id="latest">
            <div className="max-w-[1920px] mx-auto">
                <ProductCarousel title="Latest Products" subtitle="New arrivals for your projects." products={latestProducts as ProductCarouselItem[]} autoplay />
            </div>
        </section>
    )
}

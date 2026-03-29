import Link from "next/link";
import CategoryCard from "./CategoryCard";

export default function ShopByCategory({ categories, skuCount }: { categories: any, skuCount: number }) {
    return (
        <section className="px-4 md:px-8 py-16 md:py-20 bg-[#f8f9fa]">
            <div className="max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#1a1c1d] font-headline tracking-tight mb-2">
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Over {skuCount.toLocaleString()} SKUs available in stock.
                        </p>
                    </div>
                    <Link
                        href="/categories"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1 group text-sm md:text-base"
                    >
                        View All Categories
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                            chevron_right
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {categories.map((cat: any) => (
                        <CategoryCard
                            key={cat.id}
                            icon={cat.icon}
                            title={cat.name}
                            count={`${cat.productCount}`}
                            slug={cat.slug}
                        />
                    ))}
                </div>
            </div>
        </section>)
}
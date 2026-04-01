import Link from "next/link";
import CategoryCard from "./CategoryCard";

export default function ShopByCategory({ categories, skuCount }: { categories: any, skuCount: number }) {
    return (
        <section className="px-4 md:px-8 py-6 md:py-10 bg-white overflow-hidden relative" id="catalog">

            {/* Structural Background Element */}
            <div className="absolute right-0 top-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-20 pointer-events-none" />

            <div className="max-w-[1920px] mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb0 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-1.5 bg-slate-900 rounded-full" />
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                                Shop by <span className="text-slate-300">Category</span>
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm md:text-lg font-bold uppercase tracking-tight">
                            Explore our wide range of <span className="text-cyan-700 font-black">{skuCount.toLocaleString()}</span> products.
                        </p>
                    </div>

                    <Link
                        href="/categories"
                        className="group flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-900 pb-1"
                    >
                        View All Categories
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform duration-500">
                            arrow_right_alt
                        </span>
                    </Link>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
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
        </section>
    );
}
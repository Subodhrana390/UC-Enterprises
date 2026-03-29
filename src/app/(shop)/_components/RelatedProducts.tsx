import { formatPriceINR } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({ relatedProducts }: { relatedProducts: any[] }) {
    return (
        <div className="mt-20 pt-16 border-t border-gray-100">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-2xl font-normal tracking-tight text-gray-900">
                        You may also like
                    </h2>
                    <div className="h-0.5 w-12 bg-black mt-2"></div>
                </div>
                <Link href="/shop" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors">
                    View all
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {relatedProducts.length > 0 ? relatedProducts.map((item: any) => (
                    <Link key={item.id} href={`/products/${item.id}`} className="group block cursor-pointer">
                        {/* Image Wrapper */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm mb-4">
                            <Image
                                src={item.images?.[0]}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Badge Logic */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {item.isNew && (
                                    <span className="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-gray-100 shadow-sm">
                                        New
                                    </span>
                                )}
                                {item.stock_quantity === 0 && (
                                    <span className="bg-gray-900 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        Sold Out
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-1.5">
                            {/* Brand Name */}
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                                {item.brands?.name || item.manufacturer}
                            </p>

                            {/* Product Name */}
                            <h3 className="text-sm font-normal text-gray-800 group-hover:text-black transition-colors truncate">
                                {item.name}
                            </h3>

                            <h3 className="text-sm font-normal text-gray-800 group-hover:text-black transition-colors truncate">
                                {item.description}
                            </h3>

                            {/* Mini Stars Rating */}
                            <div className="flex items-center gap-1">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[14px]"
                                            style={{ fontVariationSettings: i < Math.floor(item.average_rating) ? "'FILL' 1" : "'FILL' 0" }}>
                                            star
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[11px] text-gray-400">({item.review_count})</span>
                            </div>

                            {/* Price & Discount */}
                            <div className="flex items-center gap-2 pt-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {formatPriceINR(item.base_price ?? item.price ?? 0)}
                                </p>
                                {item.compare_at_price && (
                                    <p className="text-xs text-gray-400 line-through decoration-gray-300">
                                        {formatPriceINR(item.compare_at_price)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                )) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-400 text-sm">No related products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
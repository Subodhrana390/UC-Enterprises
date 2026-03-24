import { ProductCardSkeleton } from "@/components/shop/ProductCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12">
      <aside className="w-full lg:w-64 space-y-4">
        <div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-10 bg-gray-100 rounded animate-pulse" />
        ))}
      </aside>
      <div className="flex-grow">
        <div className="h-10 w-full bg-gray-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

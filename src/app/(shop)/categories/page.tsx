import Link from "next/link";
import Image from "next/image";
import { getShopCategories } from "@/lib/actions/products";

export default async function CategoriesPage() {
  const categories = await getShopCategories();

  return (
    <div className="bg-[#f4f7f9] min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

        {/* Breadcrumbs & Header */}
        <header className="mb-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-gray-900">All Categories</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1c1d]">
                Product Categories
              </h1>
              <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                Explore our wide range of industrial components. All products are 100% genuine and come with valid GST invoices.
              </p>
            </div>
            <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              <span className="text-blue-600">{categories.length}</span> Total Collections
            </div>
          </div>
        </header>

        {/* Category Grid - Indian Standard 4-Column Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat: any) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden border-b border-gray-50">
                <div className="relative w-full h-40">
                  <Image
                    src={cat.icon || "/placeholder-collection.png"}
                    alt={cat.name}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>

                {/* Genuine Product Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-green-700 border border-green-100">
                  GENUINE
                </div>
              </div>

              {/* Content Box */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm md:text-base font-bold text-[#1a1c1d] line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {cat.productCount || 0} Products
                  </span>

                  <span className="material-symbols-outlined text-blue-600 text-lg translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    arrow_right_alt
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Section - High Trust Factor for Indian Users */}
        <section className="mt-16 p-6 md:p-10 bg-blue-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold">Need Bulk Pricing for your Business?</h2>
            <p className="text-blue-100 text-sm mt-1">Get special discounted quotes for institutional and bulk orders.</p>
          </div>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
            Contact Sales Team
          </button>
        </section>
      </main>
    </div>
  );
}
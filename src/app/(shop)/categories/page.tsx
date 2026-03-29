import Link from "next/link";
import Image from "next/image";
import { getAllCategoriesTreeManual } from "@/lib/utils/categories";
import CategoryCard from "../_components/CategoryCard";

export default async function CategoriesPage() {

  const categoryData = await getAllCategoriesTreeManual();

  if (categoryData.length === 0) {
    return (
      <div className="bg-[#f4f7f9] min-h-screen text-[#1a1c1d]">
        <main className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Categories Found
          </h1>
          <p className="text-gray-600">
            Categories will appear here once they are added by the admin.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f9] min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

        {/* Header */}
        <header className="mb-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>

            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>

            <span className="text-gray-900">
              All Categories
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Product Categories
              </h1>

              <p className="text-sm text-gray-600 mt-2 max-w-2xl">
                Explore our wide range of industrial components.
                All products are 100% genuine and GST supported.
              </p>
            </div>

            <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border">
              <span className="text-blue-600">
                {categoryData.length}
              </span>{" "}
              Categories
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">

          {categoryData.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden"
            >
              <CategoryCard icon={cat.icon} title={cat.name} slug={cat.slug} count={cat.productCount} />
            </Link>
          ))}

        </div>
      </main>
    </div>
  );
}
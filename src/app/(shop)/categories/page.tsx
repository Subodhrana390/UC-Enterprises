import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/actions/products";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Shopify Standard Header */}
        <header className="mb-16">
          <nav className="flex items-center gap-2 text-xs font-medium text-[#616161] mb-6">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="text-[10px] opacity-50">/</span>
            <span className="text-black">Collections</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Collections
          </h1>
          <p className="text-sm md:text-base text-[#616161] max-w-xl leading-relaxed">
            Browse our curated selection of high-performance components and hardware for your next industrial project.
          </p>
        </header>

        {/* Collection Grid: 3 Columns for impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat: any) => (
            <Link 
              key={cat.id} 
              href={`/categories/${cat.slug}`}
              className="group block relative overflow-hidden"
            >
              <div className="relative aspect-[4/5] bg-[#f5f5f5] rounded-xl overflow-hidden mb-4 transition-all duration-700">
                <Image
                  src={cat.image_url || "/placeholder-collection.png"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Subtle Overlay for contrast */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Text Label: Placed below the image, not floating inside */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold group-hover:underline underline-offset-4 decoration-1">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#616161] mt-1">
                    Shop collection
                  </p>
                </div>
                
                {/* Shopify-style Arrow Icon */}
                <span className="material-symbols-outlined text-xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
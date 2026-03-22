import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategorySidebar } from "@/components/shop/CategorySidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories, getProductsByCategory } from "@/lib/actions/products";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(slug)
  ]);

  return (
    <div className="flex bg-surface">
      <CategorySidebar categories={categories} activeSlug={slug} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <div className="px-8 py-10 max-w-[1600px] mx-auto">
          {/* Breadcrumbs & Title */}
          <div className="mb-10">
            <nav className="flex text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mb-4 font-bold">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="mx-2 opacity-30">/</span>
              <Link className="hover:text-primary transition-colors" href="/categories">Categories</Link>
              <span className="mx-2 opacity-30">/</span>
              <span className="text-on-surface capitalize">{slug.replace(/-/g, ' ')}</span>
            </nav>
            <h1 className="text-4xl font-black tracking-tight text-on-surface font-headline mb-4 capitalize">
              {slug.replace(/-/g, ' ')}
            </h1>
            <p className="text-on-surface-variant text-base max-w-2xl leading-relaxed">
              High-performance components for precision engineering applications. Filter by technical architecture and operational requirements.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Advanced Filters Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-28 space-y-10">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-on-surface mb-6 pb-2 border-b border-border/40">
                    Advanced Filters
                  </h3>
                  <div className="space-y-8">
                    {/* Manufacturer Filter */}
                    <div>
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4 block">Manufacturer</label>
                      <div className="space-y-3">
                        {["STMicroelectronics", "Texas Instruments", "NXP", "Microchip"].map((brand) => (
                          <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox id={brand} className="rounded border-border data-[state=checked]:bg-primary" />
                            <label htmlFor={brand} className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface cursor-pointer select-none">
                              {brand}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full h-12 bg-white text-primary border border-border/60 hover:bg-surface-container font-bold text-xs uppercase tracking-widest shadow-sm">
                  Apply Configurations
                </Button>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Grid Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl border border-border/40 shadow-sm gap-4">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                  Showing <strong className="text-on-surface">{products.length}</strong> results for <span className="text-blue-600">{slug.replace(/-/g, ' ')}</span>
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sort by:</span>
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-[180px] h-10 border-none bg-surface-container-low font-bold text-xs">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="performance">Performance Bench</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((p: any) => (
                  <ProductCard 
                    key={p.id} 
                    id={p.id}
                    name={p.name}
                    description={p.description}
                    brand={p.brands}
                    price={p.base_price || p.price}
                    image={p.image_url}
                    images={p.images}
                    rating={p.rating}
                    sku={p.sku}
                    stock_quantity={p.stock_quantity}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-16 flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" className="w-10 h-10 border-border/40">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </Button>
                <Button className="w-10 h-10 bg-primary text-white font-bold text-xs">1</Button>
                <span className="px-2 text-border font-bold">...</span>
                <Button variant="outline" size="icon" className="w-10 h-10 border-border/40">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

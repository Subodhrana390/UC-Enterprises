import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getCategories, getFeaturedProducts } from "@/lib/actions/products";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts()
  ]);

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="px-4 md:px-8 py-12">
        <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden bg-primary shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent z-10"></div>
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJgvd0gY803KY5-EPENMvIVnuuew7rSB-botDPPtmg1K238ZEBbe-EEfd_s_V26CRdOKLN31gVQqXy3c0FdqCHVypMkcrOK2232OOL-SMX6U3KJjT18pE2nRSn8g97x6Mt6c0pV57dCoAh5f-rl51s5X4S_M2z0l_eGf2GqrurYHIRJGUxjT-583g9HtSLJGxusM37kLlYlCOGsvhhRcilj9iVuCcRbuwwESH-bgE3GoCGECtvQJTBvyw40xIVgexDti8D4NmyQtHO"
            alt="Hero Background"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16 max-w-4xl">
            <span className="text-blue-400 font-bold tracking-widest text-sm mb-4 uppercase">
              Next-Gen Distribution
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight font-headline tracking-tighter">
              Precision Components for High-Performance Engineering.
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl leading-relaxed">
              Global distributor of semiconductors and electronic components. Trusted by engineers for over 25 years. Same-day shipping on orders before 8 PM.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/search">
                <Button className="bg-gradient-to-r from-on-primary-container to-blue-700 text-white px-8 h-14 rounded-lg font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
                  Shop Now
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md text-white border-white/20 px-8 h-14 rounded-lg font-bold text-sm hover:bg-white/20 transition-all"
                >
                  Browse Components
                </Button>
              </Link>
              <Link href="/fabrication">
                <Button
                  variant="link"
                  className="text-white px-8 h-14 rounded-lg font-bold text-sm hover:underline flex items-center gap-2"
                >
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="px-4 md:px-8 py-20 bg-surface-container-low">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight mb-2">
                Shop by Category
              </h2>
              <p className="text-on-surface-variant">Over 500,000 SKUs available in stock.</p>
            </div>
            <Link
              href="/categories"
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 group"
            >
              View All Categories{" "}
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                chevron_right
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 5).map((cat: any) => (
              <CategoryCard 
                key={cat.id} 
                icon={cat.slug === 'microcontrollers' ? 'developer_board' : 'memory'} 
                title={cat.name} 
                count="Live Data" 
                slug={cat.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 md:px-8 py-20">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black text-on-surface font-headline tracking-tight">
              Featured Products
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <span className="material-symbols-outlined">chevron_left</span>
              </Button>
              <Button variant="outline" size="icon">
                <span className="material-symbols-outlined">chevron_right</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p: any) => (
              <ProductCard 
                key={p.id} 
                id={p.id}
                name={p.name}
                description={p.description}
                brand={p.brands}
                price={p.base_price}
                images={p.images}
                sku={p.sku}
                stock_quantity={p.stock_quantity}
                rating={p.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fabrication Services */}
      <section className="px-4 md:px-8 py-20 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 opacity-20 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="max-w-[1920px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4 block">
                End-to-End Solutions
              </span>
              <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tighter mb-8 leading-[1.1]">
                Precision Fabrication Services.
              </h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                Beyond components. We offer professional PCB fabrication, assembly, and custom IoT prototyping services for industry leaders.
              </p>
              <Link href="/fabrication">
                <Button className="bg-white text-primary px-10 h-14 rounded-lg font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
                  Request Custom Quote
                  <span className="material-symbols-outlined">request_quote</span>
                </Button>
              </Link>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <ServiceCard
                icon="layers"
                title="PCB Fabrication"
                desc="High-density interconnect (HDI) boards, multi-layer rigid and flexible PCBs with 24-hour rapid prototyping."
              />
              <ServiceCard
                icon="hub"
                title="IoT Prototyping"
                desc="Turn-key development for connected devices. From sensor selection to cloud integration and firmware optimization."
              />
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600/20 to-transparent border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-4xl text-blue-400 mb-6 font-thin">
                    precision_manufacturing
                  </span>
                  <h3 className="text-2xl font-bold mb-4">Custom Modules</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    OEM/ODM manufacturing of specialized electronic modules. Tailored to your specific industrial or automotive requirements.
                  </p>
                </div>
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmGJb5Dkli0vX3TyjDpDTJoi8sQuPIg0F3tyVeIxboknge-F4eZqHh1QMKLe-SBEDCn9WDv9mDwg9YPcuDi6-2hOgftSQ7D2ZDGgV1QzFrRn4853rT1delAZH-vQsfyKdygO2OWQYdN_86MUpp6RfwNJEky0Eoo3vkVNyiykJ6LK1fDgDWdWE5YWBHyZxzX8X5e6RqjcKh4sfNIJNSpb5ZeSw3E-JIfpFn5tNwXaM9jljbBr4jEfvs5HCn3tuo7rT3Gm9-iC_h7nhJ"
                  alt="Custom Modules"
                  width={256}
                  height={192}
                  className="w-full md:w-64 h-48 object-cover rounded-xl grayscale opacity-60 flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 border-b border-border/40">
        <div className="max-w-[1920px] mx-auto px-8">
          <p className="text-center text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-12">
            Authorized Distribution Partners
          </p>
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60 hover:opacity-100 transition-opacity">
            {["Arduino", "Raspberry Pi", "TI", "ST", "Bosch", "Espressif", "Analog Devices"].map((brand) => (
              <div key={brand} className="h-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
                <span className="text-2xl font-black font-headline tracking-tighter text-slate-900 dark:text-slate-100">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, title, count, slug }: { icon: string; title: string; count: string; slug: string }) {
  return (
    <Link href={`/categories/${slug}`} className="bg-white dark:bg-slate-900 p-8 rounded-xl hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800 group cursor-pointer">
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-on-surface-variant">{count}</p>
    </Link>
  );
}

function ServiceCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/10 transition-all group">
      <span className="material-symbols-outlined text-4xl text-blue-400 mb-6 font-thin">{icon}</span>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
      <Link href="/fabrication" className="text-white font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
        Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
      </Link>
    </div>
  );
}

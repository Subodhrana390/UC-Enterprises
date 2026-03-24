import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/components/shop/ProductCarousel";
import type { ProductCarouselItem } from "@/components/shop/ProductCarousel";
import { getShopCategories, getFeaturedProducts, getLatestProducts } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";

export default async function HomePage() {
  const [categories, featuredProducts, latestProducts] = await Promise.all([
    getShopCategories(),
    getFeaturedProducts(),
    getLatestProducts()
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
      <section className="px-4 md:px-8 py-16 md:py-20 bg-[#f8f9fa]">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#1a1c1d] font-headline tracking-tight mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Over 500,000 SKUs available in stock.
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
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                icon={cat.icon}
                title={cat.name}
                count={`${cat.productCount} Products`}
                slug={cat.slug}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 ? (
        <section className="px-4 md:px-8 py-10">
          <div className="max-w-[1920px] mx-auto">
            <ProductCarousel title="Featured Products" subtitle="Hand-picked products with top demand." products={featuredProducts as ProductCarouselItem[]} autoplay />
          </div>
        </section>) : (<div className="max-w-[1920px] mx-auto">
          <div className="flex justify-center items-center h-full">
            <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-12">
              No featured products found
            </p>
          </div>
        </div>
      )
      }

      {/* Latest Products */}
      {latestProducts.length > 0 ? (
        <section className="px-4 md:px-8 py-12 md:py-20 bg-surface">
          <div className="max-w-[1920px] mx-auto">
            <ProductCarousel title="Latest Arrivals" subtitle="Check out our newest additions" products={latestProducts as ProductCarouselItem[]} autoplay />
          </div>
        </section>
      ) : (<div className="max-w-[1920px] mx-auto">
        <div className="flex justify-center items-center h-full">
          <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-12">
            No latest products found
          </p>
        </div>
      </div>
      )}

      {/* Fabrication Services - Indian Industry Standard */}
      <section className="px-4 md:px-8 py-20 bg-[#0a0c10] text-white overflow-hidden relative">
        {/* Modern Decorative Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 opacity-10 blur-[120px] rounded-full translate-x-1/2"></div>

        <div className="max-w-[1920px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Text Content */}
            <div className="lg:w-1/3">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-[1px] bg-blue-500"></span>
                <span className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                  Solutions
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.1]">
                Industrial Grade <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Fabrication & R&D.
                </span>
              </h2>

              <p className="text-slate-400 mb-10 text-lg leading-relaxed font-medium">
                Accelerate your product cycle with our localized manufacturing. We provide professional PCB fabrication, SMT assembly, and complete turnkey IoT solutions for Indian enterprises.
              </p>


              <Link href="/fabrication">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20">
                  Get Free Quote
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Button>
              </Link>

            </div>

            {/* Services Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <ServiceCard
                icon="layers"
                title="PCB Fabrication"
                desc="From single-layer to 12-layer high-speed PCBs. Locally manufactured with 24-hour express shipping across India."
              />
              <ServiceCard
                icon="precision_manufacturing"
                title="Turnkey Assembly"
                desc="Full SMT/DIP assembly lines for bulk production. We manage sourcing, assembly, and testing under one roof."
              />

              {/* Highlight Card: Custom IoT & R&D */}
              <div className="md:col-span-2 bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center group hover:border-blue-500/30 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-4xl text-blue-500 font-thin group-hover:scale-110 transition-transform">
                      memory
                    </span>
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30 text-[10px]">NEW SERVICE</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Custom IoT & Prototyping</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    Indigenous hardware design for Smart Cities, Agri-tech, and Automotive. Dedicated R&D support for Indian startups and MSMEs.
                  </p>
                </div>

                {/* <div className="relative w-full md:w-72 h-44 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
                  <Image
                    src="/fabrication-preview.jpg"
                    alt="IoT Prototyping"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] to-transparent opacity-60"></div>
                </div> */}
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
    </div >
  );
}

function CategoryCard({ icon, title, count, slug }: { icon: string; image?: string | null; title: string; count: string; slug: string }) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="relative bg-white dark:bg-slate-900 h-40 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group overflow-hidden p-5 flex flex-col justify-between"
    >

      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors duration-500" />

      <div className="absolute right-2 bottom-2 text-gray-100 dark:text-slate-800 group-hover:text-blue-50 dark:group-hover:text-blue-900/20 transition-colors duration-500">
        <span className="material-symbols-outlined text-[100px] leading-none rotate-12 select-none pointer-events-none">
          <Image src={icon} alt={title} width={100} height={100} />
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="font-extrabold text-base md:text-lg text-[#1a1c1d] dark:text-white group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-1 w-4 bg-blue-600 rounded-full group-hover:w-8 transition-all duration-300" />
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {count}
          </p>
        </div>
      </div>
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

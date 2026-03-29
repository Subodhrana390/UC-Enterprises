import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getShopCategories, getFeaturedProducts, getLatestProducts } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import HeroBanner from "@/components/shop/HeroBanner";
import FeatureBanner from "@/components/shop/FeatureBanner";
import FeatureProductSection from "./_components/FeatureProductSection";
import LatestProductSection from "./_components/LatestProductSection";
import ShopByCategory from "./_components/ShopByCategory";

export default async function HomePage() {
  const supabase = await createClient();

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const [categories, featuredProducts, latestProducts] = await Promise.all([
    getShopCategories(),
    getFeaturedProducts(),
    getLatestProducts()
  ]);

  const skuCount = productCount || 0;

  return (
    <div className="flex-1">
      {/* Hero Banner */}
      <HeroBanner />

      <FeatureBanner />

      {/* Shop by Category */}
      <ShopByCategory categories={categories} skuCount={skuCount} />

      {/* Featured Products */}
      <FeatureProductSection featuredProducts={featuredProducts} />

      {/* Latest Products */}
      <LatestProductSection latestProducts={latestProducts} />

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

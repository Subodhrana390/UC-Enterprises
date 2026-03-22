import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/lib/actions/products";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const mainImage = product.product_images?.find((img: any) => img.is_main)?.image_url || product.image_url;
  const thumbnails = product.product_images?.map((img: any) => img.image_url) || [];

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-10 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb & Brand Hero */}
        <div className="mb-12">
          <nav className="flex text-on-surface-variant text-[10px] mb-6 gap-2 uppercase tracking-[0.2em] font-bold">
            <Link className="hover:text-primary transition-colors" href="/">Home</Link>
            <span className="opacity-30">/</span>
            <Link className="hover:text-primary transition-colors" href={`/categories/${product.categories?.slug}`}>
              {product.categories?.name}
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-primary opacity-60">Product Details</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight mb-4 font-headline uppercase">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider">
                <span className="text-on-surface-variant">SKU: <span className="text-on-surface font-black">{product.sku}</span></span>
                <span className="h-4 w-px bg-border/40 hidden sm:block"></span>
                <Link className="text-blue-600 hover:underline decoration-2 underline-offset-4" href="#">{product.manufacturer}</Link>
                <span className="h-4 w-px bg-border/40 hidden sm:block"></span>
                <div className="flex items-center text-on-surface">
                  <span className="material-symbols-outlined text-sm text-yellow-500 mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-black">{product.rating}</span>
                  <span className="text-on-surface-variant ml-1 font-medium italic">(124 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-border/40 shadow-sm self-start">
              <span className={`flex h-2.5 w-2.5 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-xs font-black text-on-surface uppercase tracking-widest leading-none">
                {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity.toLocaleString()} Units` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Product Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          {/* Gallery */}
          <div className="lg:col-span-7 grid grid-cols-4 gap-4 h-fit">
            <div className="col-span-4 row-span-2 bg-white rounded-2xl overflow-hidden group relative border border-border/40 shadow-sm aspect-[4/3]">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors"></div>
            </div>
            {thumbnails.slice(0, 3).map((thumb: string, i: number) => (
              <div key={i} className="col-span-1 bg-white rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all cursor-pointer aspect-square relative shadow-sm">
                <Image src={thumb} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
            {thumbnails.length > 3 && (
              <div className="col-span-1 bg-surface-container rounded-xl flex items-center justify-center border border-border/40 hover:bg-white transition-colors aspect-square text-[10px] font-black uppercase tracking-widest text-on-surface-variant cursor-pointer">
                +{thumbnails.length - 3} More
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Pricing Tiers */}
            <div className="bg-white rounded-2xl p-8 border border-border/40 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-8 flex items-center">
                <span className="material-symbols-outlined text-sm mr-2">layers</span> Bulk Pricing Tiers
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between items-center p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                  <span className="font-bold text-sm text-on-surface-variant tracking-tight">1 - 10 units</span>
                  <span className="text-xl font-black text-blue-700">
                    ${product?.price?.toFixed(2)} <span className="text-[10px] text-on-surface-variant font-medium uppercase">/ea</span>
                  </span>
                </div>
                {product.bulk_pricing?.map((tier: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl hover:bg-surface-container-low transition-all">
                    <span className="font-bold text-sm text-on-surface-variant tracking-tight">{tier.min_quantity}+ units</span>
                    <span className="text-xl font-black text-on-surface">
                      ${tier.unit_price.toFixed(2)} <span className="text-[10px] text-on-surface-variant font-medium uppercase">/ea</span>
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/fabrication">
                <Button variant="outline" className="w-full mt-8 h-14 rounded-xl border-dashed border-2 hover:border-primary hover:bg-white text-blue-700 font-black text-xs uppercase tracking-widest gap-2">
                  <span className="material-symbols-outlined text-lg">request_quote</span>
                  Request Custom Bulk Quote
                </Button>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 h-16">
                <div className="flex items-center bg-white rounded-xl px-4 border border-border/60 shadow-sm">
                  <button className="p-2 hover:text-primary transition-colors font-black">—</button>
                  <input className="w-12 text-center bg-transparent border-none focus:ring-0 font-black text-lg" type="number" defaultValue="1" />
                  <button className="p-2 hover:text-primary transition-colors font-black">+</button>
                </div>
                <Button className="flex-1 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/10 hover:opacity-90 transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Add to Engineering Cart
                </Button>
              </div>
            </div>

            {/* Datasheet Shortcut */}
            <div className="bg-primary p-6 rounded-2xl text-white flex justify-between items-center group cursor-pointer hover:bg-blue-900 transition-all duration-500 shadow-xl shadow-primary/10 border-b-4 border-blue-950">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-2">Technical Resource</p>
                <p className="text-xl font-black tracking-tight font-headline uppercase leading-tight">Full Datasheet (PDF)</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">download</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <section className="mb-24 bg-white rounded-3xl p-10 border border-border/40 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <h2 className="text-3xl font-black tracking-tight font-headline uppercase">Technical Specifications</h2>
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <Input className="w-full bg-surface rounded-xl pl-12 h-12 text-sm border-none focus:ring-2 focus:ring-primary/20" placeholder="Filter parameters..." />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
            {product.product_specifications?.map((spec: any, i: number) => (
              <div key={i} className="flex justify-between py-5 border-b border-border/20 last:md:border-b-0 group">
                <span className="text-on-surface-variant font-bold text-sm tracking-tight uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                  {spec.key}
                </span>
                <span className="font-black text-on-surface text-sm tracking-tight uppercase">
                  {spec.value}
                </span>
              </div>
            ))}
            {(!product.product_specifications || product.product_specifications.length === 0) && (
              <p className="text-on-surface-variant italic text-sm">No specialized specifications available for this component.</p>
            )}
          </div>
        </section>

        {/* Reviews Integration Preview */}
        <section className="bg-surface-container-low rounded-3xl p-10 border border-border/40">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <h2 className="text-3xl font-black tracking-tight font-headline uppercase mb-10">Verified Reviews</h2>
              <div className="space-y-10">
                <div className="pb-10 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex text-yellow-500">
                      {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface">Precision Grade Authentication</span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-medium">
                    Component performed exactly as specified in the datasheet. Packaging was secure and delivered within 48 hours.
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded text-[9px] font-black uppercase tracking-widest px-2 py-1">
                      Verified Engineer
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-80 h-fit bg-white rounded-2xl p-8 border border-border/40 shadow-sm">
              <h3 className="text-xl font-black uppercase mb-6 tracking-tight">Rating Summary</h3>
              <div className="flex items-end gap-3 mb-10">
                <span className="text-6xl font-black leading-none">{product.rating}</span>
                <div className="pb-1">
                  <div className="flex text-yellow-500 mb-1">
                    {[1, 2, 3, 4].map(s => <span key={s} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0.5" }}>star_half</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.15em]">Aggregate Data</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

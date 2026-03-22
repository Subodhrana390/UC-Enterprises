import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/lib/actions/products";
import { formatDateINR, formatPriceINR } from "@/lib/utils";
import { ProductAddToCartWithQuantity } from "@/components/shop/ProductAddToCartWithQuantity";
import { AddToWishlistButton } from "@/components/shop/AddToWishlistButton";
import { Button } from "@/components/ui/button";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const rawImages = product.product_images?.map((img: any) => img.image_url) || (Array.isArray(product.images) ? product.images : product.images ? Object.values(product.images) : []);
  const mainImage = product.product_images?.find((img: any) => img.is_main)?.image_url || product.image_url || rawImages?.[0] || "/placeholder-product.png";
  const thumbnails = rawImages || [];

  const productReviews = (product as { productReviews?: Array<{ id: string; rating: number; comment: string | null; created_at: string; profiles?: { full_name: string | null } | null }> }).productReviews ?? [];
  const reviewCount = productReviews.length;
  const avgRating =
    reviewCount > 0 ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount : Number(product.rating) || 0;
  const displayRating = reviewCount > 0 ? Math.round(avgRating * 10) / 10 : Number(product.rating) || 0;

  const bulkTiers = product.bulk_pricing || product.pricing_tiers || [];
  const specSource = product.product_specifications;
  const specsFromJson = product.specifications && typeof product.specifications === "object" && !Array.isArray(product.specifications)
    ? Object.entries(product.specifications as Record<string, string>).map(([key, value]) => ({ key, value: String(value) }))
    : [];
  const specificationRows = Array.isArray(specSource) && specSource.length > 0 ? specSource : specsFromJson;

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-10 pb-20 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Breadcrumb & Brand Hero */}
        <div className="mb-12">
          <nav className="flex flex-wrap items-center text-on-surface-variant text-[10px] mb-6 gap-2 uppercase tracking-[0.2em] font-bold min-w-0">
            <Link className="hover:text-primary transition-colors" href="/">Home</Link>
            <span className="opacity-30">/</span>
            <Link className="hover:text-primary transition-colors" href={`/categories/${product.categories?.slug}`}>
              {product.categories?.name}
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-primary opacity-60 truncate min-w-0 max-w-[min(100%,28rem)]" title={product.name}>
              {product.name}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight mb-4 font-headline uppercase">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider">
                <span className="text-on-surface-variant">SKU: <span className="text-on-surface font-black">{product.sku}</span></span>
                <span className="h-4 w-px bg-border/40 hidden sm:block"></span>
                <Link className="text-blue-600 hover:underline decoration-2 underline-offset-4" href="#">{product.brands?.name || product.manufacturer}</Link>
                <span className="h-4 w-px bg-border/40 hidden sm:block"></span>
                <div className="flex items-center text-on-surface">
                  <span className="material-symbols-outlined text-sm text-yellow-500 mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-black">{displayRating}</span>
                  <span className="text-on-surface-variant ml-1 font-medium italic">({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-border/40 shadow-sm self-start">
              <span className={`flex h-2.5 w-2.5 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-xs font-black text-on-surface uppercase tracking-widest leading-none">
                {product.stock_quantity > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>
          </div>
        </div>

        {product.description ? (
          <div className="mb-12 max-w-4xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant mb-3">Description</h2>
            <p className="text-on-surface leading-relaxed text-base md:text-lg">
              {product.description}
            </p>
          </div>
        ) : null}

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
                    {formatPriceINR(product?.base_price ?? product?.price ?? 0)} <span className="text-[10px] text-on-surface-variant font-medium uppercase">/ea</span>
                  </span>
                </div>
                {bulkTiers.map((tier: { min_quantity?: number; unit_price?: number }, i: number) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl hover:bg-surface-container-low transition-all">
                    <span className="font-bold text-sm text-on-surface-variant tracking-tight">{tier.min_quantity}+ units</span>
                    <span className="text-xl font-black text-on-surface">
                      {formatPriceINR(tier.unit_price ?? 0)} <span className="text-[10px] text-on-surface-variant font-medium uppercase">/ea</span>
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
              <div className="flex gap-4 items-center">
                <ProductAddToCartWithQuantity productId={product.id} maxStock={product.stock_quantity || 999} />
                <AddToWishlistButton productId={product.id} variant="outline" className="h-16 px-6 rounded-xl flex-shrink-0" />
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
            {specificationRows.length === 0 && (
              <p className="text-on-surface-variant italic text-sm">No specialized specifications available for this component.</p>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section className="bg-surface-container-low rounded-3xl p-10 border border-border/40">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-black tracking-tight font-headline uppercase mb-10">Reviews</h2>
              {productReviews.length === 0 ? (
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  No reviews yet. Purchase this product to share your experience.
                </p>
              ) : (
                <div className="space-y-10">
                  {productReviews.map((rev) => {
                    const author = rev.profiles?.full_name?.trim() || "Verified customer";
                    const stars = rev.rating ?? 0;
                    return (
                      <div key={rev.id} className="pb-10 border-b border-border/30 last:border-0 last:pb-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: i < stars ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-xs font-black text-on-surface">{author}</span>
                          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                            {formatDateINR(rev.created_at)}
                          </span>
                        </div>
                        {rev.comment ? (
                          <p className="text-on-surface-variant text-sm leading-relaxed font-medium whitespace-pre-wrap">
                            {rev.comment}
                          </p>
                        ) : (
                          <p className="text-on-surface-variant text-sm italic">No written comment.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="w-full md:w-80 h-fit bg-white rounded-2xl p-8 border border-border/40 shadow-sm shrink-0">
              <h3 className="text-xl font-black uppercase mb-6 tracking-tight">Rating summary</h3>
              <div className="flex items-end gap-3 mb-10">
                <span className="text-6xl font-black leading-none text-primary">{displayRating}</span>
                <div className="pb-1">
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-lg"
                        style={{
                          fontVariationSettings: i < Math.round(displayRating) ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.15em]">
                    Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
              <Link href="/account/reviews" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
                Write a review
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

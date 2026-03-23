import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById, getRelatedProducts } from "@/lib/actions/products";
import { formatDateINR, formatPriceINR } from "@/lib/utils";
import { ProductAddToCartWithQuantity } from "@/components/shop/ProductAddToCartWithQuantity";
import { AddToWishlistButton } from "@/components/shop/AddToWishlistButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }
  const relatedProducts = await getRelatedProducts(product.categories?.slug, id);

  console.log(relatedProducts);

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
            <Link className="hover:text-primary transition-colors" href={`/categories/${product.categories.slug}`}>
              {product.categories?.name}
            </Link>
            <span className="opacity-30">/</span>
            <span className="text-primary opacity-60 truncate min-w-0 max-w-[min(100%,28rem)]" title={product.name}>
              {product.name}
            </span>
          </nav>

        </div>

        {/* Product Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          {/* Gallery Section */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {thumbnails.slice(0, 4).map((thumb: string, i: number) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden bg-gray-50 cursor-pointer border hover:border-black transition-colors">
                  <Image src={thumb} alt={`View ${i + 1}`} fill className="object-cover" />
                  {i === 3 && thumbnails.length > 4 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium">
                      +{thumbnails.length - 3}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-6 flex flex-col">

            {/* 1. Brand & Title */}
            <div className="mb-2">
              <span className="text-xs font-medium tracking-widest text-gray-500 uppercase">
                {product.brands?.name || product.manufacturer}
              </span>
              <h1 className="text-3xl md:text-4xl font-normal text-gray-900 mt-2 mb-3 tracking-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-light text-gray-900">
                  {formatPriceINR(product.base_price ?? product.price ?? 0)}
                </span>

                <AddToWishlistButton
                  productId={product.id}
                  variant="outline"
                  className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`material-symbols-outlined text-base ${i < Math.floor(displayRating) ? 'text-black' : 'text-gray-200'}`}>
                      star
                    </span>
                  ))}
                  <span className="ml-2 text-gray-500 underline underline-offset-4 cursor-pointer">
                    {reviewCount} reviews
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${product.stock_quantity > 0 ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
              </div>
            )}

            {/* 4. Actions - Full Width Shopify Style */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Quantity
                </label>
                <ProductAddToCartWithQuantity
                  productId={product.id}
                  maxStock={product.stock_quantity || 999}
                />
              </div>

              {/* SKU & Shipping Meta */}
              <div className="pt-6 space-y-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">SKU:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                  <span>Free shipping on orders over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* Related Products Section */}
        <div className="mt-20 pt-16 border-t border-gray-100">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-normal tracking-tight text-gray-900">
                You may also like
              </h2>
              <div className="h-0.5 w-12 bg-black mt-2"></div>
            </div>
            <Link href="/shop" className="text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {relatedProducts.length > 0 ? relatedProducts.map((item: any) => (
              <Link key={item.id} href={`/products/${item.id}`} className="group block cursor-pointer">
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-sm mb-4">
                  <Image
                    src={item.images?.[0]}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Badge Logic */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isNew && (
                      <span className="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-gray-100 shadow-sm">
                        New
                      </span>
                    )}
                    {item.stock_quantity === 0 && (
                      <span className="bg-gray-900 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-1.5">
                  {/* Brand Name */}
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                    {item.brands?.name || item.manufacturer}
                  </p>

                  {/* Product Name */}
                  <h3 className="text-sm font-normal text-gray-800 group-hover:text-black transition-colors truncate">
                    {item.name}
                  </h3>

                  <h3 className="text-sm font-normal text-gray-800 group-hover:text-black transition-colors truncate">
                    {item.description}
                  </h3>

                  {/* Mini Stars Rating */}
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: i < Math.floor(item.average_rating) ? "'FILL' 1" : "'FILL' 0" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400">({item.review_count})</span>
                  </div>

                  {/* Price & Discount */}
                  <div className="flex items-center gap-2 pt-1">
                    <p className="text-sm font-medium text-gray-900">
                      {formatPriceINR(item.base_price ?? item.price ?? 0)}
                    </p>
                    {item.compare_at_price && (
                      <p className="text-xs text-gray-400 line-through decoration-gray-300">
                        {formatPriceINR(item.compare_at_price)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center border border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400 text-sm">No related products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

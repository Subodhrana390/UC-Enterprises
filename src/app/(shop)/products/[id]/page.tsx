
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getRelatedProducts } from "@/lib/actions/products";
import { formatDateINR, formatPriceINR } from "@/lib/utils";
import { ProductAddToCartWithQuantity } from "@/components/shop/ProductAddToCartWithQuantity";
import { AddToWishlistButton } from "@/components/shop/AddToWishlistButton";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { getProductQuestions } from "@/lib/actions/qa";
import { Button } from "@/components/ui/button";
import ProductTabs from "../../_components/ProductTabs";
import RelatedProducts from "../../_components/RelatedProducts";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const [relatedProducts, productQuestions] = await Promise.all([
    getRelatedProducts(product.categories?.slug, id),
    getProductQuestions(id)
  ]);

  const rawImages = product.product_images?.map((img: any) => img.image_url) || (Array.isArray(product.images) ? product.images : product.images ? Object.values(product.images) : []);
  const mainImage = product.product_images?.find((img: any) => img.is_main)?.image_url || product.image_url || rawImages?.[0] || "/placeholder-product.png";
  const allImages = rawImages.length > 0 ? rawImages : [mainImage];

  const productReviews = (product as { productReviews?: Array<{ id: string; rating: number; comment: string | null; created_at: string; profiles?: { full_name: string | null } | null }> }).productReviews ?? [];
  const reviewCount = productReviews.length;
  const avgRating =
    reviewCount > 0 ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount : Number(product.rating) || 0;
  const displayRating = reviewCount > 0 ? Math.round(avgRating * 10) / 10 : Number(product.rating) || 0;

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
          <div className="lg:col-span-6">
            <ProductImageGallery images={allImages} productName={product.name} />
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
                  {formatPriceINR(product.base_price ?? 0)}
                </span>

                <AddToWishlistButton
                  productId={product.id}
                  productName={product.name}
                  productPrice={product.base_price ?? 0}
                  productImage={mainImage}
                  stockQuantity={product.stock_quantity}
                  brandName={product.brands?.name || product.manufacturer}
                  description={product.description ?? undefined}
                  variant="outline"
                  className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 transition-colors"
                />
              </div>

              <div className="flex items-center text-sm">
                {[1, 2, 3, 4, 5].map((star) => {
                  let iconName = "star";
                  let fillValue = 0;
                  let colorClass = "text-yellow-200";

                  if (displayRating >= star) {
                    fillValue = 1;
                    colorClass = "text-yellow-500";
                  } else if (displayRating >= star - 0.5) {
                    iconName = "star_half";
                    fillValue = 1;
                    colorClass = "text-yellow-500";
                  }

                  return (
                    <span
                      key={star}
                      className={`material-symbols-outlined text-base ${colorClass}`}
                      style={{ fontVariationSettings: `'FILL' ${fillValue}` }}
                    >
                      {iconName}
                    </span>
                  );
                })}

                {reviewCount > 0 ? (
                  <span className="ml-2 text-gray-500 underline underline-offset-4 cursor-pointer hover:text-black transition-colors">
                    {reviewCount} reviews
                  </span>
                ) : (
                  <span className="ml-2 text-gray-500 underline underline-offset-4 cursor-pointer hover:text-black transition-colors">
                    No reviews yet
                  </span>
                )}
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
              {product.stock_quantity > 0 ? (
                <>
                  <div className="flex flex-col gap-4">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      Quantity
                    </label>

                    <ProductAddToCartWithQuantity
                      productId={product.id}
                      maxStock={product.stock_quantity || 999}
                      productName={product.name}
                      productPrice={product.base_price ?? product.price ?? 0}
                      productImage={mainImage}
                    />
                  </div>

                  {/* Request Quote Button */}
                  <Link href="/quote" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm font-semibold border-2 border-gray-300 hover:border-black hover:bg-gray-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg mr-2">request_quote</span>
                      Request Bulk Quote
                    </Button>
                  </Link>
                </>
              ) : (
                /* Out of Stock State */
                <div className="p-4 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    Currently Out of Stock
                  </p>
                </div>
              )}

              {/* SKU & Shipping Meta */}
              <div className="pt-6 space-y-3 border-t border-gray-100">
                {product.sku && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-900">SKU:</span>
                    <span className="tabular-nums">{product.sku}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="material-symbols-outlined text-sm text-blue-600">local_shipping</span>
                  <span>Free shipping on orders over <span className="font-medium text-gray-900">₹500</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductTabs
          specificationRows={specificationRows}
          productReviews={productReviews}
          productQuestions={productQuestions}
          displayRating={displayRating}
          reviewCount={reviewCount}
          product={product}
        />

        {/* Related Products Section */}
        <RelatedProducts relatedProducts={relatedProducts} />
      </main>
    </div>
  );
}

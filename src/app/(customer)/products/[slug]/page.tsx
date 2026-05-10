"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AddToCartButton from "@/components/storefront/AddToCartButton";
import WishlistToggleButton from "@/components/storefront/WishlistToggleButton";
import ProductReviews from "@/components/storefront/ProductReviews";
import QuoteRequestForm from "@/components/storefront/QuoteRequestForm";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = useMemo(() => createClient(), []);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .single();

      setProduct(data);
      setLoading(false);
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug, supabase]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.[0] || product.image_url || "/images/prod_main.png");
    }
  }, [product]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-sm font-semibold text-zinc-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-zinc-950">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-sm font-black uppercase tracking-widest text-primary">
          Return to products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Link href="/">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products">Products</Link>
          <ChevronRight className="h-3 w-3" />
          {product.categories?.slug ? <Link href={`/categories/${product.categories.slug}`}>{product.categories.name}</Link> : <span>Category</span>}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden border border-orange-100 bg-orange-50">
              <Image
                src={activeImage || "/images/prod_main.png"}
                alt={product.name}
                fill
                className="object-contain p-10 transition-all duration-300"
                unoptimized
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative aspect-square border-2 transition-all overflow-hidden ${
                      activeImage === img ? "border-primary" : "border-transparent hover:border-orange-200"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">{product.categories?.name || "UC Enterprises"}</p>
              <h1 className="text-4xl font-black tracking-tight text-zinc-950">{product.name}</h1>
              <p className="text-sm leading-6 text-zinc-600">Real-time product content from the connected backend catalog.</p>
            </div>

            <div className="space-y-2 border-y border-orange-100 py-5">
              <div className="text-3xl font-black text-zinc-950">{formatCurrency(product.price)}</div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                {product.stock_quantity > 0 ? "In stock and ready for dispatch" : "Currently unavailable"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Quantity</span>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 border border-zinc-200 px-3 py-2 text-sm font-bold"
              />
            </div>

            <div
              className="prose prose-sm max-w-none text-zinc-700"
              dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available yet.</p>" }}
            />

            <div className="flex flex-wrap gap-3">
              <AddToCartButton
                product={product}
                quantity={quantity}
                className="h-12 rounded-none bg-zinc-950 px-6 text-xs font-black uppercase tracking-widest text-white hover:bg-primary"
              />
                <Button 
                  variant="outline" 
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="h-12 rounded-none border-orange-200 px-6 text-xs font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Get Best Quote
                </Button>
              <WishlistToggleButton productId={product.id} className="h-12 rounded-none border-orange-200 px-6 text-xs font-black uppercase tracking-widest" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-orange-100 bg-orange-50 p-4 text-sm text-zinc-700">
                <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                GST-ready invoicing supported for business orders.
              </div>
              <div className="border border-orange-100 bg-white p-4 text-sm text-zinc-700">
                <Truck className="mb-2 h-5 w-5 text-primary" />
                PAN India shipping support from the UC Enterprises team.
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="border border-zinc-200 bg-white p-6 lg:col-span-1">
            <h2 className="text-lg font-black text-zinc-950">Specification</h2>
            <div className="mt-4 prose prose-sm max-w-none text-zinc-700" dangerouslySetInnerHTML={{ __html: product.specification || "<p>Specification details will be updated soon.</p>" }} />
          </div>
          <div className="border border-zinc-200 bg-white p-6 lg:col-span-1">
            <h2 className="text-lg font-black text-zinc-950">Manufacturing</h2>
            <div className="mt-4 prose prose-sm max-w-none text-zinc-700" dangerouslySetInnerHTML={{ __html: product.manufacturing_info || "<p>Manufacturing details will be updated soon.</p>" }} />
          </div>
          <div className="border border-zinc-200 bg-white p-6 lg:col-span-1">
            <h2 className="text-lg font-black text-zinc-950">Warranty</h2>
            <div className="mt-4 prose prose-sm max-w-none text-zinc-700" dangerouslySetInnerHTML={{ __html: product.warranty_info || "<p>Warranty details will be updated soon.</p>" }} />
          </div>
        </section>

        {/* Similar Products */}
        <SimilarProducts categoryId={product.category_id} currentProductId={product.id} />

        <ProductReviews productId={product.id} />
      </div>

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isEnquiryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsEnquiryModalOpen(false)}
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl border border-white/20 overflow-hidden"
            >
              <button 
                onClick={() => setIsEnquiryModalOpen(false)}
                className="absolute right-6 top-6 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                <QuoteRequestForm product={{ id: product.id, name: product.name }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimilarProducts({ categoryId, currentProductId }: { categoryId: string; currentProductId: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSimilar() {
      if (!categoryId) return;
      const { data } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("category_id", categoryId)
        .neq("id", currentProductId)
        .eq("status", "Active")
        .limit(4);

      if (data) setProducts(data);
    }
    fetchSimilar();
  }, [categoryId, currentProductId, supabase]);

  if (products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-orange-100 pt-12">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Related Products</p>
        <h2 className="text-3xl font-black tracking-tight text-zinc-950">You might also like</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="group flex flex-col border border-orange-100 bg-white p-4 transition hover:shadow-xl hover:shadow-orange-200/50"
          >
            <div className="relative aspect-square overflow-hidden bg-orange-50 mb-4">
              <Image
                src={item.image_url || "/images/prod_main.png"}
                alt={item.name}
                fill
                className="object-contain p-6 transition group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                {item.categories?.name}
              </p>
              <h3 className="font-bold text-zinc-950 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <p className="mt-auto text-lg font-black text-zinc-950">
                {formatCurrency(item.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { formatPriceINR } from "@/lib/utils";
import { addToCart as addLocalCart, removeFromWishlist as removeLocalWishlist, toggleWishlist as toggleLocalWishlist, useShopHydration, useShopStore } from "@/lib/store/shop-store";
import { addToCart as addToCartAction } from "@/lib/actions/cart";
import { removeFromWishlist as removeFromWishlistAction, removeFromWishlistByProductId as removeByProductAction } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WishlistPage() {
  useShopHydration();
  const router = useRouter();
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const wishlistItems = useShopStore((s) => Object.values(s.wishlist));

  const filteredItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return wishlistItems;
    return wishlistItems.filter((item) =>
      [item.name, item.brandName, item.description].filter(Boolean).join(" ").toLowerCase().includes(needle),
    );
  }, [query, wishlistItems]);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-500 text-sm">View and manage the items you have saved for later.</p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold text-black">{filteredItems.length}</span> items in your list
        </div>

        <div className="relative w-full md:w-80">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-11 bg-gray-50 border-gray-200 rounded-lg pl-10 text-sm focus:bg-white transition-all"
            placeholder="Search your wishlist..."
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.productId} className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/products/${item.productId}`} className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={item.image || "/placeholder-product.png"}
                  alt={item.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1.5 ${item.stockQuantity && item.stockQuantity > 0 ? "bg-white text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.stockQuantity && item.stockQuantity > 0 ? "bg-green-500" : "bg-gray-400"}`}></span>
                    {item.stockQuantity && item.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      const { data: { user } } = await supabase.auth.getUser();
                      if (!user) return;

                      await removeByProductAction(item.productId);
                      removeLocalWishlist(item.productId);
                      router.refresh();
                      toast.success("Removed from wishlist");
                    }}
                    className="text-red-500/70 hover:text-red-600 transition-all"
                    aria-label="Remove from wishlist"
                  >
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                  </button>
                </div>
              </Link>

              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-auto">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">{item.brandName || "Generic"}</p>
                  <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatPriceINR(item.price ?? 0)}</p>
                    <p className="text-[10px] text-gray-400">Incl. all taxes</p>
                  </div>

                  <Button
                    type="button"
                    className="bg-primary text-white h-11 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest"
                    onClick={async () => {
                      const { data: { user } } = await supabase.auth.getUser();

                      if (!user) {
                        toast.error("Please login to add items to cart");
                        router.push("/login?redirect=/wishlist");
                        return;
                      }

                      // 1. Server Side Updates
                      await addToCartAction(item.productId, 1);
                      await removeFromWishlistAction(item.productId);

                      // 2. Local State Updates (Optimistic UI)
                      addLocalCart(
                        {
                          productId: item.productId,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          stockQuantity: item.stockQuantity,
                        },
                        1,
                      );
                      removeLocalWishlist(item.productId);

                      // 3. Sync & Feedback
                      router.refresh();
                      toast.success("Moved to cart");
                    }}
                    disabled={Boolean(item.stockQuantity !== undefined && item.stockQuantity <= 0)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-300 text-4xl">favorite</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm mb-6">Looks like you have not added anything yet.</p>
            <Button className="bg-black text-white rounded-full px-8">
              <Link href="/search">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
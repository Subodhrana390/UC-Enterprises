"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateCartQuantity, removeFromCart, clearCart } from "@/lib/actions/cart";
import { addToWishlist } from "@/lib/actions/wishlist";
import {
  updateCartQuantity as updateLocalQty,
  removeFromCart as removeLocal,
  toggleWishlist as toggleLocal,
  addToWishlist as addLocalWishlist,
  addToCart as addLocalCart,
  clearCart as clearLocal
} from "@/lib/store/shop-store";
import { formatPriceINR } from "@/lib/utils";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartClientProps {
  userId: string;
  initialItems: any[];
  subtotal: number;
  belowMinimum: boolean;
  minimumRequired: number;
}

export function CartClient({
  userId,
  initialItems,
  subtotal,
  belowMinimum,
  minimumRequired
}: CartClientProps) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleQuantityChange = async (itemId: string, productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(itemId, productId);
      return;
    }

    setLoadingId(itemId);
    startTransition(async () => {
      const result = await updateCartQuantity(itemId, newQuantity);
      setLoadingId(null);

      if (result.error) {
        toast.error(result.error);
      } else {
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
        );
        // Sync with local store for badge updates
        updateLocalQty(productId, newQuantity);
        toast.success("Quantity updated");
      }
    });
  };

  const handleRemove = async (itemId: string, productId: string) => {
    setLoadingId(itemId);
    startTransition(async () => {
      const result = await removeFromCart(itemId);
      setLoadingId(null);

      if (result.error) {
        toast.error(result.error);
      } else {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        removeLocal(productId);
        toast.success("Item removed from cart");
      }
    });
  };

  const handleSaveForLater = async (itemId: string, productId: string) => {
    setLoadingId(itemId);
    startTransition(async () => {
      // 1. Add to wishlist
      const addResult = await addToWishlist(productId);
      if (addResult.error) {
        setLoadingId(null);
        toast.error(addResult.error);
        return;
      }

      // 2. Remove from cart
      const removeResult = await removeFromCart(itemId);
      setLoadingId(null);

      if (removeResult.error) {
        toast.error(removeResult.error);
      } else {
        const item = items.find((i) => i.id === itemId);
        setItems((prev) => prev.filter((i) => i.id !== itemId));
        if (item) {
          removeLocal(productId);
          addLocalWishlist({
            productId: item.product_id,
            name: item.products.name,
            price: item.products.base_price,
            image: item.products.images?.[0] || "",
          });
        }
        toast.success("Item saved for later");
        router.refresh();
      }
    });
  };


  const handleClearCart = async () => {
    startTransition(async () => {
      const result = await clearCart(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setItems([]);
        clearLocal();
        toast.success("Cart cleared");
      }
    });
  };

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCheckout = () => {
    setIsRedirecting(true);
    router.push("/checkout");
  };

  const isAnyLoading = isPending || isRedirecting || !!loadingId;

  const currentSubtotal = items.reduce(
    (acc, item) => acc + (item.products?.base_price || 0) * item.quantity,
    0
  );

  const gst = currentSubtotal * 0.18;
  const total = currentSubtotal + gst;
  const isBelowMinimum = currentSubtotal < minimumRequired;

  if (items.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-[#d2d2d2] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-[#616161]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1c1d] mb-2">Your cart is empty</h2>
        <p className="text-[#616161] mb-8 max-w-xs mx-auto">
          Look like you haven't added anything to your cart yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1c1d] text-white font-bold rounded-xl hover:bg-[#303030] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
        >
          Start Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#f1f1f1] flex justify-between items-center bg-[#fafafa]/50">
              <h2 className="font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Cart Items ({items.length})
              </h2>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  disabled={isAnyLoading}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear Cart
                </Button>
              )}
            </div>

            <div className="divide-y divide-[#f1f1f1]">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="p-4 md:p-6 flex gap-4 md:gap-6 items-center relative group">
                    <div className="w-24 h-24 bg-[#f5f5f5] rounded-xl overflow-hidden shrink-0 border border-[#ebebeb] relative">
                      {item.products?.images?.[0] ? (
                        <img
                          src={item.products.images[0]}
                          alt={item.products.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#ababab]">
                          <ShoppingBag className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                      {loadingId === item.id && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-black" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1a1c1d] truncate text-base mb-1 group-hover:text-blue-600 transition-colors">
                        <Link href={`/products/${item.product_id}`}>{item.products?.name}</Link>
                      </h3>
                      <p className="text-sm font-bold text-black mb-3">{formatPriceINR(item.products?.base_price || 0)}</p>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center bg-[#f8f9fa] rounded-lg border border-[#ebebeb] overflow-hidden p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white"
                            onClick={() => handleQuantityChange(item.id, item.product_id, item.quantity - 1)}
                            disabled={isAnyLoading}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white"
                            onClick={() => handleQuantityChange(item.id, item.product_id, item.quantity + 1)}
                            disabled={isAnyLoading || item.quantity >= (item.products?.stock_quantity || 999)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleSaveForLater(item.id, item.product_id)}
                            disabled={isAnyLoading}
                            className="text-[#616161] hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                          >
                            <Heart className="w-3.5 h-3.5" />
                            Save
                          </button>
                          <div className="w-px h-3 bg-[#ebebeb]" />
                          <button
                            onClick={() => handleRemove(item.id, item.product_id)}
                            disabled={isAnyLoading}
                            className="text-[#919191] hover:text-rose-600 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden md:block">
                      <p className="text-lg font-black text-[#1a1c1d]">
                        {formatPriceINR((item.products?.base_price || 0) * item.quantity)}
                      </p>
                      <p className="text-[10px] text-[#008060] font-bold uppercase tracking-wider mt-1">In Stock</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-white rounded-xl">
                  <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-[#ababab]" />
                  </div>
                  <p className="text-[#1a1c1d] font-bold mb-1 text-lg">Your cart is empty</p>
                  <p className="text-[#616161] text-sm mb-6 max-w-[280px] mx-auto">
                    Look like you haven't added anything to your cart yet. Start browsing our collection.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors group"
                  >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white border border-[#ebebeb] rounded-xl p-6 sticky top-28 shadow-sm">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#616161] font-medium">Subtotal</span>
                <span className="font-bold">{formatPriceINR(currentSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#616161] font-medium">GST (18%)</span>
                <span className="font-bold">{formatPriceINR(gst)}</span>
              </div>
              <div className="flex justify-between items-center text-[#008060]">
                <span className="font-medium">Shipping</span>
                <span className="font-black uppercase text-[10px]">Free</span>
              </div>
            </div>

            <div className="border-t border-[#f1f1f1] my-6 pt-6">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-lg font-bold text-[#1a1c1d]">Total</span>
                <span className="text-2xl font-black text-[#1a1c1d]">{formatPriceINR(total)}</span>
              </div>
              <p className="text-[10px] text-[#919191] text-right font-medium">Incl. all taxes</p>
            </div>

            {isBelowMinimum && items.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6">
                <p className="text-xs font-bold text-amber-900 mb-1">Minimum Order Not Met</p>
                <p className="text-[11px] text-amber-800">
                  Minimum order is <strong>{formatPriceINR(minimumRequired)}</strong>.
                  Add <strong>{formatPriceINR(minimumRequired - currentSubtotal)}</strong> more.
                </p>
              </div>
            )}

            <Button
              className="w-full bg-[#1a1c1d] hover:bg-black text-white h-14 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              onClick={handleCheckout}
              disabled={isBelowMinimum || isAnyLoading || items.length === 0}
            >
              {isAnyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Proceed to Checkout"}
              {!isAnyLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>

            <Link href="/" className="block text-center text-sm text-[#616161] mt-6 hover:text-black font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

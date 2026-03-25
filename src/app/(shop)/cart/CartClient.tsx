"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateCartQuantity, removeFromCart, clearCart } from "@/lib/actions/cart";
import { formatPriceINR } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartClientProps {
  userId: string;
  initialItems: any[];
  subtotal: number;
  belowMinimum: boolean;
  minimumRequired: number;
}

export function CartClient({ userId, initialItems, subtotal, belowMinimum, minimumRequired }: CartClientProps) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setLoading(itemId);
    const result = await updateCartQuantity(itemId, newQuantity);
    setLoading(null);

    if (result.error) {
      alert(result.error);
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleRemove = async (itemId: string) => {
    setLoading(itemId);
    const result = await removeFromCart(itemId);
    setLoading(null);

    if (result.error) {
      alert(result.error);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const handleClearCart = async () => {
    setLoading("clear");
    const result = await clearCart(userId);
    setLoading(null);

    if (result.error) {
      alert(result.error);
    } else {
      setItems([]);
    }
  };

  const currentSubtotal = items.reduce(
    (acc, item) => acc + (item.products?.base_price || 0) * item.quantity,
    0
  );

  const gst = currentSubtotal * 0.18;
  const total = currentSubtotal + gst;

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 text-[#ababab] mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-[#616161] mb-6">Add some products to get started</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1c1d] text-white font-medium rounded-lg hover:bg-[#303030] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8">
        <div className="bg-white border border-[#ebebeb] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#f1f1f1] flex justify-between items-center">
            <h2 className="font-semibold">Cart Items</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              disabled={loading === "clear"}
              className="text-rose-600 hover:text-rose-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Cart
            </Button>
          </div>

          <div className="divide-y divide-[#f1f1f1]">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4 items-center">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-lg overflow-hidden shrink-0">
                  {item.products?.images?.[0] ? (
                    <img
                      src={item.products.images[0]}
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#ababab]">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#1a1c1d] truncate">{item.products?.name}</h3>
                  <p className="text-sm text-[#616161]">{formatPriceINR(item.products?.base_price || 0)}</p>
                  {item.products?.stock_quantity < 10 && (
                    <p className="text-xs text-amber-600 mt-1">Only {item.products.stock_quantity} left</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={loading === item.id || item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={loading === item.id || item.quantity >= (item.products?.stock_quantity || 99)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold">
                    {formatPriceINR((item.products?.base_price || 0) * item.quantity)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.id)}
                    disabled={loading === item.id}
                    className="text-rose-600 hover:text-rose-700 h-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-white border border-[#ebebeb] rounded-xl p-6 sticky top-28">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#616161]">Subtotal</span>
              <span>{formatPriceINR(currentSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#616161]">GST (18%)</span>
              <span>{formatPriceINR(gst)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#616161]">Shipping</span>
              <span className="text-[#008060]">Free</span>
            </div>
          </div>

          <div className="border-t border-[#f1f1f1] my-4 pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPriceINR(total)}</span>
            </div>
          </div>

          {belowMinimum && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-sm text-amber-800">
                Minimum order amount is {formatPriceINR(minimumRequired)}. 
                Add {formatPriceINR(minimumRequired - currentSubtotal)} more.
              </p>
            </div>
          )}

          <Button
            className="w-full bg-[#008060] hover:bg-[#006e52] text-white h-11"
            onClick={() => router.push("/checkout")}
            disabled={belowMinimum}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <Link
            href="/"
            className="block text-center text-sm text-[#008060] mt-4 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
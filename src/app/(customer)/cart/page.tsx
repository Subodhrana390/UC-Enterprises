"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCartItems, getCartTotal, removeCartItem, updateCartItemQuantity, type CartItem } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getCartItems());
    sync();
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]">
      <section className="container mx-auto px-4 py-14">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Cart</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Your shopping cart</h1>
          <p className="text-sm text-zinc-600">Review product quantity, update items, or continue to quote and order discussion.</p>
        </div>

        {!items.length ? (
          <div className="border border-dashed border-orange-200 bg-white p-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-4 text-sm font-semibold text-zinc-600">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block text-sm font-black uppercase tracking-widest text-primary">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 border border-orange-100 bg-white p-5 shadow-sm md:flex-row md:items-center">
                  <div className="relative h-28 w-28 shrink-0 bg-orange-50">
                    <Image src={item.image_url || "/images/prod_main.png"} alt={item.name} fill className="object-contain p-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Link href={`/products/${item.slug}`} className="text-lg font-bold text-zinc-950 hover:text-primary">
                      {item.name}
                    </Link>
                    <p className="text-sm font-semibold text-zinc-600">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="rounded border border-zinc-200 p-2" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center font-bold">{item.quantity}</span>
                    <button className="rounded border border-zinc-200 p-2" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-bold text-red-600" onClick={() => removeCartItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="h-fit border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-zinc-950">Order Summary</h2>
              <div className="mt-4 flex items-center justify-between border-b border-zinc-100 pb-4 text-sm font-semibold text-zinc-600">
                <span>Total items</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-lg font-black text-zinc-950">
                <span>Total</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              <div className="mt-6 space-y-3">
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-zinc-950 hover:bg-primary">Proceed to Checkout</Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

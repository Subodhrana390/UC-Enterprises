"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  replaceWithServerState,
  useShopHydration,
  useShopStore,
  type CartItem,
  type WishlistItem,
} from "@/lib/store/shop-store";

type CartRow = {
  quantity: number;
  product_id: string;
  products: {
    name: string;
    base_price: number;
    stock_quantity: number | null;
    images: string[] | null;
  } | null;
};

type WishlistRow = {
  product_id: string;
  products: {
    name: string;
    base_price: number;
    stock_quantity: number | null;
    images: string[] | null;
    description: string | null;
    brands: { name: string } | null;
  } | null;
};

export function ShopSyncBridge({ userId }: { userId: string }) {
  useShopHydration();
  const hydrated = useShopStore((s) => s.hydrated);
  const cart = useShopStore((s) => s.cart);
  const wishlist = useShopStore((s) => s.wishlist);
  const [bootstrapped, setBootstrapped] = useState(false);
  const skipNextPush = useRef(true);

  const signature = useMemo(() => JSON.stringify({ cart, wishlist }), [cart, wishlist]);

  useEffect(() => {
    if (!hydrated || bootstrapped) return;
    const supabase = createClient();

    (async () => {
      const [cartRes, wishlistRes] = await Promise.all([
        supabase
          .from("cart_items")
          .select("quantity, product_id, products(name, base_price, stock_quantity, images)")
          .eq("user_id", userId),
        supabase
          .from("wishlist_items")
          .select("product_id, products(name, base_price, stock_quantity, images, description, brands(name))")
          .eq("user_id", userId),
      ]);

      // FIX 1: Cast through unknown to resolve the "overlap" error
      const cartData = (cartRes.data as unknown) as CartRow[];
      const nextCart: Record<string, CartItem> = {};

      for (const row of (cartData ?? [])) {
        if (!row.products) continue;
        nextCart[row.product_id] = {
          productId: row.product_id,
          name: row.products.name,
          price: Number(row.products.base_price ?? 0),
          image: row.products.images?.[0] ?? "/placeholder-product.png",
          quantity: Number(row.quantity ?? 1),
          stockQuantity: row.products.stock_quantity ?? undefined,
        };
      }

      // FIX 2: Cast through unknown for Wishlist as well
      const wishlistData = (wishlistRes.data as unknown) as WishlistRow[];
      const nextWishlist: Record<string, WishlistItem> = {};

      for (const row of (wishlistData ?? [])) {
        if (!row.products) continue;
        nextWishlist[row.product_id] = {
          productId: row.product_id,
          name: row.products.name,
          price: Number(row.products.base_price ?? 0),
          image: row.products.images?.[0] ?? "/placeholder-product.png",
          stockQuantity: row.products.stock_quantity ?? undefined,
          brandName: row.products.brands?.name ?? undefined,
          description: row.products.description ?? undefined,
        };
      }

      replaceWithServerState({ cart: nextCart, wishlist: nextWishlist });
      skipNextPush.current = true;
      setBootstrapped(true);
    })();
  }, [bootstrapped, hydrated, userId]);

  useEffect(() => {
    if (!hydrated || !bootstrapped) return;
    // Pushing logic removed to follow Login-Only server-action model.
    // The local store is now an optimistic mirror updated by UI components.
    // router.refresh() in components ensures server-side sync.
  }, [bootstrapped, hydrated, userId]);

  return null;
}
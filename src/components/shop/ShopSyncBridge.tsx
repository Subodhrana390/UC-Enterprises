"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  mergeServerState,
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

      mergeServerState({ cart: nextCart, wishlist: nextWishlist });
      skipNextPush.current = true;
      setBootstrapped(true);
    })();
  }, [bootstrapped, hydrated, userId]);

  useEffect(() => {
    if (!hydrated || !bootstrapped) return;
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }

    const supabase = createClient();
    const timer = window.setTimeout(async () => {
      const cartIds = Object.keys(cart);
      const wishlistIds = Object.keys(wishlist);

      const [serverCartRes, serverWishlistRes] = await Promise.all([
        supabase.from("cart_items").select("id, product_id").eq("user_id", userId),
        supabase.from("wishlist_items").select("id, product_id").eq("user_id", userId),
      ]);

      const serverCart = new Map((serverCartRes.data ?? []).map((r) => [r.product_id as string, r.id as string]));
      const serverWishlist = new Map((serverWishlistRes.data ?? []).map((r) => [r.product_id as string, r.id as string]));

      // Pushing changes to Supabase
      for (const [productId, item] of Object.entries(cart)) {
        const existingId = serverCart.get(productId);
        if (existingId) {
          await supabase.from("cart_items").update({ quantity: item.quantity }).eq("id", existingId).eq("user_id", userId);
        } else {
          await supabase.from("cart_items").insert({ user_id: userId, product_id: productId, quantity: item.quantity });
        }
      }

      // Deleting items from Supabase that were removed locally
      for (const [productId, rowId] of serverCart.entries()) {
        if (!cartIds.includes(productId)) {
          await supabase.from("cart_items").delete().eq("id", rowId).eq("user_id", userId);
        }
      }

      // Sync Wishlist
      for (const productId of wishlistIds) {
        if (!serverWishlist.has(productId)) {
          await supabase.from("wishlist_items").insert({ user_id: userId, product_id: productId });
        }
      }
      for (const [productId, rowId] of serverWishlist.entries()) {
        if (!wishlistIds.includes(productId)) {
          await supabase.from("wishlist_items").delete().eq("id", rowId).eq("user_id", userId);
        }
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [bootstrapped, cart, hydrated, signature, userId, wishlist]);

  return null;
}
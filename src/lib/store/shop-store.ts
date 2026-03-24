"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "uc_shop_state_v1";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stockQuantity?: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  stockQuantity?: number;
  brandName?: string;
  description?: string;
}

interface ShopState {
  cart: Record<string, CartItem>;
  wishlist: Record<string, WishlistItem>;
  hydrated: boolean;
}

type CartPayload = Omit<CartItem, "quantity">;
type WishlistPayload = WishlistItem;
type Listener = () => void;

let state: ShopState = { cart: {}, wishlist: {}, hydrated: false };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(updater: (prev: ShopState) => ShopState) {
  state = updater(state);
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
    }
  } catch {
    // Ignore write failures (private mode/quota), app still works in-memory.
  }
  emit();
}

function hydrate() {
  if (state.hydrated || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ShopState>;
      state = {
        cart: parsed.cart && typeof parsed.cart === "object" ? parsed.cart : {},
        wishlist: parsed.wishlist && typeof parsed.wishlist === "object" ? parsed.wishlist : {},
        hydrated: true,
      };
    } else {
      state = { ...state, hydrated: true };
    }
  } catch {
    state = { ...state, hydrated: true };
  }
  emit();
}

export function useShopHydration() {
  useEffect(() => {
    hydrate();
  }, []);
}

export function addToCart(item: CartPayload, quantity = 1) {
  const safeQty = Math.max(1, quantity);
  setState((prev) => {
    const existing = prev.cart[item.productId];
    const max = item.stockQuantity && item.stockQuantity > 0 ? item.stockQuantity : 9999;
    const nextQty = Math.min(max, (existing?.quantity ?? 0) + safeQty);
    return {
      ...prev,
      cart: {
        ...prev.cart,
        [item.productId]: {
          ...item,
          quantity: nextQty,
        },
      },
    };
  });
}

export function updateCartQuantity(productId: string, quantity: number) {
  setState((prev) => {
    const current = prev.cart[productId];
    if (!current) return prev;
    if (quantity <= 0) {
      const rest = { ...prev.cart };
      delete rest[productId];
      return { ...prev, cart: rest };
    }
    const max = current.stockQuantity && current.stockQuantity > 0 ? current.stockQuantity : 9999;
    return {
      ...prev,
      cart: {
        ...prev.cart,
        [productId]: {
          ...current,
          quantity: Math.min(max, Math.max(1, quantity)),
        },
      },
    };
  });
}

export function removeFromCart(productId: string) {
  setState((prev) => {
    if (!prev.cart[productId]) return prev;
    const rest = { ...prev.cart };
    delete rest[productId];
    return { ...prev, cart: rest };
  });
}

export function toggleWishlist(productId: string, payload?: WishlistPayload) {
  setState((prev) => {
    if (prev.wishlist[productId]) {
      const rest = { ...prev.wishlist };
      delete rest[productId];
      return { ...prev, wishlist: rest };
    }
    const nextItem: WishlistItem = payload ?? {
      productId,
      name: "Product",
      price: 0,
      image: "/placeholder-product.png",
    };
    return { ...prev, wishlist: { ...prev.wishlist, [productId]: nextItem } };
  });
}

export function addToWishlist(item: WishlistPayload) {
  setState((prev) => ({
    ...prev,
    wishlist: {
      ...prev.wishlist,
      [item.productId]: item,
    },
  }));
}

export function removeFromWishlist(productId: string) {
  setState((prev) => {
    if (!prev.wishlist[productId]) return prev;
    const rest = { ...prev.wishlist };
    delete rest[productId];
    return { ...prev, wishlist: rest };
  });
}

export function mergeServerState(input: {
  cart?: Record<string, CartItem>;
  wishlist?: Record<string, WishlistItem>;
}) {
  setState((prev) => {
    const nextCart = { ...(input.cart ?? {}), ...prev.cart };
    const nextWishlist = { ...(input.wishlist ?? {}), ...prev.wishlist };
    return { ...prev, cart: nextCart, wishlist: nextWishlist };
  });
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return state;
}

export function useShopStore<T>(selector: (snapshot: ShopState) => T): T {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return selector(snapshot);
}

export function getCartItems() {
  return Object.values(state.cart);
}

export function getCartCount() {
  return Object.values(state.cart).reduce((sum, item) => sum + item.quantity, 0);
}

export function getWishlistCount() {
  return Object.keys(state.wishlist).length;
}

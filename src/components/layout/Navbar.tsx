"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/lib/actions/auth";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useShopHydration, useShopStore } from "@/lib/store/shop-store";
import { getParentCategories } from "@/lib/utils/categories";

interface NavbarProps {
  categories?: Array<{ id: string; name: string; slug: string; icon?: string | null; parent_id?: string | null }>;
  user?: { id: string } | null;
  userRole?: string | null;
  cartCount?: number;
  wishlistCount?: number;
}

export function Navbar({ categories = [], user, userRole = null, cartCount = 0, wishlistCount = 0 }: NavbarProps) {
  const isAdmin = userRole === "admin";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/logo.jpg");
  useShopHydration();
  const liveCartCount = useShopStore((s) => Object.values(s.cart).reduce((sum, item) => sum + item.quantity, 0));
  const liveWishlistCount = useShopStore((s) => Object.keys(s.wishlist).length);
  const displayCartCount = useMemo(() => Math.max(cartCount, liveCartCount), [cartCount, liveCartCount]);
  const displayWishlistCount = useMemo(() => Math.max(wishlistCount, liveWishlistCount), [wishlistCount, liveWishlistCount]);

  // Get only parent categories for the menu, or all if none are parents
  const parentCategories = useMemo(() => {
    const parents = getParentCategories(categories);
    return parents.length > 0 ? parents : categories;
  }, [categories]);

  const isImageValue = (value?: string | null) =>
    !!value && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/"));

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-border/40 h-16 md:h-20 transition-all">
        <div className="flex items-center justify-between px-4 md:px-8 h-full w-full max-w-[1920px] mx-auto gap-4">

          {/* Logo Section */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link
              href="/"
              className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter font-headline flex items-center gap-2"
            >
              <Image
                src={logoSrc}
                alt="UC Enterprises logo"
                width={160}
                height={48}
                className="h-8 md:h-10 w-auto object-contain"
                onError={() => setLogoSrc("/logo.jpg")}
                priority
              />
              <span className="sr-only">UC Enterprises</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 font-headline tracking-tight text-sm font-medium">
              <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-widest">
                Home
              </Link>
              
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-widest">
                  Categories
                  <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform">keyboard_arrow_down</span>
                </button>

                {/* Mega Menu - Only Main Categories */}
                <div className="absolute top-full left-[-100px] pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                  <div className="bg-white dark:bg-slate-900 border border-border/40 rounded-2xl shadow-2xl p-6 min-w-[600px] max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                      {parentCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group/item border border-transparent hover:border-blue-100"
                        >
                          <div className="relative w-10 h-10 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all overflow-hidden">
                            {isImageValue(cat.icon) ? (
                              <Image
                                src={cat.icon || "/default-avatar.png"}
                                alt={cat.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-xl">{cat.icon || "inventory_2"}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[11px] uppercase tracking-tight text-slate-900 dark:text-slate-100">{cat.name}</p>
                            <p className="text-[9px] text-gray-500 uppercase font-medium">Browse Stock</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/search" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all font-black uppercase text-[10px] tracking-widest">
                All Products
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-2xl hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q");
                if (q) window.location.href = `/search?q=${encodeURIComponent(q.toString())}`;
              }}
              className="relative group"
            >
              <Input
                name="q"
                className="w-full bg-gray-100 dark:bg-slate-900 border-none rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-blue-600 text-sm transition-all h-10"
                placeholder="Search by SKU or Part Name..."
                type="text"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
            </form>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-1 md:gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            <Link href="/wishlist" className="block">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <span className="material-symbols-outlined text-slate-600">favorite</span>
                {displayWishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center bg-rose-500 text-[9px] p-0 border-none">{displayWishlistCount}</Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <span className="material-symbols-outlined text-slate-600">shopping_cart</span>
                {displayCartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center bg-blue-600 text-[9px] p-0 border-none">{displayCartCount}</Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-1 md:gap-3 ml-2 pl-2 border-l border-border/40">
                <Link href={isAdmin ? "/admin" : "/account"}>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <span className="material-symbols-outlined text-slate-600">
                      {isAdmin ? "admin_panel_settings" : "account_circle"}
                    </span>
                  </Button>
                </Link>
                <form action={logout} className="hidden sm:block">
                  <Button type="submit" variant="ghost" size="icon" className="rounded-full text-rose-500">
                    <span className="material-symbols-outlined">logout</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button className="h-9 px-5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 w-full bg-white p-4 border-b md:hidden animate-in slide-in-from-top duration-200">
            <form action="/search" className="relative">
              <Input name="q" autoFocus placeholder="Search components..." className="w-full pr-10" />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation (Indian App Standard) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-950 border-t border-border/40 h-16 flex items-center justify-around z-50 lg:hidden">
        <Link href="/" className="flex flex-col items-center gap-1 text-slate-600">
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="/categories" className="flex flex-col items-center gap-1 text-slate-600">
          <span className="material-symbols-outlined text-xl">grid_view</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Categories</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center gap-1 text-slate-600">
          <span className="material-symbols-outlined text-xl">inventory_2</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">All Products</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-1 text-slate-600">
          <span className="material-symbols-outlined text-xl">person</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Account</span>
        </Link>
      </nav>

      <div className="h-16 md:h-20" />
    </>
  );
}
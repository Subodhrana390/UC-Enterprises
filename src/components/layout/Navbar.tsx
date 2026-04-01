"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/lib/actions/auth";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useShopStore } from "@/lib/store/shop-store";
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
  const hydrated = useShopStore((s) => s.hydrated);
  const liveCartCount = useShopStore((s) => Object.values(s.cart).reduce((sum, item) => sum + item.quantity, 0));
  const liveWishlistCount = useShopStore((s) => Object.keys(s.wishlist).length);
  const displayCartCount = hydrated ? liveCartCount : cartCount;
  const displayWishlistCount = hydrated ? liveWishlistCount : wishlistCount;

  const parentCategories = useMemo(() => {
    const parents = getParentCategories(categories);
    return parents.length > 0 ? parents : categories;
  }, [categories]);

  const isImageValue = (value?: string | null) =>
    !!value && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/"));

  return (
    <>
      {/* Desktop & Tablet Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-900 h-16 md:h-20">
        <div className="flex items-center justify-between px-4 md:px-8 h-full w-full max-w-[1920px] mx-auto gap-4">

          {/* Logo Section */}
          <div className="flex items-center gap-6 lg:gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-8 md:h-10 w-auto aspect-square bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-800">
                <Image
                  src={logoSrc}
                  alt="UC Enterprises logo"
                  width={40}
                  height={40}
                  className="object-contain p-1"
                  onError={() => setLogoSrc("/logo.jpg")}
                  priority
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">UC Enterprises</span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-8">
              <Link href="/" className="nav-link text-slate-500 hover:text-cyan-500 transition-colors font-black uppercase text-[10px] tracking-widest">
                Home
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-500 transition-colors font-black uppercase text-[10px] tracking-widest">
                  Categories
                  <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform">expand_more</span>
                </button>

                {/* Mega Menu */}
                <div className="absolute top-full -left-20 pt-5 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-[700px] grid grid-cols-3 gap-4">
                    {parentCategories.slice(0, 9).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 shrink-0 overflow-hidden relative">
                          {isImageValue(cat.icon) ? (
                            <Image src={cat.icon!} alt={cat.name} fill className="object-cover" />
                          ) : (
                            <span className="material-symbols-outlined">{cat.icon || "inventory_2"}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[10px] uppercase tracking-tight text-slate-900 dark:text-slate-100">{cat.name}</span>
                          <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">View Parts</span>
                        </div>
                      </Link>
                    ))}
                    <Link href="/categories" className="col-span-3 text-center py-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:underline">
                      See All Categories
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/search" className="text-slate-500 hover:text-cyan-500 transition-colors font-black uppercase text-[10px] tracking-widest">
                All Products
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden lg:block">
            <form onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              if (q) window.location.href = `/search?q=${encodeURIComponent(q.toString())}`;
            }} className="relative">
              <Input
                name="q"
                className="w-full bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl py-2 px-4 pl-12 focus:ring-1 focus:ring-cyan-500 text-sm h-11"
                placeholder="Search SKU, Part # or Specs..."
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </form>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden p-2 text-slate-600 dark:text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </button>

            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl gap-1">
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="rounded-lg relative h-9 w-9">
                  <span className="material-symbols-outlined text-slate-500 text-xl">favorite</span>
                  {displayWishlistCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 bg-rose-500 text-[9px] border-none">{displayWishlistCount}</Badge>
                  )}
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="rounded-lg relative h-9 w-9">
                  <span className="material-symbols-outlined text-slate-500 text-xl">shopping_cart</span>
                  {displayCartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 min-w-4 bg-cyan-600 text-[9px] border-none">{displayCartCount}</Badge>
                  )}
                </Button>
              </Link>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link href={isAdmin ? "/admin" : "/account"}>
                  <Button variant="ghost" size="icon" className="rounded-xl bg-slate-100 dark:bg-slate-900 h-10 w-10 border border-slate-200 dark:border-slate-800">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                      {isAdmin ? "admin_panel_settings" : "person"}
                    </span>
                  </Button>
                </Link>
                <form action={logout} className="hidden md:block">
                  <Button type="submit" variant="ghost" size="icon" className="rounded-xl text-rose-500 hover:bg-rose-500/10">
                    <span className="material-symbols-outlined">logout</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button className="h-10 px-6 rounded-xl bg-cyan-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20">
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 lg:hidden animate-in slide-in-from-top">
            <form action="/search" className="relative">
              <Input name="q" autoFocus placeholder="Search SKU or Part Name..." className="w-full pr-12 bg-slate-100 dark:bg-slate-900 border-none h-12 rounded-xl" />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500">
                <span className="material-symbols-outlined">search</span>
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-900 h-16 flex items-center justify-around z-50 lg:hidden">
        {[
          { href: "/", icon: "home", label: "Home" },
          { href: "/categories", icon: "grid_view", label: "Categories" },
          { href: "/search", icon: "inventory_2", label: "Inventory" },
          { href: "/account", icon: "person", label: "Profile" }
        ].map((item) => (
          <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 text-slate-500 hover:text-cyan-500 transition-colors">
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/lib/actions/auth";
import Image from "next/image";

interface NavbarProps {
  categories?: any[];
  user?: any;
  /** When set, only one dashboard icon is shown: admin vs customer account */
  userRole?: string | null;
  cartCount?: number;
  wishlistCount?: number;
}

export function Navbar({ categories = [], user, userRole = null, cartCount = 0, wishlistCount = 0 }: NavbarProps) {
  const isAdmin = userRole === "admin";
  const isImageValue = (value?: string | null) =>
    !!value && (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/"));
  return (
    <header className="fixed top-0 w-full z-50 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm border-b border-border/40 h-20">
      <div className="flex items-center justify-between px-4 md:px-8 h-full w-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tighter font-headline"
          >
            UCEnterprises
          </Link>
          <nav className="hidden lg:flex items-center gap-6 font-headline tracking-tight text-sm font-medium">
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-all font-black uppercase text-[11px] tracking-widest">
                Category Catalog
                <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform">keyboard_arrow_down</span>
              </button>
              
              <div className="absolute top-full left-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                <div className="bg-white/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-6 min-w-[560px] grid grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/search?category=${cat.slug}`}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all group/item"
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-surface overflow-hidden border border-border/40 flex items-center justify-center text-on-surface-variant group-hover/item:bg-primary group-hover/item:text-white transition-all">
                        {isImageValue(cat.icon) ? (
                          <Image src={cat.icon} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-xl">{cat.icon || "inventory_2"}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-[11px] uppercase tracking-widest">{cat.name}</p>
                        <p className="text-[9px] text-on-surface-variant opacity-60 uppercase font-bold tracking-tighter">View Components</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/search" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-all font-black uppercase text-[11px] tracking-widest">
              Stock Manifest
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end max-w-4xl">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get("q");
              if (q) window.location.href = `/search?q=${encodeURIComponent(q.toString())}`;
            }}
            className="relative w-full max-w-md hidden md:block"
          >
            <Input
              name="q"
              className="w-full bg-surface-container-highest border-none rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-on-primary-container text-sm transition-all h-10"
              placeholder="Search 500,000+ components..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
          </form>
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                notifications
              </span>
            </Button>
            
            <Link href="/account/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                title="Wishlist"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                  favorite
                </span>
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 min-w-0 p-0 flex items-center justify-center bg-rose-500 hover:bg-rose-500 text-white border-none text-[10px] font-bold">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                title="Cart"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                  shopping_cart
                </span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 min-w-0 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-600 text-white border-none text-[10px] font-bold">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-border/40">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-primary hover:bg-primary/10"
                      title="Admin dashboard"
                    >
                      <span className="material-symbols-outlined">admin_panel_settings</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href="/account">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      title="My account"
                    >
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                        account_circle
                      </span>
                    </Button>
                  </Link>
                )}
                <form action={logout}>
                  <Button 
                    type="submit"
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full text-rose-500 hover:bg-rose-50"
                    title="Terminate Session"
                  >
                    <span className="material-symbols-outlined">logout</span>
                  </Button>
                </form>
              </div>
            ) : (
                <Link href="/login">
                    <Button className="h-10 px-6 rounded-lg bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl">
                        Initialize Session
                    </Button>
                </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

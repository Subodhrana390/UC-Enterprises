"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  Heart, 
  Mail, 
  MapPin, 
  Phone, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X 
} from "lucide-react";
import { 
  supportPhone, 
  supportPhoneHref, 
  supportEmailHref, 
  primaryNavLinks, 
  storeDepartments 
} from "@/lib/storefront";
import CartButton from "@/components/storefront/CartButton";
import HeaderSearch from "@/components/storefront/HeaderSearch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  categories: { id: string; name: string; slug: string }[];
  user: any;
}

export default function Header({ categories, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="border-b border-orange-100 bg-[linear-gradient(90deg,#fff2dc_0%,#ffffff_100%)] text-zinc-700 overflow-hidden">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <a href={supportPhoneHref} className="inline-flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
              {supportPhone}
            </a>
            <a href={supportEmailHref} className="hidden xs:inline-flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
              Sales Support
            </a>
          </div>
          <div className="hidden md:inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Zirakpur, Punjab | PAN India Dispatch
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4 sm:gap-8">
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden -ml-2 text-zinc-700 hover:bg-orange-50"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2 sm:gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center p-1 transition group-hover:border-primary group-hover:scale-105">
                <img src="/logo.jpg" alt="UC Enterprises" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 leading-none">UC <span className="text-primary">ENTERPRISES</span></span>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Quality Industrial Supplies</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-xl">
              <HeaderSearch />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-4">
              {/* Mobile Search Toggle (Optional - could add a separate search icon for mobile if needed) */}
              
              <Link href={user ? "/account/profile" : "/login"} className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                <span>{user ? "My Account" : "Login"}</span>
              </Link>
              
              <Link href="/account/wishlist" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-primary transition-colors">
                <Heart className="h-4 w-4" />
                <span>Wishlist</span>
              </Link>

              {/* Mobile Profile Icon (only icon on very small screens) */}
              <Link href={user ? "/account/profile" : "/login"} className="sm:hidden p-2 text-zinc-700 hover:text-primary">
                <User className="h-5 w-5" />
              </Link>

              <div className="flex items-center">
                <CartButton />
              </div>

              <Link href="/bulk-inquiry" className="hidden xs:inline-flex items-center gap-2 rounded-full bg-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Enquire</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 py-3 border-t border-orange-50 text-sm font-bold text-zinc-700">
            <div className="group relative">
              <button className="inline-flex items-center gap-2 uppercase tracking-widest text-primary hover:text-orange-600 transition-colors">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 border border-orange-100 bg-white opacity-0 shadow-2xl rounded-xl overflow-hidden transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-y-1">
                {(categories || []).map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`} className="block px-5 py-3 text-sm hover:bg-orange-50 hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="uppercase tracking-widest hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}

            <div className="ml-auto hidden xl:flex items-center gap-2">
              {storeDepartments.map((segment) => (
                <Link
                  key={segment.id}
                  href={`/categories?segment=${segment.id}`}
                  className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-700 hover:border-primary hover:text-primary hover:bg-white transition-all"
                >
                  {segment.label}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Mobile Search (visible only on mobile) */}
          <div className="lg:hidden pb-4">
            <HeaderSearch />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[101] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b">
                <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-center p-1">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  UC <span className="text-primary">ENTERPRISES</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full hover:bg-orange-50">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto py-6">
                <div className="px-6 space-y-6">
                  {/* Account Links (Mobile) */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link 
                      href={user ? "/account/profile" : "/login"} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-zinc-700 hover:bg-orange-50 transition-colors"
                    >
                      <User className="h-5 w-5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider">{user ? "Profile" : "Login"}</span>
                    </Link>
                    <Link 
                      href="/account/wishlist" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-zinc-700 hover:bg-orange-50 transition-colors"
                    >
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider">Wishlist</span>
                    </Link>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 px-4">Navigation</p>
                    {primaryNavLinks.map((link) => (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-700 hover:bg-orange-50 hover:text-primary transition-all font-bold text-sm"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Categories */}
                  <div className="space-y-1 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 px-4">Categories</p>
                    <div className="grid gap-2 px-2">
                      {(categories || []).map((category) => (
                        <Link 
                          key={category.id} 
                          href={`/categories/${category.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-4 py-2 rounded-lg text-sm text-zinc-600 hover:bg-orange-50 hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-orange-50/30">
                <Link 
                  href="/bulk-inquiry" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-orange-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Submit Inquiry
                </Link>
                <div className="mt-6 flex flex-col gap-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-center">
                  <span>Support: {supportPhone}</span>
                  <span className="text-[9px] lowercase opacity-60">Ambala Delhi Highway, Zirakpur, Punjab</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

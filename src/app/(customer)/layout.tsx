import Link from "next/link";
import { ChevronDown, Heart, Mail, MapPin, Phone, Search, ShoppingCart, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import {
  footerLinks,
  primaryNavLinks,
  storeDepartments,
  supportEmailHref,
  supportPhone,
  supportPhoneHref,
} from "@/lib/storefront";
import CartButton from "@/components/storefront/CartButton";

import HeaderSearch from "@/components/storefront/HeaderSearch";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: categories }, { data: authData }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name", { ascending: true }).limit(6),
    supabase.auth.getUser(),
  ]);

  const user = authData.user;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="border-b border-orange-100 bg-[linear-gradient(90deg,#fff2dc_0%,#ffffff_100%)] text-zinc-700">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2 text-[11px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <a href={supportPhoneHref} className="inline-flex items-center gap-2 hover:text-primary">
              <Phone className="h-3.5 w-3.5 text-primary" />
              {supportPhone}
            </a>
            <a href={supportEmailHref} className="hidden items-center gap-2 sm:inline-flex hover:text-primary">
              <Mail className="h-3.5 w-3.5 text-primary" />
              Sales Support
            </a>
          </div>
          <div className="hidden items-center gap-2 md:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Zirakpur, Punjab | PAN India Dispatch
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex items-center gap-6 px-4 py-5">
          <Link href="/" className="shrink-0 flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center p-1 transition group-hover:border-primary group-hover:scale-105">
              <img src="/logo.jpg" alt="UC Enterprises" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-zinc-950 leading-none">UC <span className="text-primary">ENTERPRISES</span></span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Quality Industrial Supplies</span>
            </div>
          </Link>

          <HeaderSearch />

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={user ? "/account/profile" : "/login"} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-primary">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user ? "My Account" : "Login"}</span>
            </Link>
            <Link href="/account/wishlist" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-primary">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>
            <CartButton />
            <Link href="/bulk-inquiry" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-200">
              <ShoppingCart className="h-4 w-4" />
              Enquire
            </Link>
          </div>
        </div>

        <div className="border-t border-orange-100 bg-white">
          <div className="container mx-auto flex flex-wrap items-center gap-6 px-4 py-3 text-sm font-bold text-zinc-700">
            <div className="group relative">
              <button className="inline-flex items-center gap-2 uppercase tracking-widest text-primary">
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-3 w-72 border border-orange-100 bg-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                {(categories || []).map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`} className="block border-b border-orange-50 px-5 py-3 text-sm hover:bg-orange-50 hover:text-primary">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="uppercase tracking-widest hover:text-primary">
                {link.label}
              </Link>
            ))}
            <div className="ml-auto hidden flex-wrap items-center gap-2 xl:flex">
              {storeDepartments.map((segment) => (
                <Link
                  key={segment.id}
                  href={`/categories?segment=${segment.id}`}
                  className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-zinc-700 hover:border-primary hover:text-primary"
                >
                  {segment.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-orange-100 bg-zinc-950 text-white">
        <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white overflow-hidden flex items-center justify-center p-0.5">
                <img src="/logo.jpg" alt="UC Enterprises" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase">UC ENTERPRISES</h2>
            </div>
            <p className="text-sm leading-6 text-zinc-300">
              Indian ecommerce storefront for hardware welding materials, electronic goods, lab chemicals, powders, and general order supply needs.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">Explore</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              {footerLinks.company.map((link) => (
                <Link key={link.href} href={link.href} className="block hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">Policies</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              {footerLinks.policies.map((link) => (
                <Link key={link.href} href={link.href} className="block hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">Contact</h3>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <a href={supportPhoneHref} className="block hover:text-white">{supportPhone}</a>
              <a href={supportEmailHref} className="block hover:text-white">ucenterprises1@gmail.com</a>
              <p>Ambala Delhi Highway, Zirakpur, Punjab</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

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

import Header from "@/components/storefront/Header";

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
      <Header categories={categories || []} user={user} />

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

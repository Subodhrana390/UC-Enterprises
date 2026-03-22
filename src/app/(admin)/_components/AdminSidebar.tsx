"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Command Center", icon: "dashboard", href: "/admin" },
    { name: "Product Catalog", icon: "inventory", href: "/admin/products" },
    { name: "Taxonomy (Categories)", icon: "category", href: "/admin/categories" },
    { name: "Inventory Ledger", icon: "inventory_2", href: "/admin/inventory" },
    { name: "Partner Network", icon: "verified", href: "/admin/brands" },
    { name: "Personnel (Users)", icon: "group", href: "/admin/users" },
    { name: "Production Queue", icon: "precision_manufacturing", href: "/admin/fabrication" },
    { name: "Quote Desk", icon: "request_quote", href: "/admin/quotes" },
  ];

  return (
    <>
      <div className="mb-10 pl-2">
        <h2 className="text-2xl font-black text-on-surface font-headline uppercase tracking-tight">Enterprise</h2>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">System Administration</p>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              pathname === item.href
                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                : "text-on-surface-variant hover:bg-white hover:text-primary hover:shadow-md"
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${pathname === item.href ? "text-white" : "opacity-40 group-hover:opacity-100"}`}>
              {item.icon}
            </span>
            <span className="font-black text-[12px] uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-border/10 opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Enterprise Governance</p>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "My Dashboard", icon: "account_circle", href: "/account" },
    { name: "Order History", icon: "shopping_bag", href: "/account/orders" },
    { name: "My Wishlist", icon: "favorite", href: "/account/wishlist" },
    { name: "My Reviews", icon: "rate_review", href: "/account/reviews" },
    { name: "My Profile", icon: "person", href: "/account/profile" },
    { name: "Address Book", icon: "location_on", href: "/account/addresses" },
    { name: "Account Settings", icon: "settings", href: "/account/settings" },
  ];

  return (
    <>
      <div className="mb-8 pl-2">
        <h2 className="text-xl font-black text-on-surface font-headline uppercase tracking-tight">Personal</h2>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] opacity-40">Account Center</p>
      </div>
      <nav className="flex flex-col gap-1.5 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              pathname === item.href
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-on-surface-variant hover:bg-white hover:text-primary hover:shadow-sm"
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${pathname === item.href ? "text-white" : "opacity-40 group-hover:opacity-100"}`}>
              {item.icon}
            </span>
            <span className="font-black text-[11px] uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-border/10 opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center">Secure Account Portal</p>
      </div>
    </>
  );
}

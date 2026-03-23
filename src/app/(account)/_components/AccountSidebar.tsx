"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: "home", href: "/account" },
    { name: "Orders", icon: "shopping_basket", href: "/account/orders" },
    { name: "Wishlist", icon: "favorite", href: "/account/wishlist" },
    { name: "Reviews", icon: "rate_review", href: "/account/reviews" },
    { name: "Profile", icon: "person", href: "/account/profile" },
    { name: "Addresses", icon: "map", href: "/account/addresses" },
    { name: "Settings", icon: "settings", href: "/account/settings" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="mb-6 px-3">
        <h2 className="text-xs font-semibold text-[#616161] uppercase tracking-wider">
          Account Center
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#ebebeb] text-[#1a1c1d]" 
                  : "text-[#1a1c1d] hover:bg-[#f1f1f1]"
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[20px] transition-colors ${
                  isActive ? "text-[#1a1c1d]" : "text-[#616161]"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Branding */}
      <div className="mt-auto pt-6 border-t border-[#ebebeb]">
        <p className="text-[10px] text-[#8c8c8c] font-medium text-center">
          UC Enterprises &copy; 2024
        </p>
      </div>
    </div>
  );
}
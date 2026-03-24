"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AccountSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: "home", href: "/account" },
    { name: "Orders", icon: "shopping_basket", href: "/account/orders" },
    { name: "Reviews", icon: "rate_review", href: "/account/reviews" },
    { name: "Profile", icon: "person", href: "/account/profile" },
    { name: "Addresses", icon: "map", href: "/account/addresses" },
    { name: "Settings", icon: "settings", href: "/account/settings" },
  ];

  return (
    <div className="flex flex-col md:h-full">
      {/* Sidebar Header - Only for Desktop */}
      <div className="hidden lg:block mb-6 px-3">
        <h2 className="text-xs font-semibold text-[#616161] uppercase tracking-wider">
          Account Center
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="
        flex flex-row lg:flex-col 
        items-center lg:items-stretch 
        gap-2 lg:space-y-1 
        overflow-x-auto lg:overflow-visible 
        no-scrollbar 
        py-3 px-4 lg:p-0 /* Added padding for mobile touch */
      ">
        {menuItems.map((item) => {
          const isActive = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 lg:gap-3 px-4 py-2 lg:px-3 rounded-full lg:rounded-lg text-sm font-medium transition-all shrink-0 whitespace-nowrap ${
                isActive
                  ? "bg-[#1a1c1d] lg:bg-[#ebebeb] text-white lg:text-[#1a1c1d]" 
                  : "text-[#616161] lg:text-[#1a1c1d] hover:bg-[#f1f1f1]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px] lg:text-[20px]">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Footer Branding */}
      <div className="hidden lg:block mt-auto pt-6 border-t border-[#ebebeb]">
        <p className="text-[10px] text-[#8c8c8c] font-medium text-center">
          UC Enterprises &copy; 2026
        </p>
      </div>
    </div>
  );
}
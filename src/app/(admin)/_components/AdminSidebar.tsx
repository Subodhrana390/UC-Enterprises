"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  // Renamed to Shopify-standard naming conventions
  const menuItems = [
    { name: "Home", icon: "home", href: "/admin" },
    { name: "Customers", icon: "person", href: "/admin/users" },
    { name: "Brands", icon: "storefront", href: "/admin/brands" },
    { name: "Categories", icon: "category", href: "/admin/categories" },
    { name: "Products", icon: "shopping_basket", href: "/admin/products" },
    { name: "Inventory", icon: "package_2", href: "/admin/inventory" },
    { name: "Orders", icon: "shopping_cart", href: "/admin/orders" },
    { name: "Fabrication", icon: "build", href: "/admin/fabrication" },
    { name: "Quotes", icon: "description", href: "/admin/quotes" },
    { name: "Settings", icon: "settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#ebebeb] border-r border-[#d2d2d2]">
      {/* Brand Header */}
      <div className="px-4 py-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1a1c1d] rounded-md flex items-center justify-center text-white font-bold text-xs italic">
          M
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#1a1c1d]">Manifest</h2>
          <p className="text-[11px] text-[#616161]">Admin Store</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col px-2 gap-0.5 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                isActive
                  ? "bg-white text-[#1a1c1d] shadow-sm border border-[#d2d2d2]/30"
                  : "text-[#303030] hover:bg-[#e3e3e3]"
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[20px] ${
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
      
      {/* User / Logout Section */}
      <div className="p-4 border-t border-[#d2d2d2] mt-auto">
        <button className="flex items-center gap-3 w-full px-2 py-1.5 text-sm font-medium text-[#303030] hover:bg-[#e3e3e3] rounded-md">
          <span className="material-symbols-outlined text-[20px] text-[#616161]">account_circle</span>
          <span>Admin Profile</span>
        </button>
      </div>
    </div>
  );
}
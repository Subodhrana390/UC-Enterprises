"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", icon: "home", href: "/admin" },
    { name: "Orders", icon: "shopping_cart", href: "/admin/orders" },
    { name: "Products", icon: "inventory_2", href: "/admin/products" },
    { name: "Customers", icon: "person", href: "/admin/users" },
    { name: "Brands", icon: "storefront", href: "/admin/brands" },
    { name: "Categories", icon: "category", href: "/admin/categories" },
    { name: "Inventory", icon: "package_2", href: "/admin/inventory" },
    { name: "Fabrication", icon: "build", href: "/admin/fabrication" },
    { name: "Quotes", icon: "description", href: "/admin/quotes" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f1f1f1] border-r border-[#d2d2d2] w-60">
      <div className="px-4 py-3 flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-[#1a1c1d] rounded-lg flex items-center justify-center text-white font-black text-sm">
          U
        </div>
        <div className="flex flex-col overflow-hidden">
          <h2 className="text-[13px] font-bold text-[#1a1c1d] truncate">UCEnterprises</h2>
          <p className="text-[11px] text-[#616161] font-medium">Admin</p>
        </div>
      </div>

      {/* 2. Main Navigation */}
      <nav className="flex flex-col px-3 gap-[2px] flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-md transition-all text-[13px] font-semibold tracking-tight ${
                isActive
                  ? "bg-[#ffffff] text-[#1a1c1d] shadow-[0_1px_2px_rgba(0,0,0,0.08)] border border-[#d2d2d2]/40"
                  : "text-[#4a4a4a] hover:bg-[#e3e3e3]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? "text-[#1a1c1d]" : "text-[#5c5c5c]"
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Footer: Settings & Profile (Shopify Separation) */}
      <div className="p-3 flex flex-col gap-1 border-t border-[#d2d2d2]/60 bg-[#f1f1f1]">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-2 py-1.5 rounded-md text-[13px] font-semibold tracking-tight ${
            pathname === "/admin/settings" ? "bg-white shadow-sm border border-[#d2d2d2]/40" : "text-[#4a4a4a] hover:bg-[#e3e3e3]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px] text-[#5c5c5c]">settings</span>
          <span>Settings</span>
        </Link>
        
        <div className="group relative">
           <button 
            onClick={() => logout()}
            className="flex items-center justify-between gap-3 w-full px-2 py-2 text-[13px] font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-[20px]">logout</span>
               <span>Exit Session</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
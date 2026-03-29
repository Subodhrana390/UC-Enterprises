"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import logo from '@/app/logo.jpg'
import Image from "next/image";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", icon: "home", href: "/admin" },
    { name: "Orders", icon: "shopping_cart", href: "/admin/orders" },
    { name: "Products", icon: "inventory_2", href: "/admin/products" },
    { name: "Customers", icon: "person", href: "/admin/users" },
    { name: "Brands", icon: "storefront", href: "/admin/brands" },
    { name: "Categories", icon: "category", href: "/admin/categories" },
    { name: "Inventory", icon: "package_2", href: "/admin/inventory" },
    { name: "Banners", icon: "photo_library", href: "/admin/banners" },
    { name: "Q&A", icon: "quiz", href: "/admin/qa" },
    { name: "Fabrication", icon: "build", href: "/admin/fabrication" },
    { name: "Quotes", icon: "description", href: "/admin/quotes" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f1f1f1] border-r border-[#d2d2d2]">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3">
        <h2 className="text-sm font-bold text-[#1a1c1d] truncate">
          <Image src={logo} alt="Logo" className="w-10 h-10" />
        </h2>
        <p className="text-xs text-[#616161] font-medium">Admin Panel</p>
      </div>

      <Separator className="bg-[#d2d2d2]/60" />

      {/* Main Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-start gap-3 h-9 px-3 text-sm font-semibold rounded-md transition-all",
                  isActive
                    ? "bg-white text-[#1a1c1d] shadow-sm border border-[#d2d2d2]/40"
                    : "text-[#4a4a4a] hover:bg-[#e3e3e3] hover:text-[#1a1c1d]"
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-[20px]",
                    isActive ? "text-[#1a1c1d]" : "text-[#5c5c5c]"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-[#d2d2d2]/60" />

      {/* Footer: Settings & Logout */}
      <div className="p-3 flex flex-col gap-1 bg-[#f1f1f1]">
        <Link
          href="/admin/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center justify-start gap-3 h-9 px-3 text-sm font-semibold rounded-md transition-all",
            pathname === "/admin/settings"
              ? "bg-white shadow-sm border border-[#d2d2d2]/40"
              : "text-[#4a4a4a] hover:bg-[#e3e3e3]"
          )}
        >
          <span className="material-symbols-outlined text-[20px] text-[#5c5c5c]">settings</span>
          <span>Settings</span>
        </Link>

        <Button
          variant="ghost"
          onClick={() => logout()}
          className="justify-start gap-3 h-9 px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Log Out</span>
        </Button>
      </div>
    </div>
  );
}
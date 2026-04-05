"use client";

import { logout } from "@/lib/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import logo from '@/app/logo.jpg'
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Settings, Power, ChevronRight } from "lucide-react";
import { useState } from "react";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuGroups = [
    {
      label: "Operations",
      items: [
        { name: "Dashboard", icon: "dashboard", href: "/admin" },
        { name: "Orders", icon: "receipt_long", href: "/admin/orders" },
        { name: "Inventory", icon: "package_2", href: "/admin/inventory" },
        { name: "Quotes", icon: "request_quote", href: "/admin/quotes" },
      ]
    },
    {
      label: "Catalog & Assets",
      items: [
        { name: "Products", icon: "inventory_2", href: "/admin/products" },
        { name: "Brands", icon: "verified", href: "/admin/brands" },
        { name: "Categories", icon: "grid_view", href: "/admin/categories" },
        { name: "Banners", icon: "photo_library", href: "/admin/banners" },
      ]
    },
    {
      label: "Systems",
      items: [
        { name: "Customer", icon: "group", href: "/admin/users" },
        { name: "Questions & Answers", icon: "forum", href: "/admin/qa" },
        { name: "Fabrication", icon: "precision_manufacturing", href: "/admin/fabrication" },
      ]
    }
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shrink-0 shadow-sm">
            <Image src={logo} alt="UC Logo" fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">
              UC <span className="text-cyan-600">ENT.</span>
            </h2>
            <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 truncate">Admin v2.4</p>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-8">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <h3 className="px-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
                {group.label}
              </h3>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 h-9 px-3 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all",
                      isActive
                        ? "bg-cyan-50 text-cyan-700 shadow-sm shadow-cyan-100/50"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span className={cn(
                      "material-symbols-outlined text-[18px] shrink-0",
                      isActive ? "text-cyan-600" : "text-slate-400 group-hover:text-slate-600"
                    )}>
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {isActive && <ChevronRight className="h-3 w-3 text-cyan-400" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-1">
        <Link
          href="/admin/settings"
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 h-9 px-3 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all",
            pathname === "/admin/settings" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
        <Button
          variant="ghost"
          onClick={() => logout()}
          className="w-full justify-start gap-3 h-9 px-3 text-[11px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-100/50 rounded-lg transition-colors"
        >
          <Power className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR (Solves the "Floating Button" overlap issue) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 relative rounded-lg overflow-hidden border border-slate-100">
            <Image src={logo} alt="UC Logo" fill className="object-cover" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase text-slate-900">
            UC <span className="text-cyan-600">ENT.</span>
          </span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-none shadow-2xl">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </header>

      {/* Spacer for Mobile Top Bar */}
      <div className="lg:hidden h-16 w-full" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-slate-200 bg-white overflow-hidden shrink-0">
        {SidebarContent}
      </aside>
    </>
  );
}
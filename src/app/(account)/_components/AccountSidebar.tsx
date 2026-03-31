"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

interface AccountSidebarProps {
  onNavigate?: () => void;
}

export function AccountSidebar({ onNavigate }: AccountSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: "home", href: "/account" },
    { name: "Orders", icon: "shopping_basket", href: "/account/orders" },
    { name: "Reviews", icon: "rate_review", href: "/account/reviews" },
    { name: "Profile", icon: "person", href: "/account/profile" },
    { name: "Addresses", icon: "map", href: "/account/addresses" },
    { name: "Settings", icon: "settings", href: "/account/settings" },
  ];

  const handleLogout = async () => {
    if (onNavigate) onNavigate(); // Close mobile sheet before logging out
    await logout();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. Header: Smaller & Wider Spacing */}
      <div className="px-6 py-8">
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Account Center
        </h2>
      </div>

      {/* 2. Navigation: Tighter text, more whitespace */}
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* 3. Footer Actions: Integrated Logout */}
      <div className="p-4 mt-auto">
        <Separator className="mb-4 opacity-50" />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
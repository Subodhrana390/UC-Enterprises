"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut,
  Bell,
  Search,
  PlusCircle,
  Clock,
  IndianRupee, 
  Activity,
  Terminal,
  Image,
  BadgePercent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuGroup,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Realtime channel for new orders
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          toast.success(`New Order Received! #${payload.new.id.slice(0, 8).toUpperCase()}`, {
            description: `${payload.new.customer_name} placed an order worth ₹${payload.new.total_amount}.`,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Don't show sidebar/header on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const sidebarItems = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard", href: "/admin" },
    { icon: <Package className="w-4 h-4" />, label: "Products", href: "/admin/products" },
    { icon: <PlusCircle className="w-4 h-4" />, label: "Categories", href: "/admin/categories" },
    { icon: <Clock className="w-4 h-4" />, label: "Orders", href: "/admin/orders" },
    { icon: <IndianRupee className="w-4 h-4" />, label: "Payments", href: "/admin/payments" },
    { icon: <Activity className="w-4 h-4" />, label: "Inventory", href: "/admin/inventory" },
    { icon: <Image className="w-4 h-4" />, label: "Banners", href: "/admin/banners" },
    { icon: <BadgePercent className="w-4 h-4" />, label: "Deals", href: "/admin/deals" },
    { icon: <Users className="w-4 h-4" />, label: "Customers", href: "/admin/customers" },
    { icon: <Settings className="w-4 h-4" />, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 font-black text-2xl tracking-tighter group">
            <div className="w-10 h-10 bg-white rounded-xl border border-zinc-100 flex items-center justify-center shadow-sm p-1 transition group-hover:scale-105">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-none">UC <span className="text-primary">ADMIN</span></span>
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Control Center</span>
            </div>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 px-6 py-2 admin-sidebar-scroll">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 px-4">Management Console</p>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-bold",
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                      : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive ? "bg-white/20" : "bg-transparent"
                  )}>
                    {item.icon}
                  </div>
                  {item.label}
                </Link>
              );
            })}
          </div>


        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 border-b bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:gap-6 relative max-w-lg w-full">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-2xl border-zinc-100 hover:bg-zinc-50 hidden sm:flex">
              <Bell className="w-4 h-4 text-zinc-500" />
              <span className="absolute top-3 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <div className="w-px h-8 bg-zinc-100 hidden sm:block" />
            
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative">
                    <Avatar className="h-11 w-11 border-2 border-zinc-100 group-hover:border-primary/20 transition-all rounded-2xl">
                      <AvatarImage src="https://avatar.iran.liara.run/public/boy" className="rounded-2xl" />
                      <AvatarFallback className="rounded-2xl">SK</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                </div>
              } />
              <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl p-2 shadow-xl border-zinc-100">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest text-zinc-400 p-3">Account Settings</DropdownMenuLabel>

                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  className="rounded-xl gap-3 p-3 font-bold text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={async () => {
                    const { signout } = await import("@/app/actions/auth");
                    await signout();
                  }}
                >
                  <LogOut className="w-4 h-4" /> Log Out (Safe Exit)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] lg:hidden"
              />
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-72 bg-white z-[60] lg:hidden flex flex-col shadow-2xl"
              >
                <div className="p-8 flex items-center justify-between">
                  <Link href="/admin" className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                    <div className="w-10 h-10 bg-white rounded-xl border border-zinc-100 flex items-center justify-center p-1">
                      <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    UC <span className="text-primary">ADMIN</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-xl">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <ScrollArea className="flex-1 px-6 py-2">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 px-4">Menu</p>
                    {sidebarItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link 
                          key={item.label} 
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-sm font-bold",
                            isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-500 hover:text-zinc-950"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>

              </motion.aside>
            </>
          )}
        </AnimatePresence>
        
        <main className="p-10 max-w-[1600px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}




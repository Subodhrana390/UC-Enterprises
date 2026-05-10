"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  MapPin, 
  Heart, 
  Package, 
  RotateCcw, 
  Mail, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  CreditCard
} from "lucide-react";

const sidebarLinks = [
  { name: "My Account", icon: User, href: "/account/profile" },
  { name: "Address Book", icon: MapPin, href: "/account/address-book" },
  { name: "Wishlist", icon: Heart, href: "/account/wishlist" },
  { name: "My Orders", icon: Package, href: "/account/orders" },
  { name: "Returns", icon: RotateCcw, href: "/account/returns" },
  { name: "Email Updates", icon: Mail, href: "/account/newsletter" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-80 shrink-0">
            <div className="bg-white border border-zinc-100 shadow-xl overflow-hidden">
              <div className="p-8 bg-zinc-950 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary flex items-center justify-center text-2xl font-black italic">JD</div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">My Account</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">Orders, addresses and saved items</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link 
                          href={link.href}
                          className={`flex items-center justify-between p-4 font-bold text-xs uppercase tracking-widest transition-all group ${
                            isActive 
                              ? "bg-primary text-white shadow-lg" 
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-primary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <link.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-primary"}`} />
                            {link.name}
                          </div>
                          <ChevronRight className={`w-3 h-3 ${isActive ? "text-white" : "text-zinc-300"}`} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 pt-8 border-t border-zinc-50">
                  <button 
                    onClick={async () => {
                      const { signout } = await import("@/app/actions/auth");
                      await signout();
                    }}
                    className="w-full flex items-center gap-3 p-4 font-black text-xs uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </nav>

              <div className="p-6 bg-zinc-50 flex items-center gap-3 text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Secure login with protected session
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

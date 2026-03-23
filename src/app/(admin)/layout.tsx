import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./_components/AdminSidebar";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect("/account");

  return (
    <div className="flex h-screen bg-[#f1f1f1] overflow-hidden">
      {/* Sidebar: Fixed and solid */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Shopify Universal Top Bar */}
        <header className="h-12 bg-[#1a1c1d] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Global Admin Search */}
            <div className="relative max-w-md w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
                search
              </span>
              <input 
                type="text" 
                placeholder="Search orders, products, or help"
                className="w-full bg-zinc-800 border-none rounded-md py-1.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-500 focus:ring-1 focus:ring-zinc-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick View Store Link */}
            <Link 
              href="/" 
              className="text-[11px] font-medium text-zinc-300 hover:text-white px-3 py-1 rounded bg-zinc-800 transition-colors"
            >
              View Storefront
            </Link>
            
            {/* Notifications / User */}
            <button className="text-zinc-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {user.email?.slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
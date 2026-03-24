import { createClient } from "@/lib/supabase/server";
import { getShopCategories } from "@/lib/actions/products";
import { Navbar } from "@/components/layout/Navbar";
import { AccountSidebar } from "./_components/AccountSidebar";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    redirect("/admin");
  }

  const [categories, cartResult, wishlistResult] = await Promise.all([
    getShopCategories(),
    supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("wishlist_items").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  return (
    <div className="flex flex-col">
      <Navbar
        categories={categories}
        user={user}
        userRole={profile?.role ?? null}
        cartCount={cartResult?.count ?? 0}
        wishlistCount={wishlistResult?.count ?? 0}
      />
      <div className="flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 flex-1 pt-16 md:pt-20">

        {/* Sidebar Container */}
        <aside className="
          /* Mobile Styles */
          sticky top-16 md:top-20 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-0 sm:p-2 z-40
          /* Desktop Styles */
          lg:flex lg:flex-col lg:w-64 lg:h-[calc(100vh-80px)] lg:border-r lg:border-b-0 lg:p-6 lg:top-20 lg:bg-white/50 lg:backdrop-blur-md
        ">
          <AccountSidebar />
        </aside>

        {/* Account Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
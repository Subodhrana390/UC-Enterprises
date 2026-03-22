import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/actions/products";
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

  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar categories={categories} user={user} />
      <div className="flex bg-surface flex-1 pt-20">
        {/* Customer Sidebar */}
        <aside className="hidden lg:flex flex-col h-[calc(100vh-80px)] w-64 border-r border-border/40 bg-white/50 backdrop-blur-md p-6 gap-2 sticky top-20 z-40 overflow-y-auto">
            <AccountSidebar />
        </aside>

        {/* Account Content */}
        <div className="flex-1 overflow-x-hidden">
            {children}
        </div>
      </div>
    </div>
  );
}

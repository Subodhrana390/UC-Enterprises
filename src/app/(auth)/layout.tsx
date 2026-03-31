import { createClient } from "@/lib/supabase/server";
import { getShopCategories } from "@/lib/actions/products";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [categories, profileRow] = await Promise.all([
    getShopCategories(),
    user ? supabase.from("profiles").select("role").eq("id", user.id).single() : Promise.resolve({ data: null }),
  ]);
  const userRole = profileRow?.data?.role ?? null;

  return (
    <>
      <Navbar categories={categories} user={user} userRole={userRole} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

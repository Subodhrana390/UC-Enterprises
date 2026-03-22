import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/actions/products";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const categories = await getCategories();

  return (
    <>
      <Navbar categories={categories} user={user} />
      <main className="pt-20 flex-1 bg-surface-container-low">{children}</main>
      <Footer />
    </>
  );
}

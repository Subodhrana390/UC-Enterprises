import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { createClient } from "@/utils/supabase/server";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: categories }, { data: authData }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, parent_id")
      .order("name", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const user = authData.user;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header categories={categories || []} user={user} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}

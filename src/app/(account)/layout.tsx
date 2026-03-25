import { createClient } from "@/lib/supabase/server";
import { getShopCategories } from "@/lib/actions/products";
import { redirect } from "next/navigation";
import AccountLayoutClient from "./_components/AccountLayoutClient";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  const [categories, cartResult, wishlistResult] = await Promise.all([
    getShopCategories(),
    supabase
      .from("cart_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),

    supabase
      .from("wishlist_items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return (
    <AccountLayoutClient
      user={user}
      role={profile?.role}
      categories={categories}
      cartCount={cartResult.count ?? 0}
      wishlistCount={wishlistResult.count ?? 0}
    >
      {children}
    </AccountLayoutClient>
  );
}
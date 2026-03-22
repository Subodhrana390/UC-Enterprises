import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/actions/products";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [categories, cartResult, wishlistResult, profileResult] = await Promise.all([
    getCategories(),
    user ? supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", user.id) : Promise.resolve({ count: 0 }),
    user ? supabase.from("wishlist_items").select("*", { count: "exact", head: true }).eq("user_id", user.id) : Promise.resolve({ count: 0 }),
    user ? supabase.from("profiles").select("role").eq("id", user.id).single() : Promise.resolve({ data: null }),
  ]);
  const cartCount = cartResult?.count ?? 0;
  const wishlistCount = wishlistResult?.count ?? 0;
  const userRole = profileResult?.data?.role ?? null;

  return (
    <>
      <Navbar categories={categories} user={user} userRole={userRole} cartCount={cartCount} wishlistCount={wishlistCount} />
      <main className="pt-20 flex-1">{children}</main>
      <Footer />
      {/* Floating WhatsApp Button */}
      <Link
        href="https://wa.me/1234567890"
        target="_blank"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
      </Link>
    </>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress, CheckoutProgressCircles } from "@/components/checkout/CheckoutProgress";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { CheckoutOrderSummaryCard } from "@/components/checkout/CheckoutOrderSummaryCard";
type Props = { searchParams: Promise<{ addressId?: string; gst?: string }> };

export default async function CheckoutPaymentPage({ searchParams }: Props) {
  const { addressId, gst } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: rawCartItems }, { data: addrRow }] = await Promise.all([
    supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id),
    addressId
      ? supabase.from("addresses").select("id").eq("user_id", user.id).eq("id", addressId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const cartItems = rawCartItems || [];
  if (cartItems.length === 0) redirect("/cart");
  if (!addressId || !addrRow) redirect("/checkout");

  const subtotal = cartItems.reduce(
    (acc, item: { products?: { base_price?: number }; quantity: number }) => acc + (item.products?.base_price ?? 0) * item.quantity,
    0
  );
  const gstAmount = subtotal * 0.18;
  const totalAmount = subtotal + gstAmount;

  const gstBool = gst === "1" || gst === "true";

  return (
    <main className="pt-10 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
      <div className="hidden md:block">
        <CheckoutProgressCircles step={2} />
      </div>
      <div className="md:hidden mb-8">
        <CheckoutProgress step={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8">
          <PaymentMethodStep addressId={addressId} gst={gstBool} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <CheckoutOrderSummaryCard cartItems={cartItems} subtotal={subtotal} gst={gstAmount} totalAmount={totalAmount} />
            <Link href="/checkout" className="block text-center text-sm font-black text-primary uppercase tracking-widest hover:underline">
              ← Edit address
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

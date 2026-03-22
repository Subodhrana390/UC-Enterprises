import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { CheckoutAddressStep } from "@/components/checkout/CheckoutAddressStep";
import { CheckoutOrderSummaryCard } from "@/components/checkout/CheckoutOrderSummaryCard";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: rawCartItems }, { data: addresses }] = await Promise.all([
    supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id),
    supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }),
  ]);

  const cartItems = rawCartItems || [];
  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const subtotal = cartItems.reduce((acc, item: { products?: { base_price?: number }; quantity: number }) => acc + (item.products?.base_price ?? 0) * item.quantity, 0);
  const shipping = 0;
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + shipping + gst;

  const defaultAddr = addresses?.find((a) => a.is_default) || addresses?.[0];

  return (
    <main className="pt-10 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
      <CheckoutProgress step={1} />

      <header className="mb-8 text-center md:text-left">
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-surface mb-2">Secure Checkout</h1>
        <p className="text-on-surface-variant font-medium text-sm">Complete your order for UCEnterprises high-precision components.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-8">
          <CheckoutAddressStep
            addresses={(addresses || []).map((a) => ({
              id: a.id,
              label: a.label,
              street: a.street,
              address_line1: a.address_line1,
              city: a.city,
              state: a.state,
              zip: a.zip,
              pincode: a.pincode,
              country: a.country,
              is_default: a.is_default,
            }))}
            initialAddressId={defaultAddr?.id}
            cartItemCount={cartItems.length}
          />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <CheckoutOrderSummaryCard cartItems={cartItems} subtotal={subtotal} gst={gst} totalAmount={totalAmount} />

            <div className="bg-white/80 border border-border/40 rounded-2xl p-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-6 opacity-50">
                <span className="material-symbols-outlined text-3xl">lock</span>
                <span className="material-symbols-outlined text-3xl">verified_user</span>
                <span className="material-symbols-outlined text-3xl">shield</span>
              </div>
              <p className="text-[10px] text-center font-black text-on-surface-variant uppercase tracking-[0.2em] leading-relaxed">
                Military-Grade Encryption
                <br />
                &amp; SSL Secure Protocol
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low border border-border/20">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary">help_outline</span>
                <p className="text-sm font-black">Need Assistance?</p>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">Our logistics team is available for order support.</p>
              <Link href="/support" className="text-xs font-black text-primary underline underline-offset-4 hover:opacity-80">
                Talk to support
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

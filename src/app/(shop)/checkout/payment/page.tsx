import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress, CheckoutProgressCircles } from "@/components/checkout/CheckoutProgress";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { CheckoutOrderSummaryCard } from "@/components/checkout/CheckoutOrderSummaryCard";

type Props = { 
  searchParams: Promise<{ addressId?: string; gst?: string }> 
};

export default async function CheckoutPaymentPage({ searchParams }: Props) {
  const { addressId, gst } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    (acc, item: any) => acc + (item.products?.base_price ?? 0) * item.quantity,
    0
  );
  const gstAmount = subtotal * 0.18;
  const totalAmount = subtotal + gstAmount;
  const gstBool = gst === "1" || gst === "true";

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1100px] mx-auto px-4 py-8 md:py-16">
        
        {/* Step Indicator - Subdued and Professional */}
        <div className="mb-10">
          <div className="hidden md:block">
            <CheckoutProgressCircles step={2} />
          </div>
          <div className="md:hidden">
            <CheckoutProgress step={2} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Column: Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            <header className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>
              <p className="text-sm text-[#616161] mt-1">All transactions are secure and encrypted.</p>
            </header>

            {/* Component should handle the Shopify-style radio list */}
            <div className="border border-[#ebebeb] rounded-xl overflow-hidden shadow-sm">
              <PaymentMethodStep addressId={addressId} gst={gstBool} />
            </div>

            {/* Shopify-style Footer Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-[#ebebeb]">
              <Link 
                href="/checkout" 
                className="text-sm font-medium text-[#005bd3] hover:text-blue-800 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                Return to shipping
              </Link>
            </div>
          </div>

          {/* Sidebar: Order Summary (Subtle background) */}
          <aside className="lg:col-span-5">
            <div className="bg-[#f7f7f7] rounded-xl p-6 md:p-8 sticky top-10 border border-[#ebebeb]">
              <h2 className="text-lg font-semibold mb-6">Order summary</h2>
              
              <CheckoutOrderSummaryCard 
                cartItems={cartItems} 
                subtotal={subtotal} 
                gst={gstAmount} 
                totalAmount={totalAmount} 
              />
              
              {/* Trust Badge / Security Micro-copy */}
              <div className="mt-8 flex items-center gap-3 text-[#616161] bg-white p-4 rounded-lg border border-[#ebebeb]">
                <span className="material-symbols-outlined text-green-600">lock</span>
                <p className="text-[11px] leading-tight">
                  Your payment is processed through secure protocols. We never store your full card details.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCartAndTotals } from "@/lib/actions/checkout";
import { CheckoutPaymentStep } from "@/components/checkout/CheckoutPaymentStep";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { formatPriceINR } from "@/lib/utils";

export default async function PaymentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error, cartItems, totalAmount, subtotal, minimumRequired } = await getCartAndTotals(user.id);

  if (error || !cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  return (
    <main className="pt-10 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
      <CheckoutProgress step={2} />

      <header className="mb-8 text-center md:text-left">
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-surface mb-2">Payment</h1>
        <p className="text-on-surface-variant font-medium text-sm">Choose your payment method.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <div className="lg:col-span-8">
          <CheckoutPaymentStep
            totalAmount={totalAmount}
            minimumRequired={minimumRequired}
            subtotal={subtotal}
          />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white border border-[#ebebeb] rounded-xl p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#616161]">Subtotal</span>
                  <span>{formatPriceINR(subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#616161]">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#616161]">GST (18%)</span>
                  <span>{formatPriceINR((subtotal || 0) * 0.18)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPriceINR(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckoutProgress, CheckoutProgressCircles } from "@/components/checkout/CheckoutProgress";
import { CheckoutOrderSummaryCard } from "@/components/checkout/CheckoutOrderSummaryCard";
import { PlaceOrderForm } from "@/components/checkout/PlaceOrderForm";
import { Badge } from "@/components/ui/badge";
import { isRazorpayConfigured } from "@/lib/payments/razorpay";
const VALID_PAYMENT = new Set(["card", "upi", "netbanking", "wallet"]);

type Props = {
  searchParams: Promise<{ addressId?: string; gst?: string; paymentMethod?: string }>;
};

export default async function CheckoutReviewPage({ searchParams }: Props) {
  const { addressId, gst, paymentMethod: pmRaw } = await searchParams;
  const paymentMethod = VALID_PAYMENT.has(pmRaw || "") ? pmRaw! : "card";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: rawCartItems }, { data: address }] = await Promise.all([
    supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id),
    addressId
      ? supabase.from("addresses").select("*").eq("user_id", user.id).eq("id", addressId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const cartItems = rawCartItems || [];
  if (cartItems.length === 0) redirect("/cart");
  if (!addressId || !address) {
    redirect("/checkout");
  }

  const subtotal = cartItems.reduce(
    (acc, item: { products?: { base_price?: number }; quantity: number }) => acc + (item.products?.base_price ?? 0) * item.quantity,
    0
  );
  const gstAmount = subtotal * 0.18;
  const totalAmount = subtotal + gstAmount;
  const gstBool = gst === "1" || gst === "true";

  const shipLine = [address.street || address.address_line1, `${address.city}, ${address.state} ${address.zip || address.pincode || ""}`, address.country || "India"].filter(Boolean);

  return (
    <main className="pt-10 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
      <div className="hidden md:block">
        <CheckoutProgressCircles step={3} />
      </div>
      <div className="md:hidden mb-8">
        <CheckoutProgress step={3} />
      </div>

      <header className="mb-10">
        <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface mb-2">Review your order</h1>
        <p className="text-sm text-on-surface-variant">Confirm details and place your order.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-3xl border border-border/40 shadow-sm">
            <h2 className="font-headline text-lg font-black mb-4 uppercase tracking-tight">Ship to</h2>
            <p className="font-bold text-on-surface mb-1">{address.label || "Address"}</p>
            <div className="text-sm text-on-surface-variant space-y-0.5">
              {shipLine.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <Link href="/checkout" className="inline-block mt-4 text-xs font-black text-primary uppercase tracking-widest hover:underline">
              Change address
            </Link>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-3xl border border-border/40 shadow-sm">
            <h2 className="font-headline text-lg font-black mb-4 uppercase tracking-tight">Payment</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="font-mono text-[10px] uppercase">
                {paymentMethod === "card" && "Credit / Debit Card"}
                {paymentMethod === "upi" && "UPI"}
                {paymentMethod === "netbanking" && "Net Banking"}
                {paymentMethod === "wallet" && "Digital Wallet"}
              </Badge>
              <span className="text-xs text-on-surface-variant">
                {isRazorpayConfigured() ? "You will pay securely on the next step via Razorpay." : "Configure Razorpay in production for live payments."}
              </span>
            </div>
            <Link
              href={`/checkout/payment?${new URLSearchParams({ addressId, gst: gstBool ? "1" : "0" }).toString()}`}
              className="inline-block mt-4 text-xs font-black text-primary uppercase tracking-widest hover:underline"
            >
              Change payment method
            </Link>
          </section>

          {gstBool && (
            <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/80">
              <p className="text-sm font-bold text-on-surface">GST invoice requested</p>
              <p className="text-xs text-on-surface-variant mt-1">Ensure your billing details and GSTIN are updated with support if needed.</p>
            </section>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-6">
            <CheckoutOrderSummaryCard
              cartItems={cartItems}
              subtotal={subtotal}
              gst={gstAmount}
              totalAmount={totalAmount}
              footer={
                <PlaceOrderForm
                  addressId={addressId}
                  requestGst={gstBool}
                  paymentMethod={paymentMethod}
                  razorpayEnabled={isRazorpayConfigured()}
                />
              }
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

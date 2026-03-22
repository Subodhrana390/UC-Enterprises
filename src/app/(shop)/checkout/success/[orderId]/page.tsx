import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPriceINR } from "@/lib/utils";

/** stitch_screens/list2/order_success.html */
export default async function CheckoutSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("id, total_amount, tax_amount, shipping_amount, created_at, status")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(name, sku, images)")
    .eq("order_id", orderId);

  const subtotal =
    items?.reduce((acc, row: { total_price?: number }) => acc + (Number(row.total_price) || 0), 0) ?? 0;

  const delivery = new Date(order.created_at);
  delivery.setDate(delivery.getDate() + 7);

  return (
    <main className="flex-grow pt-24 pb-24 px-4 md:px-12 max-w-5xl mx-auto">
      <section className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6">
          <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-on-surface mb-4">Order confirmed</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Thank you for choosing UCEnterprises. We&apos;ve received your order and our team is preparing your components for dispatch.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-border/40 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant mb-1">Order ID</p>
              <p className="text-2xl font-headline font-black text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant mb-1">Estimated delivery</p>
              <p className="text-xl font-headline font-black text-primary">
                {delivery.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <h3 className="text-lg font-black font-headline mb-6">Order summary</h3>
          <div className="space-y-6">
            {items?.map((row: { id: string; quantity: number; total_price?: number; products?: { name?: string; sku?: string; images?: string[] } }) => (
              <div key={row.id} className="flex items-center gap-4 md:gap-6">
                <div className="w-16 h-16 bg-surface rounded-lg overflow-hidden relative flex-shrink-0 border border-border/20">
                  <Image
                    src={row.products?.images?.[0] || "/placeholder-product.png"}
                    alt={row.products?.name || ""}
                    fill
                    className="object-contain p-2"
                    sizes="64px"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-headline font-bold text-on-surface truncate">{row.products?.name}</p>
                  <p className="text-sm text-on-surface-variant">{row.products?.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold">× {row.quantity}</p>
                  <p className="text-sm text-on-surface-variant">{formatPriceINR(Number(row.total_price) || 0)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border/20 space-y-2">
            <div className="flex justify-between text-on-surface-variant text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPriceINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant text-sm">
              <span>GST (included)</span>
              <span className="font-medium">{formatPriceINR(Number(order.tax_amount) || 0)}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-black font-headline">Total paid</span>
              <span className="text-2xl font-black font-headline text-primary">{formatPriceINR(Number(order.total_amount) || 0)}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-primary-container p-6 md:p-8 rounded-2xl text-white">
            <h3 className="text-xl font-black font-headline mb-6">Next steps</h3>
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black shrink-0">1</div>
                <p className="text-sm opacity-95 leading-relaxed">Order verification &amp; inventory allocation</p>
              </div>
              <div className="flex gap-3 opacity-70">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black shrink-0">2</div>
                <p className="text-sm leading-relaxed">Quality check</p>
              </div>
              <div className="flex gap-3 opacity-70">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-black shrink-0">3</div>
                <p className="text-sm leading-relaxed">Dispatch &amp; tracking</p>
              </div>
            </div>
          </div>

          <Link
            href="/account/orders"
            className="flex w-full h-14 items-center justify-center gap-2 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow hover:opacity-90 transition-opacity"
          >
            Track order
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
          <Link
            href="/search"
            className="flex w-full h-14 items-center justify-center rounded-xl border-2 border-border font-black uppercase tracking-widest hover:bg-surface-container-low transition-colors"
          >
            Continue shopping
          </Link>

          <div className="bg-surface-container-high p-6 rounded-xl border border-border/20">
            <p className="text-sm font-bold text-on-surface mb-2">Need help?</p>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">Our support team can help with order changes or datasheets.</p>
            <Link href="/support" className="text-xs font-black text-primary flex items-center gap-1 hover:underline">
              Contact support
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

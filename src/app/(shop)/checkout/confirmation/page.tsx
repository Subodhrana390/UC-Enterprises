import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function ConfirmationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get latest order
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  const order = orders?.[0];

  if (!order) {
    redirect("/");
  }

  return (
    <main className="pt-10 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-16 h-16 text-[#008060] mx-auto mb-6" />
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-surface mb-4">
          Order Confirmed!
        </h1>
        <p className="text-on-surface-variant font-medium text-lg mb-8">
          Thank you for your order. We've received your request and will process it shortly.
        </p>

        <div className="bg-white border border-[#ebebeb] rounded-xl p-6 text-left mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Order #{order.id.toString().substring(0, 8)}</h2>
            <span className="px-3 py-1 bg-[#e3f1df] text-[#008060] text-sm font-medium rounded-full">
              {order.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#616161]">Payment Method</span>
              <span className="capitalize">{order.payment_method?.replace("_", " ") || "Pending"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#616161]">Payment Status</span>
              <span className="capitalize">{order.payment_status}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#1a1c1d] text-white font-medium rounded-lg hover:bg-[#303030] transition-colors"
          >
            View Order Details
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-[#d2d2d2] text-[#1a1c1d] font-medium rounded-lg hover:bg-[#f5f5f5] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
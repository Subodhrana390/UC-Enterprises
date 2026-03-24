import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPriceINR } from "@/lib/utils";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">My Orders</h1>
          <p className="text-sm text-gray-500">Check the status of your recent orders and track deliveries.</p>
        </div>
      </header>

      {/* Orders Table Container */}
      <Card className="rounded-xl border-gray-100 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Order Details</th>
                  <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Amount</th>
                  <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Shipping To</th>
                  <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                            <span className="material-symbols-outlined text-xl">package_2</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                          order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
                            'bg-orange-50 text-orange-700'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-gray-900">
                        {formatPriceINR(order.total_amount ?? 0)}
                      </td>
                      <td className="py-5 px-6 text-xs text-gray-500 font-medium">
                        Standard Delivery
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/account/orders/${order.id}`}>
                            <Button variant="ghost" className="h-9 px-4 text-xs font-medium text-gray-600 hover:text-black">
                              View Details
                            </Button>
                          </Link>
                          {order.tracking_number && (
                            <Link href={`https://tracking.example.com/${order.tracking_number}`} target="_blank">
                              <Button className="h-9 px-4 text-xs font-medium bg-black text-white hover:bg-gray-800 rounded-lg">
                                Track Order
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <span className="material-symbols-outlined text-5xl mb-3">receipt_long</span>
                        <p className="text-sm font-medium">You haven&apos;t placed any orders yet.</p>
                        <Link href="/shop" className="text-xs underline mt-2 hover:text-black">
                          Start Shopping
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Fetch orders with profile details
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(first_name, last_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Orders</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-9 text-xs">
            Export
          </Button>
          <Button className="bg-[#1a1c1d] text-white h-9 text-xs hover:bg-[#303030]">
            Create order
          </Button>
        </div>
      </div>

      {/* Shopify Tabs Segment */}
      <div className="bg-white border border-[#ebebeb] rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center px-4 border-b border-[#f1f1f1] gap-6">
          {["All", "Unfulfilled", "Unpaid", "Open", "Archived"].map((tab, i) => (
            <button
              key={tab}
              className={`py-3 text-xs font-medium transition-all border-b-2 ${
                i === 0 
                  ? "border-black text-black" 
                  : "border-transparent text-[#616161] hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter/Search Bar */}
        <div className="p-3 flex gap-2 border-b border-[#f1f1f1] bg-[#fafafa]">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#616161]">
              search
            </span>
            <input
              type="text"
              placeholder="Filter orders"
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#d2d2d2] rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-8 text-[11px]">
            Status
          </Button>
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-8 text-[11px]">
            Payment status
          </Button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider bg-[#fafafa] border-b border-[#f1f1f1]">
                <th className="px-6 py-3 w-10">
                  <input type="checkbox" className="rounded-sm border-[#d2d2d2]" />
                </th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Fulfillment</th>
                <th className="px-4 py-3">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {orders?.map((order: any) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-[#fafafa] cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded-sm border-[#d2d2d2]" />
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-[#1a1c1d] group-hover:underline">
                    #{order.id.toString().substring(0, 5).toUpperCase()}
                  </td>
                  <td className="px-4 py-4 text-xs text-[#616161]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-xs text-[#1a1c1d]">
                    {order.profiles?.first_name} {order.profiles?.last_name}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium">
                    ${order.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge type="payment" status={order.payment_status || 'paid'} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge type="fulfillment" status={order.status || 'unfulfilled'} />
                  </td>
                  <td className="px-4 py-4 text-xs text-[#616161]">
                    {order.item_count || 1} item
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Shopify-style Badges
function StatusBadge({ status, type }: { status: string; type: 'payment' | 'fulfillment' }) {
  const styles: any = {
    paid: "bg-[#e3f1df] text-[#008060]",
    unpaid: "bg-[#fff4da] text-[#8a6116]",
    unfulfilled: "bg-[#fff4da] text-[#8a6116]",
    completed: "bg-[#e3f1df] text-[#008060]",
    cancelled: "bg-[#f9eaea] text-[#8e1f0b]",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${styles[status] || styles.unpaid}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
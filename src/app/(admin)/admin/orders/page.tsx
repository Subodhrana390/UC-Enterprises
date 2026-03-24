import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { OrdersTableClient } from "@/components/admin/orders-table-client";

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        role,
        full_name
      ),
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        products (
          name,
          images
        )
      ),
      shipping_address:addresses(*)
    `)
    .order("created_at", { ascending: false });

  console.log(orders)

  return (
    <div className="min-h-screen bg-[#f6f6f7] p-6 space-y-4">
      <header className="flex justify-between items-center max-w-[1200px] mx-auto">
        <h1 className="text-xl font-bold text-[#202223]">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white border-[#babfc3] h-9 px-3 text-xs font-semibold text-[#202223]">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-[#008060] hover:bg-[#006e52] text-white h-9 px-3 text-xs font-semibold">
            <Plus className="w-4 h-4 mr-2" /> Create order
          </Button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto bg-white border border-[#ebebed] shadow-sm rounded-xl overflow-hidden">
        <OrdersTableClient initialOrders={orders || []} />
      </main>
    </div>
  );
}
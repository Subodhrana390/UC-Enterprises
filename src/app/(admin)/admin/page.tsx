import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Data Fetching
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profiles(first_name, last_name, company_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: allOrders } = await supabase.from("orders").select("total_amount");
  const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-8 text-[#1a1c1d]">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Simple Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-xl font-semibold text-[#1a1c1d]">Home</h1>
            <p className="text-sm text-[#616161]">Overview of your store's performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white border-[#d2d2d2] text-sm h-9 rounded-md px-4 shadow-sm">
              Customize
            </Button>
            <Button className="bg-[#1a1c1d] text-white text-sm h-9 rounded-md px-4 hover:bg-[#303030]">
              Export Report
            </Button>
          </div>
        </header>

        {/* Stats Grid: Clean & Boxy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} delta="+12%" />
          <StatsCard title="Total Orders" value={allOrders?.length || 0} delta="+5%" />
          <StatsCard title="Inventory SKU" value={totalProducts || 0} delta="0%" />
          <StatsCard title="Total Users" value={totalUsers || 0} delta="+2%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Ledger */}
          <Card className="lg:col-span-2 bg-white border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#f1f1f1] px-6 py-4">
              <CardTitle className="text-sm font-semibold">Recent Orders</CardTitle>
              <Link href="/admin/orders" className="text-xs font-medium text-blue-600 hover:underline">
                View all orders
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#f1f1f1]">
                {recentOrders?.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#fafafa] transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1c1d]">#{order.id.toString().substring(0, 5)}</span>
                      <span className="text-xs text-[#616161]">{order.profiles?.company_name || "Guest Customer"}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-sm font-medium">₹{order.total_amount?.toLocaleString()}</span>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                          <span className="text-[11px] text-[#616161] capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System & Marketing Activity */}
          <div className="space-y-6">
            <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl">
              <CardHeader className="px-6 py-4 border-b border-[#f1f1f1]">
                <CardTitle className="text-sm font-semibold">Store Status</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 space-y-4">
                <StatusItem label="Online Store" status="Active" />
                <StatusItem label="Inventory Sync" status="Pending" />
                <StatusItem label="API Connections" status="Active" />
              </CardContent>
            </Card>

            <div className="p-6 bg-[#1a1c1d] rounded-xl text-white">
              <h4 className="text-sm font-semibold mb-2">Inventory Alert</h4>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                45 SKUs in the "Microcontrollers" category are running below threshold.
              </p>
              <Button variant="link" className="text-white p-0 h-auto text-xs font-semibold hover:no-underline underline-offset-4 decoration-white/30 underline">
                Manage Stock →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, delta }: { title: string, value: string | number, delta: string }) {
  return (
    <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl hover:border-[#d2d2d2] transition-colors">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-[#616161] mb-2">{title}</p>
        <div className="flex items-baseline justify-between">
          <p className="text-xl font-semibold text-[#1a1c1d]">{value}</p>
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {delta}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusItem({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#616161]">{label}</span>
      <span className={`text-xs font-medium ${status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
        {status}
      </span>
    </div>
  );
}
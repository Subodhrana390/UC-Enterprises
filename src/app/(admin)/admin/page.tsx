import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Users, ShoppingBag, IndianRupee } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id, 
      status,
      total_amount,
      profiles:user_id (
        full_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: allOrders } = await supabase.from("orders").select("total_amount");
  const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  return (
    <div className="min-h-screen p-6 md:p-10 font-sans text-[#202223]">
      <div className="max-w-[1024px] mx-auto space-y-5">

        {/* Shopify Style Header */}
        <header className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#202223]">Home</h1>
            <p className="text-sm text-[#6d7175]">Here's what's happening with your store today.</p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} delta="+12%" icon={<IndianRupee size={16} />} />
          <StatsCard title="Orders" value={allOrders?.length || 0} delta="+5%" icon={<ShoppingBag size={16} />} />
          <StatsCard title="Products" value={totalProducts || 0} delta="0%" icon={<Package size={16} />} />
          <StatsCard title="Customers" value={totalUsers || 0} delta="+2%" icon={<Users size={16} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="bg-white border-[#ebebed] shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#f1f1f1] px-5 py-4">
                <CardTitle className="text-[14px] font-semibold">Recent Orders</CardTitle>
                <Link href="/admin/orders" className="text-xs font-semibold text-[#005bd3] hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[12px] text-[#6d7175] border-b border-[#f1f1f1] bg-[#fafafa]">
                        <th className="px-5 py-3 font-medium">Order</th>
                        <th className="px-5 py-3 font-medium">Customer</th>
                        <th className="px-5 py-3 font-medium text-right">Total</th>
                        <th className="px-5 py-3 font-medium text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f1f1]">
                      {recentOrders?.map((order: any) => (
                        <tr key={order.id} className="hover:bg-[#f6f6f7] transition-colors cursor-pointer group">
                          <td className="px-5 py-3 text-sm font-medium text-[#202223]">#{order.id.toString().substring(0, 5)}</td>
                          <td className="px-5 py-3 text-sm text-[#6d7175]">{order.profiles?.full_name || "Guest"}</td>
                          <td className="px-5 py-3 text-sm text-right font-medium">₹{order.total_amount?.toLocaleString()}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${order.status === 'delivered' ? 'bg-[#e3f1df] text-[#005e4d]' : 'bg-[#fff4e5] text-[#8a6116]'
                              }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-5">
            <Card className="bg-white border-[#ebebed] shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-xl">
              <CardHeader className="px-5 py-4 border-b border-[#f1f1f1]">
                <CardTitle className="text-[14px] font-semibold">Store Status</CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-4 space-y-4">
                <StatusItem label="Online Store" status="Active" />
                <StatusItem label="Inventory Sync" status="Pending" />
                <StatusItem label="API Connections" status="Active" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, delta, icon }: { title: string, value: string | number, delta: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-white border-[#ebebed] shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-xl group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-[#f6f6f7] rounded-md text-[#6d7175]">
            {icon}
          </div>
          <span className="text-[11px] font-bold text-[#008060] bg-[#e3f1df] px-1.5 py-0.5 rounded">
            {delta}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium text-[#6d7175]">{title}</p>
          <p className="text-lg font-bold text-[#202223] mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusItem({ label, status }: { label: string, status: string }) {
  const isActive = status === 'Active';
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#6d7175]">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#008060]' : 'bg-[#e4b200]'}`} />
        <span className="text-xs font-medium text-[#202223]">{status}</span>
      </div>
    </div>
  );
}
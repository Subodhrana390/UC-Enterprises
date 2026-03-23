import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatPriceINR } from "@/lib/utils";

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Data fetching (keep your existing logic)
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: orders } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
  const { count: wishlistCount } = await supabase.from("wishlist_items").select("*", { count: 'exact', head: true }).eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Shopify Page Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1a1c1d]">Account</h1>
            <p className="text-sm text-[#616161]">Welcome back, {profile?.full_name || user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-[#d2d2d2] text-sm font-medium h-9 shadow-sm">
              Support history
            </Button>
          </div>
        </header>

        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Orders" value={orders?.length || 0} icon="package_2" />
          <StatCard label="Wishlist" value={wishlistCount || 0} icon="favorite" />
          <StatCard label="Account type" value={profile?.account_type === 'business' ? 'Enterprise' : 'Personal'} icon="person" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content: Recent Orders */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[#ebebeb] shadow-sm rounded-xl bg-white overflow-hidden">
              <CardHeader className="p-5 border-b border-[#f1f1f1] flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#1a1c1d]">Recent orders</CardTitle>
                <Link href="/account/orders" className="text-sm font-medium text-[#005bd3] hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {orders && orders.length > 0 ? (
                  <div className="divide-y divide-[#f1f1f1]">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-[#f9f9f9] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md bg-[#f1f1f1] flex items-center justify-center text-[#616161]">
                            <span className="material-symbols-outlined text-xl">inventory_2</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1a1c1d]">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-xs text-[#616161]">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#1a1c1d]">{formatPriceINR(order.total_amount ?? 0)}</p>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'bg-[#e3f1df] text-[#008060]' : 'bg-[#eaf4fe] text-[#005bd3]'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-sm text-[#616161]">No orders placed yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Account Overview */}
          <div className="space-y-6">
            <Card className="border-[#ebebeb] shadow-sm rounded-xl bg-white">
              <CardHeader className="p-5 border-b border-[#f1f1f1]">
                <CardTitle className="text-sm font-semibold text-[#1a1c1d]">Account overview</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-[#616161] uppercase font-medium tracking-wider">Email</p>
                  <p className="text-sm text-[#1a1c1d]">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#616161] uppercase font-medium tracking-wider">Default address</p>
                  <p className="text-sm text-[#1a1c1d]">No address on file</p>
                </div>
                <Link href="/account/profile">
                  <Button variant="link" className="p-0 h-auto text-[#005bd3] text-sm">Edit profile</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-3">
              <QuickLink label="Settings" icon="settings" href="/account/settings" />
              <QuickLink label="Addresses" icon="map" href="/account/addresses" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <Card className="border-[#ebebeb] shadow-sm rounded-xl bg-white">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2 rounded-md bg-[#f1f1f1] text-[#616161]">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs text-[#616161] font-medium uppercase tracking-tight">{label}</p>
          <p className="text-xl font-semibold text-[#1a1c1d]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({ label, icon, href }: any) {
  return (
    <Link href={href}>
      <div className="p-4 bg-white border border-[#ebebeb] rounded-xl hover:bg-[#f9f9f9] transition-all flex items-center justify-between group shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#616161] text-xl">{icon}</span>
          <span className="text-sm font-medium text-[#1a1c1d]">{label}</span>
        </div>
        <span className="material-symbols-outlined text-[#d2d2d2] group-hover:text-[#616161] transition-colors">chevron_right</span>
      </div>
    </Link>
  );
}
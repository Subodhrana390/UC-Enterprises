import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profiles(first_name, last_name, company_name)")
    .order("created_at", { ascending: false })
    .limit(4);

  // Fetch stats (simplified aggregation)
  const { data: allOrders } = await supabase.from("orders").select("total_amount");
  const totalRevenue = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
  
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });

  return (
    <div className="p-8 space-y-10">
      <header>
        <h1 className="text-5xl font-black font-headline tracking-tighter uppercase mb-2">Command Center</h1>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Operational Overview & Intelligence</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} delta="Real-time" icon="payments" color="text-emerald-500" />
        <StatsCard title="Total Orders" value={allOrders?.length || 0} delta="Real-time" icon="receipt_long" color="text-amber-500" />
        <StatsCard title="Inventory SKU" value={totalProducts || 0} delta="Real-time" icon="inventory_2" color="text-blue-500" />
        <StatsCard title="Registered Users" value={totalUsers || 0} delta="Real-time" icon="group" color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-border/10">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Recent Manifests & Orders</CardTitle>
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary">View Logistics Ledger</Button>
          </CardHeader>
          <CardContent className="pt-8">
             <div className="space-y-6">
                {recentOrders && recentOrders.length > 0 ? recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low/50 hover:bg-white transition-colors border border-transparent hover:border-border/40">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">receipt_long</span>
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase">Order #{order.id.toString().substring(0, 8)}</p>
                            <p className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold tracking-widest">Client: {order.profiles?.company_name || `${order.profiles?.first_name} ${order.profiles?.last_name}` || "Independent"}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-sm">${order.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>{order.status}</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-10 text-center opacity-40">
                    <p className="text-xs font-black uppercase tracking-widest">No recent logistics activity detected.</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
            <CardHeader className="pb-8 border-b border-border/10">
                <CardTitle className="text-xl font-black uppercase tracking-tight">System Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
                <div className="space-y-4">
                   <SystemIndicator label="Primary API Cluster" status="Optimal" />
                   <SystemIndicator label="Supply Chain Connector" status="Warning" />
                   <SystemIndicator label="Fabrication Queue" status="Optimal" />
                   <SystemIndicator label="Auth & Encryption" status="Optimal" />
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl text-white">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cloud Infrastructure</p>
                    <p className="text-xs font-bold leading-relaxed mb-4">Instance US-West-4 reporting high throughput on Search Indexing.</p>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[78%]"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, delta, icon, color }: any) {
  return (
    <Card className="rounded-[24px] border-border/40 bg-white/50 backdrop-blur-xl hover:shadow-xl transition-all group overflow-hidden relative">
        <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-surface/50 border border-border/10 ${color} group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${delta.startsWith('+') ? 'text-emerald-500' : delta.startsWith('-') ? 'text-rose-500' : 'text-blue-500'}`}>
                    {delta}
                </span>
            </div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-40">{title}</p>
            <p className="text-2xl font-black tracking-tighter uppercase">{value}</p>
        </CardContent>
    </Card>
  );
}

function SystemIndicator({ label, status }: any) {
  return (
    <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{label}</span>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'Optimal' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
            <span className={`text-[9px] font-black uppercase ${status === 'Optimal' ? 'text-emerald-600' : 'text-amber-600'}`}>{status}</span>
        </div>
    </div>
  )
}

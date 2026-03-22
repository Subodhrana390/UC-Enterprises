import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch account stats and recent orders
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { count: wishlistCount } = await supabase
    .from("wishlist")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user.id);

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black font-headline tracking-tighter uppercase mb-2">My Account</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Engineering the Future, One Component at a Time</p>
        </div>
        <div className="flex gap-4">
             <Button variant="outline" className="h-12 px-6 rounded-xl border-border/40 font-black text-[10px] uppercase tracking-widest hover:bg-white text-on-surface">
                Support History
             </Button>
             <Link href="/cart">
                <Button className="h-12 px-6 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    View Shopping Basket
                </Button>
             </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AccountStat label="Active Shipments" value={orders?.filter(o => o.status === 'shipping').length || 0} icon="local_shipping" color="text-blue-500" />
        <AccountStat label="Saved Components" value={wishlistCount || 0} icon="favorite" color="text-rose-500" />
        <AccountStat label="Reviews Authored" value={reviewsCount || 0} icon="rate_review" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-8 border-b border-border/10">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Recent Orders</CardTitle>
            <Link href="/account/orders">
                <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary">View Full History</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-8">
             <div className="space-y-4">
                {orders && orders.length > 0 ? orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-low/50 hover:bg-white transition-all border border-transparent hover:border-border/40 group">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-xl bg-white border border-border/10 flex items-center justify-center text-on-surface shadow-sm group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">package_2</span>
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold tracking-widest">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-sm">${order.total_amount?.toLocaleString()}</p>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                          order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                        }`}>{order.status}</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-10 text-center space-y-4 opacity-40">
                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No recent procurement activity found</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="rounded-[32px] border-border/40 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
                <CardContent className="p-10 space-y-6">
                   <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Prime Procurement</p>
                            <h3 className="text-3xl font-black font-headline uppercase leading-none">{profile?.account_type === 'business' ? 'Enterprise Strategic Partner' : 'Standard Engineering Account'}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <span className="material-symbols-outlined text-amber-500">verified</span>
                        </div>
                   </div>
                   <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                            <span>Account Verification</span>
                            <span>{profile ? '100%' : '0%'}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] ${profile ? 'w-full' : 'w-0'}`}></div>
                        </div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                      ACCESS ADVANCED ANALYTICS AND VOLUME REBATES BY COMPLETING YOUR ENGINEERING IDENTITY PROFILE.
                   </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
                <QuickLink label="Technical Support" icon="contact_support" href="/support" />
                <QuickLink label="Manage Identity" icon="person_edit" href="/account/profile" />
            </div>
        </div>
      </div>
    </div>
  );
}

function AccountStat({ label, value, icon, color }: any) {
  return (
    <Card className="rounded-[24px] border-border/40 bg-white/50 backdrop-blur-xl hover:bg-white transition-all group shadow-xl shadow-primary/5">
        <CardContent className="p-6 flex items-center gap-6">
            <div className={`p-4 rounded-2xl bg-surface border border-border/10 ${color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-40">{label}</p>
                <p className="text-2xl font-black tracking-tighter uppercase">{value}</p>
            </div>
        </CardContent>
    </Card>
  );
}

function QuickLink({ label, icon, href }: any) {
  return (
    <Link href={href}>
        <div className="p-6 rounded-[24px] border border-border/40 bg-white/50 backdrop-blur-xl hover:bg-white hover:shadow-xl transition-all flex flex-col items-center gap-4 group">
            <div className="p-3 rounded-xl bg-surface group-hover:bg-primary group-hover:text-white transition-all border border-border/10">
                <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">{label}</span>
        </div>
    </Link>
  )
}

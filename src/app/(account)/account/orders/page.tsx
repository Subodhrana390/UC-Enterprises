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
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Procurement History</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Archival record of your engineering component acquisitions and logistics</p>
        </div>
        <Link href="/account/orders?export=tax">
          <Button variant="outline" className="h-12 px-8 rounded-xl border-border/40 font-black text-[10px] uppercase tracking-widest hover:bg-white">
            Generate Tax Manifest
          </Button>
        </Link>
      </header>

      <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <CardContent className="p-8">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border/10">
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Deployment Identity</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Status Registry</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Valuation</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Logistics Node</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 text-right">Fulfillment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5">
                        {orders && orders.length > 0 ? orders.map((order) => (
                            <tr key={order.id} className="group hover:bg-white transition-all">
                                <td className="py-6 pr-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-border/10 flex items-center justify-center text-on-surface shadow-sm group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">package_2</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase">Order #{order.id.substring(0, 8)}</p>
                                            <p className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold tracking-widest">Ordered: {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-6">
                                    <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                                        order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 
                                        order.status === 'shipping' ? 'bg-blue-500/10 text-blue-600' : 
                                        'bg-amber-500/10 text-amber-600'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-6 px-6 font-black text-xs tracking-tight">{formatPriceINR(order.total_amount ?? 0)}</td>
                                <td className="py-6 px-6 text-[10px] font-black text-on-surface-variant opacity-60 uppercase tracking-widest">Global Distribution Center</td>
                                <td className="py-6 pl-6 text-right">
                                    <Link href={order.tracking_number ? `https://tracking.example.com/${order.tracking_number}` : "/support"}>
                                        <Button variant="ghost" className="rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-10 px-6">
                                            Trace Shipment
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="py-20 text-center opacity-30">
                              <span className="material-symbols-outlined text-4xl mb-4 block">receipt_long</span>
                              <p className="text-[10px] font-black uppercase tracking-widest">No procurement records found</p>
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

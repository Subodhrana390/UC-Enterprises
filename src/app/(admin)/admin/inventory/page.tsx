import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function InventoryManagementPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, brands(name)")
    .order("stock_quantity", { ascending: true });

  const lowStockThreshold = 100;
  const criticalStockThreshold = 10;

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Strategic Inventory</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Real-time logistics monitoring and supply chain governance</p>
        </div>
        <div className="flex items-center gap-6 pb-2">
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Stock Health</p>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-tighter">System Stabilized</p>
            </div>
            <div className="w-px h-10 bg-border/20"></div>
            <Button className="h-12 px-8 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">
                Generate Manifest
            </Button>
        </div>
      </header>

      <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <CardContent className="p-8">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border/10">
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Logistics Identity</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 uppercase tracking-widest">Reserve Levels</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Status Registry</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Valuation (Unit)</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 text-right">Fulfillment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5">
                        {products?.map((product) => (
                            <tr key={product.id} className="group hover:bg-white transition-all">
                                <td className="py-6 pr-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-border/10 flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                            <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase tracking-tight">{product.name}</p>
                                            <p className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold tracking-widest">SKU: {product.sku} | MFR: {(product.brands as any)?.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="font-black text-xs">{product.stock_quantity.toLocaleString()} Units</span>
                                            <span className="text-[9px] font-black opacity-30 uppercase tracking-tighter">MAX: 200,000</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${product.stock_quantity < criticalStockThreshold ? "bg-rose-500" : product.stock_quantity < lowStockThreshold ? "bg-amber-500" : "bg-primary"}`}
                                                style={{ width: `${Math.min((product.stock_quantity / 200000) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-6">
                                    <Badge className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none ${
                                        product.stock_quantity === 0 
                                            ? "bg-rose-500/10 text-rose-600" 
                                            : product.stock_quantity < criticalStockThreshold 
                                                ? "bg-orange-500/10 text-orange-600 animate-pulse" 
                                                : "bg-emerald-500/10 text-emerald-600"
                                    }`}>
                                        {product.stock_quantity === 0 ? "Depleted" : product.stock_quantity < criticalStockThreshold ? "Critical Level" : "Optimal Stock"}
                                    </Badge>
                                </td>
                                <td className="py-6 px-6 font-black text-xs tracking-tight">${product.base_price.toLocaleString()}</td>
                                <td className="py-6 pl-6 text-right">
                                    <Button variant="ghost" className="rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-10 px-6">
                                        Adjust Reserve
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

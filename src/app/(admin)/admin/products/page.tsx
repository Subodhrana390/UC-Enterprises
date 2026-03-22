import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductDeleteButton } from "@/components/admin/ProductActions";

export default async function ProductManagementPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, brands(name), categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Product Catalog</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Manage your industrial component manifest and technical specifications</p>
        </div>
        <div className="flex gap-4">
            <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 group-focus-within:opacity-100 transition-opacity">search</span>
                <Input placeholder="Search Catalog..." className="h-12 w-64 pl-12 rounded-xl bg-white/50 border-border/40 font-black text-[11px] uppercase tracking-widest" />
            </div>
            <Button className="h-12 px-8 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Register New Component
            </Button>
        </div>
      </header>

      <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
        <CardContent className="p-8">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border/10">
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Component Identity</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Manufacturer</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Taxonomy</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Valuation</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Reserve</th>
                            <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/5">
                        {products?.map((product) => (
                            <tr key={product.id} className="group hover:bg-white transition-all">
                                <td className="py-6 pr-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-border/10 flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                                            <span className="material-symbols-outlined text-on-surface-variant">memory</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase tracking-tight">{product.name}</p>
                                            <p className="text-[10px] text-on-surface-variant opacity-60 uppercase font-bold tracking-widest">SKU: {product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-6 font-black text-xs uppercase tracking-widest text-on-surface-variant">{(product.brands as any)?.name}</td>
                                <td className="py-6 px-6">
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-surface border border-border/10 font-black uppercase tracking-tighter text-on-surface-variant group-hover:bg-primary group-hover:text-white group-hover:border-transparent transition-all">
                                        {(product.categories as any)?.name}
                                    </span>
                                </td>
                                <td className="py-6 px-6 font-black text-xs tracking-tight">${product.base_price.toLocaleString()}</td>
                                <td className="py-6 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${product.stock_quantity < 10 ? "bg-rose-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}></div>
                                        <span className={`font-black text-xs ${product.stock_quantity < 10 ? "text-rose-600" : "text-emerald-600"}`}>{product.stock_quantity} Units</span>
                                    </div>
                                </td>
                                <td className="py-6 pl-6 text-right">
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </Button>
                                    <ProductDeleteButton productId={product.id} />
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

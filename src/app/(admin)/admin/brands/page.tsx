import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function BrandManagementPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*, products(count)")
    .order("name");

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Brand Ecosystem</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Manage your manufacturer partnerships and brand identity</p>
        </div>
        <Button className="h-12 px-8 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          Register New Manufacturer
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {brands?.map((brand) => (
          <Card key={brand.id} className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 hover:border-primary/20 transition-all group p-8">
            <CardContent className="p-0 space-y-6">
              <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-2xl bg-surface border border-border/10 flex items-center justify-center font-black text-xl text-primary uppercase tracking-tighter group-hover:bg-primary group-hover:text-white transition-all">
                    {brand.name.substring(0, 2)}
                  </div>
                  {brand.is_featured && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Tier 1 Strategic
                    </span>
                  )}
              </div>
              
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{brand.name}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed opacity-60">
                  {brand.description || "No strategic description provided for this manufacturer."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/10">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Active SKUs</span>
                    <span className="font-black text-lg">{(brand.products as any)?.[0]?.count || 0} Components</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-lg">edit</span>
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

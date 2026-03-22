import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CategoryManagementPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("name");

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Taxonomy Control</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Manage your component categorization and technical families</p>
        </div>
        <Button className="h-12 px-8 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          Register New Category
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories?.map((category) => (
          <Card key={category.id} className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 hover:border-primary/20 transition-all group overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-surface border border-border/10 text-on-surface-variant group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined text-2xl">{category.icon || 'inventory_2'}</span>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-600">
                    Active
                  </span>
              </div>
              
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">{category.name}</h3>
                <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{(category.products as any)?.[0]?.count || 0} Registered Components</p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border/10">
                <Button variant="ghost" className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-10">Expand</Button>
                <Button variant="ghost" className="flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface h-10">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

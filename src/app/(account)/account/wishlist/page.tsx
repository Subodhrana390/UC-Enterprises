import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatPriceINR } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WishlistRemoveButton, WishlistAddToCartButton } from "@/components/account/WishlistItemActions";

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select("*, products(*, brands(name))")
    .eq("user_id", user.id);

  return (
    <main className="p-8 lg:p-12 overflow-y-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black font-headline text-on-surface tracking-tighter uppercase leading-none mb-4">Wishlist</h1>
        <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-60 max-w-2xl leading-relaxed">
          Manage your saved high-performance components and technical assets. These items are ready for your next architectural prototype.
        </p>
      </header>

      {/* Wishlist Stats / Filter Bar */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="bg-white rounded-[32px] p-8 flex-1 flex items-center justify-between border border-border/40 shadow-xl shadow-primary/5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-60 mb-2">Saved Manifests</p>
            <p className="text-4xl font-black font-headline tracking-tighter">{wishlistItems?.length || 0} <span className="text-xs font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">/ 50 limit</span></p>
          </div>
          <span className="material-symbols-outlined text-5xl text-primary opacity-10">inventory_2</span>
        </div>
        <div className="bg-surface rounded-[32px] p-8 flex-[1.5] flex items-center gap-8 border border-border/20 shadow-inner">
          <div className="flex-1">
            <div className="relative">
              <Input 
                className="w-full h-14 bg-white border-none rounded-2xl pl-14 pr-6 text-sm font-bold uppercase tracking-tight focus:ring-primary shadow-sm" 
                placeholder="Search saved artifacts..." 
              />
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 text-2xl">search</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="h-14 w-14 bg-white rounded-2xl border-none shadow-sm hover:scale-105 transition-all">
              <span className="material-symbols-outlined">filter_list</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Grid of Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {wishlistItems && wishlistItems.length > 0 ? wishlistItems.map((item: any, i) => (
          <div key={i} className="group bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-primary/5 border border-border/40 hover:border-primary/20 transition-all duration-500">
            <div className="relative h-72 bg-surface overflow-hidden p-8 shadow-inner">
              <Image 
                src={item.products?.images?.[0] || ""} 
                alt={item.products?.name} 
                fill 
                className="object-contain p-12 transition-transform duration-700 group-hover:scale-110 grayscale-[0.2]" 
              />
              <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-border/20 shadow-sm">
                <div className={`w-2.5 h-2.5 rounded-full ${item.products?.stock_quantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div>
                <span className="text-[9px] font-black text-on-surface uppercase tracking-widest">{item.products?.stock_quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}</span>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="text-[9px] font-black font-mono border-primary/20 text-primary py-0 px-2 uppercase shadow-sm">{item.products?.sku}</Badge>
                <WishlistRemoveButton wishlistItemId={item.id} />
              </div>
              <h3 className="text-xl font-black font-headline mb-3 group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">{item.products?.name}</h3>
              <p className="text-[11px] text-on-surface-variant font-bold leading-relaxed mb-10 opacity-60 uppercase tracking-widest line-clamp-2">
                {item.products?.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/10">
                <div>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Unit Value</p>
                  <p className="text-3xl font-black font-headline text-on-surface font-headline tracking-tighter">{formatPriceINR(item.products?.base_price ?? 0)}</p>
                </div>
                <WishlistAddToCartButton wishlistItemId={item.id} />
              </div>
            </div>
          </div>
        )) : (
            <div className="lg:col-span-3 py-20 text-center space-y-4 opacity-30">
                <span className="material-symbols-outlined text-6xl">favorite</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Your wishlist is currently empty of technical manifestations</p>
            </div>
        )}
      </div>

      {/* Promotional Section */}
      <section className="mt-24 bg-primary text-white rounded-[50px] p-12 md:p-16 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative border-b-[16px] border-blue-950 shadow-2xl">
        <div className="flex-1 relative z-10">
          <Badge className="bg-blue-600 text-white mb-10 border-none px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em]">Global Logistics Integration</Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline text-white mb-6 uppercase tracking-tighter leading-none">Engineering Precision, Delivered Worldwide</h2>
          <p className="text-sm font-medium leading-relaxed opacity-60 max-w-xl uppercase tracking-widest mb-12">
            UCEnterprises partners with top-tier silicon foundries to ensure that every component in your wishlist meets or exceeds ISO standards for reliability.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-white text-primary h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
              Download Technical Specifications
            </Button>
            <Button variant="outline" className="border-2 border-white/20 h-14 px-10 rounded-2xl font-black text-xs text-white uppercase tracking-widest hover:bg-white/5 transition-all">
              Support Protocol
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

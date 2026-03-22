"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { formatPriceINR } from "@/lib/utils";

export function SearchClient({ initialProducts, totalCount, query }: { initialProducts: any[], totalCount: number, query: string }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-10 pb-20 px-8 max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-12">
          <div className="pb-6 border-b border-border/10">
            <h2 className="text-2xl font-black font-headline tracking-tighter flex items-center gap-3 uppercase">
              <span className="material-symbols-outlined text-primary text-3xl">filter_list</span>
              Parametric Filters
            </h2>
          </div>

          <FilterSection title="Manifest Category">
            <div className="space-y-4">
               <FilterCheckbox label="Microcontrollers" checked={searchParams.get('category') === 'microcontrollers'} onChange={() => updateFilter('category', 'microcontrollers')} />
               <FilterCheckbox label="Sensors" checked={searchParams.get('category') === 'sensors'} onChange={() => updateFilter('category', 'sensors')} />
            </div>
          </FilterSection>

          <FilterSection title="Manufacturer">
            <div className="space-y-4">
              {["STMicroelectronics", "Texas Instruments", "Espressif"].map((m) => (
                <FilterCheckbox 
                  key={m} 
                  label={m} 
                  checked={searchParams.get('manufacturer') === m} 
                  onChange={() => updateFilter('manufacturer', (searchParams.get('manufacturer') === m) ? '' : m)}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Procurement Range (₹)">
            <div className="space-y-8 px-2">
              <div className="flex items-center gap-4">
                <Input 
                   className="h-10 bg-white border-border/40 rounded-xl text-[10px] font-black text-center" 
                   placeholder="MIN" 
                   onBlur={(e) => updateFilter('minPrice', e.target.value)}
                />
                <span className="text-on-surface-variant opacity-20">—</span>
                <Input 
                   className="h-10 bg-white border-border/40 rounded-xl text-[10px] font-black text-center" 
                   placeholder="MAX" 
                   onBlur={(e) => updateFilter('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </FilterSection>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow">
          {/* Header/Breadcrumb Area */}
          <header className={`mb-12 ${isPending ? 'opacity-50' : ''} transition-opacity`}>
            <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-6 opacity-40">
              <Link href="/">Home</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary">Search Results</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase leading-none">Discovery: "{query || 'All Components'}"</h1>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.25em] opacity-60">
              {totalCount} components matching your architectural criteria.
            </p>
          </header>

          {/* Sorting & Tools */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white p-6 rounded-[32px] border border-border/40 shadow-xl shadow-primary/5 gap-6">
            <div className="flex bg-surface p-1.5 rounded-2xl border border-border/10">
              <button 
                onClick={() => setView("grid")}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === "grid" ? "bg-white text-primary shadow-lg" : "text-on-surface-variant opacity-40 hover:opacity-100"}`}
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                Matrix
              </button>
              <button 
                onClick={() => setView("list")}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === "list" ? "bg-white text-primary shadow-lg" : "text-on-surface-variant opacity-40 hover:opacity-100"}`}
              >
                <span className="material-symbols-outlined text-sm">list</span>
                Ledger
              </button>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Prioritize:</span>
              <Select defaultValue="relevant" onValueChange={(v) => updateFilter('sort', v ?? '')}>
                <SelectTrigger className="w-56 h-12 bg-surface border-none rounded-xl px-6 font-black uppercase tracking-tight text-[11px] focus:ring-primary shadow-inner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/40 font-black uppercase tracking-tight text-[10px]">
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="price-low">Value: Low to High</SelectItem>
                  <SelectItem value="stock-high">Inventory: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className={`${view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" : "flex flex-col gap-6"} ${isPending ? 'grayscale' : ''}`}>
            {initialProducts.map((item) => (
              <div key={item.id} className="group bg-white rounded-[40px] p-8 transition-all hover:shadow-2xl hover:shadow-primary/10 border border-border/40 hover:border-primary/20 relative flex flex-col">
                <Link href={`/products/${item.id}`} className="block flex-grow">
                <div className="relative mb-8 aspect-square bg-surface rounded-[32px] overflow-hidden flex items-center justify-center shadow-inner group-hover:bg-white transition-all">
                  <Image 
                    src={item.images?.[0] || "/placeholder-product.png"} 
                    alt={item.name} 
                    fill 
                    className="object-contain p-10 transition-transform duration-700 group-hover:scale-110 grayscale-[0.2]" 
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{item.brands?.name}</p>
                    <div className="flex items-center gap-1.5 bg-yellow-400/10 px-2 py-0.5 rounded-lg border border-yellow-400/20">
                      <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-[10px] font-black text-amber-600">{item.rating || 0}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black font-headline leading-tight tracking-tight uppercase mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-6">Manifest: {item.sku}</p>
                </div>
                </Link>

                <div className="mt-auto">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mb-1">Unit Inception</p>
                      <p className="text-3xl font-black font-headline text-on-surface tracking-tighter">{formatPriceINR(item.base_price || 0)}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                          (item.stock_quantity || 0) > 0 ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            (item.stock_quantity || 0) > 0 ? "bg-emerald-500" : "bg-red-500 animate-pulse"
                          } shadow-[0_0_8px_currentColor]`}
                        ></div>
                        {(item.stock_quantity || 0) > 0 ? "In stock" : "Out of stock"}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href={`/products/${item.id}`} className="w-full">
                        <Button variant="outline" className="w-full h-14 border-2 border-border/40 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:border-primary hover:bg-white transition-all shadow-sm">
                        View Details
                        </Button>
                    </Link>
                    <AddToCartButton productId={item.id} className="h-14 bg-primary text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">shopping_cart</span>
                      Procure
                    </AddToCartButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant opacity-40 mb-2">{title}</h3>
      {children}
    </section>
  );
}

function FilterCheckbox({ label, checked = false, onChange }: { label: string; checked?: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center gap-4 text-[11px] font-black uppercase tracking-tight cursor-pointer group hover:text-primary transition-colors">
      <Checkbox checked={checked} onCheckedChange={onChange} className="rounded-md border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5" />
      <span className="group-hover:translate-x-1 transition-transform">{label}</span>
    </label>
  );
}

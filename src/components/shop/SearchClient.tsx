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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { formatPriceINR } from "@/lib/utils";

export function SearchClient({ initialProducts, totalCount, query }: { initialProducts: any[], totalCount: number, query: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    
    startTransition(() => {
      router.push(`/search?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12">
        
        {/* Shopify Sidebar: Clean & Minimal */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
          <div className="pb-4 border-b border-[#ebebeb]">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#1a1c1d]">Filters</h2>
          </div>

          <FilterSection title="Category">
            <div className="space-y-3">
               <FilterCheckbox label="Microcontrollers" checked={searchParams.get('category') === 'microcontrollers'} onChange={() => updateFilter('category', 'microcontrollers')} />
               <FilterCheckbox label="Sensors" checked={searchParams.get('category') === 'sensors'} onChange={() => updateFilter('category', 'sensors')} />
            </div>
          </FilterSection>

          <FilterSection title="Availability">
            <div className="space-y-3">
               <FilterCheckbox label="In stock" checked={searchParams.get('stock') === 'true'} onChange={() => updateFilter('stock', 'true')} />
               <FilterCheckbox label="Out of stock" checked={searchParams.get('stock') === 'false'} onChange={() => updateFilter('stock', 'false')} />
            </div>
          </FilterSection>

          <FilterSection title="Price Range">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#616161]">₹</span>
                <Input 
                   className="h-10 pl-7 bg-white border-[#d2d2d2] rounded-sm text-sm" 
                   placeholder="From" 
                   onBlur={(e) => updateFilter('minPrice', e.target.value)}
                />
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-[#616161]">₹</span>
                <Input 
                   className="h-10 pl-7 bg-white border-[#d2d2d2] rounded-sm text-sm" 
                   placeholder="To" 
                   onBlur={(e) => updateFilter('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </FilterSection>
        </aside>

        {/* Results Area */}
        <div className="flex-grow">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-[#ebebeb] gap-4">
            <p className="text-sm text-[#616161]">
              {totalCount} products found
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#1a1c1d]">Sort by:</span>
              <Select defaultValue="relevant" onValueChange={(v) => updateFilter('sort', v)}>
                <SelectTrigger className="w-48 h-10 border-[#ebebeb] rounded-sm text-sm focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid: Minimal Cards */}
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 ${isPending ? 'opacity-50' : ''} transition-opacity`}>
            {initialProducts.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <Link href={`/products/${item.id}`}>
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] bg-[#f5f5f5] rounded-lg overflow-hidden mb-4 border border-[#ebebeb]">
                    <Image 
                      src={item.images?.[0] || "/placeholder.png"} 
                      alt={item.name} 
                      fill 
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105" 
                    />
                    {item.stock_quantity === 0 && (
                      <Badge className="absolute top-3 left-3 bg-white text-[#1a1c1d] border-[#ebebeb] font-medium text-[10px] uppercase shadow-sm">
                        Sold Out
                      </Badge>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-1">
                    <p className="text-[11px] text-[#616161] uppercase tracking-wider">{item.brands?.name}</p>
                    <h3 className="text-sm font-medium text-[#1a1c1d] group-hover:underline underline-offset-4 decoration-1">
                      {item.name}
                    </h3>
                    <div className="pt-1">
                      <p className="text-sm font-semibold">{formatPriceINR(item.base_price || 0)}</p>
                    </div>
                  </div>
                </Link>
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
    <div className="space-y-4">
      <h3 className="text-sm font-medium border-b border-[#f5f5f5] pb-2">{title}</h3>
      {children}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean, onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 text-sm text-[#303030] cursor-pointer hover:text-black">
      <Checkbox checked={checked} onCheckedChange={onChange} className="rounded-sm border-[#d2d2d2] h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
}

interface CategorySelectorProps {
  categories: Category[];
}

export default function CategorySelector({ categories }: CategorySelectorProps) {
  const router = useRouter();
  const [selectedMain, setSelectedMain] = useState<string>("");
  const [selectedSub, setSelectedSub] = useState<string>("");

  const mainCategories = categories.filter(c => !c.parent_id);
  const subCategories = categories.filter(c => c.parent_id === selectedMain);

  useEffect(() => {
    // Reset subcategory if main category changes
    setSelectedSub("");
  }, [selectedMain]);

  const handleSearch = () => {
    if (selectedSub) {
      const sub = categories.find(c => c.id === selectedSub);
      if (sub) router.push(`/categories/${sub.slug}`);
    } else if (selectedMain) {
      const main = categories.find(c => c.id === selectedMain);
      if (main) router.push(`/categories/${main.slug}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group bg-white border border-orange-100 p-4 sm:p-6 shadow-xl shadow-orange-50/50 rounded-2xl sm:rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent pointer-events-none rounded-[2rem]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Main Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">1. Choose Department</label>
              <div className="relative">
                <select
                  value={selectedMain}
                  onChange={(e) => setSelectedMain(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-orange-100 bg-white text-sm font-bold text-zinc-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {mainCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  <LayoutGrid className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Subcategory Dropdown (The "Second Dropdown") */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">2. Specific Category</label>
              <div className="relative">
                <select
                  value={selectedSub}
                  onChange={(e) => setSelectedSub(e.target.value)}
                  disabled={!selectedMain}
                  className={cn(
                    "w-full h-14 pl-12 pr-4 rounded-xl border border-orange-100 bg-white text-sm font-bold text-zinc-950 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer",
                    !selectedMain && "opacity-50 cursor-not-allowed bg-zinc-50"
                  )}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={!selectedMain && !selectedSub}
            className="w-full md:w-auto h-14 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 gap-2"
          >
            <Search className="w-5 h-5" />
            Find Products
          </Button>
        </div>

        {/* Quick Tips */}
        {!selectedMain && (
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-200 animate-pulse" />
            Start by choosing a main department to see specialized categories
          </div>
        )}
      </div>
    </div>
  );
}

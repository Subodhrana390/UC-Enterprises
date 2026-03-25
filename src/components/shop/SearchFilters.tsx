"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface SearchFiltersProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  categories: Array<{ id: string; slug: string; name: string }>;
  currentCategory: string;
  onCategoryChange: (value: string | null | undefined) => void;
  currentAvailability: string;
  onAvailabilityChange: (value: string | null | undefined) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  maxPrice: number;
  currentRating: string;
  onRatingChange: (value: string | null | undefined) => void;
  activeFilters: FilterChip[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export function SearchFilters({
  searchText,
  onSearchChange,
  categories,
  currentCategory,
  onCategoryChange,
  currentAvailability,
  onAvailabilityChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  currentRating,
  onRatingChange,
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Search</Label>
        <Input 
          value={searchText} 
          onChange={(e) => onSearchChange(e.target.value)} 
          placeholder="Search products..." 
          className="h-10"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Category</Label>
        <Select
          value={currentCategory || "all"}
          onValueChange={(v) => onCategoryChange(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Availability</Label>
        <Select
          value={currentAvailability || "all"}
          onValueChange={(v) => onAvailabilityChange(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Any availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="in">In Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="pt-2">
          <Slider
            value={priceRange}
            min={0}
            max={Math.ceil(maxPrice)}
            step={50}
            onValueChange={(v) => {
              if (Array.isArray(v) && v.length === 2) {
                onPriceRangeChange([v[0], v[1]]);
              }
            }}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <Select
          value={currentRating}
          onValueChange={(v) => onRatingChange(v === "0" ? undefined : v)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Any rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any rating</SelectItem>
            <SelectItem value="3">3★ and up</SelectItem>
            <SelectItem value="4">4★ and up</SelectItem>
            <SelectItem value="4.5">4.5★ and up</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <Button variant="outline" className="w-full h-11 justify-start gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filter Chips - Only show at top, not in sidebar */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b lg:hidden">
          {activeFilters.map((filter) => (
            <Badge 
              key={filter.key} 
              variant="secondary" 
              className="pl-3 pr-2 py-1.5 text-sm gap-1.5 hover:bg-secondary/80"
            >
              <span className="font-medium">{filter.label}:</span>
              <span>{filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="ml-1 hover:bg-background/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Desktop Sidebar Filters - Clean without chips */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4 space-y-6 p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeFilters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearAll}
                className="h-8 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>
    </>
  );
}

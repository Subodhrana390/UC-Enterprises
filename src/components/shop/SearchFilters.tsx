"use client";

import { useState } from "react";
import { X, SlidersHorizontal, Search, Filter, Star, Tag, DollarSign, Package, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FilterChip {
  key: string;
  label: string;
  value: string;
}

interface SearchFiltersProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  categories: Array<{ id: string; slug: string; name: string }>;
  currentCategory?: string;
  onCategoryChange: (value: string | null | undefined) => void;
  currentAvailability?: string;
  onAvailabilityChange: (value: string | null | undefined) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  maxPrice: number;
  currentRating?: string;
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

  const FilterSection = ({
    icon: Icon,
    label,
    children
  }: {
    icon: any;
    label: string;
    children: React.ReactNode
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{label}</span>
      </div>
      {children}
    </div>
  );

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Search */}
      <FilterSection icon={Search} label="Search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="pl-9 h-11 bg-background border-muted-foreground/20 focus:border-primary/50 transition-colors"
          />
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection icon={Tag} label="Category">
        <Select
          value={currentCategory || "all"}
          onValueChange={(v) => onCategoryChange(v === "all" ? undefined : v)}
        >
          <SelectTrigger className="h-11 bg-background border-muted-foreground/20">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Availability */}
      <FilterSection icon={Package} label="Availability">
        <div className="flex gap-2">
          {["all", "in", "out"].map((status) => (
            <button
              key={status}
              onClick={() => onAvailabilityChange(status === "all" ? undefined : status)}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200",
                (currentAvailability === status || (status === "all" && !currentAvailability))
                  ? "bg-white text-primary border-primary shadow-sm"
                  : "bg-background border-muted-foreground/20 hover:border-primary/50 hover:bg-accent"
              )}
            >
              {status === "all" && "All"}
              {status === "in" && "In Stock"}
              {status === "out" && "Out of Stock"}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection icon={IndianRupee} label="Price Range">
        <div className="space-y-4">
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
            className="py-2"
          />
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 px-3 py-2 rounded-lg border border-muted-foreground/20 bg-background">
              <span className="text-xs text-muted-foreground">Min</span>
              <p className="text-sm font-semibold">₹{priceRange[0].toLocaleString()}</p>
            </div>
            <span className="text-muted-foreground">—</span>
            <div className="flex-1 px-3 py-2 rounded-lg border border-muted-foreground/20 bg-background">
              <span className="text-xs text-muted-foreground">Max</span>
              <p className="text-sm font-semibold">₹{priceRange[1].toLocaleString()}</p>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection icon={Star} label="Rating">
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "0", label: "Any" },
            { value: "3", label: "3★+" },
            { value: "4", label: "4★+" },
            { value: "4.5", label: "4.5★+" },
          ].map((rating) => (
            <button
              key={rating.value}
              onClick={() => onRatingChange(rating.value === "0" ? undefined : rating.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200",
                (currentRating === rating.value || (rating.value === "0" && !currentRating))
                  ? "bg-white text-primary border-primary shadow-sm"
                  : "bg-background border-muted-foreground/20 hover:border-primary/50 hover:bg-accent"
              )}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <Button
              variant="outline"
              className="w-full h-12 justify-between gap-2 border-muted-foreground/20 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </div>
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-white">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[400px] p-0 overflow-y-auto">
            <div className="p-6">
              <SheetHeader className="text-left pb-4 border-b">
                <SheetTitle className="text-xl">Filters</SheetTitle>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="absolute right-6 top-6 h-8 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filter Chips - Mobile only */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b lg:hidden">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="pl-3 pr-2 py-1.5 text-sm gap-1.5 bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
            >
              <span className="font-medium">{filter.label}:</span>
              <span>{filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.key)}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 space-y-6 p-6 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            )}
          </div>

          {/* Active filters summary */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {activeFilters.slice(0, 3).map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="text-xs bg-secondary/5 text-primary"
                >
                  {filter.label}: {filter.value}
                </Badge>
              ))}
              {activeFilters.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{activeFilters.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <FilterContent />
        </div>
      </aside>
    </>
  );
}
"use client";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 p-3 bg-white">
      <div className="aspect-square rounded-lg bg-gray-100 animate-pulse mb-3" />
      <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-3" />
      <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
    </div>
  );
}

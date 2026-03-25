"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { deleteBanner, toggleBannerStatus } from "@/lib/actions/admin/banners";
import { Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BannerForm } from "./BannerForm";

interface BannerCardProps {
  banner: any;
}

export function BannerCard({ banner }: BannerCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = async () => {
    startTransition(async () => {
      const result = await toggleBannerStatus(banner.id, !banner.is_active);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Banner ${banner.is_active ? "deadjuvated" : "activated"} successfully`);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    startTransition(async () => {
      const result = await deleteBanner(banner.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Banner deleted successfully");
      }
    });
  };

  return (
    <div className="bg-white border border-[#ebebeb] shadow-sm rounded-xl overflow-hidden group relative">
      <div className="relative h-40 bg-[#f5f5f5]">
        {banner.image_url ? (
          <Image
            src={banner.image_url}
            alt={banner.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[#616161]">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleToggle}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : banner.is_active ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
          
          <BannerForm banner={banner} />

          <Button 
            variant="destructive" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {!banner.is_active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Inactive</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1a1c1d] truncate" title={banner.title}>
          {banner.title}
        </h3>
        {banner.subtitle && (
          <p className="text-sm text-[#616161] mt-1 line-clamp-1" title={banner.subtitle}>
            {banner.subtitle}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-[10px] text-[#616161]">
            <span className="px-2 py-0.5 bg-[#f1f1f1] rounded uppercase tracking-wider">{banner.position}</span>
            <span>Order: {banner.sort_order}</span>
          </div>
          {banner.profiles?.full_name && (
            <span className="text-[10px] text-[#919191]">By: {banner.profiles.full_name.split(' ')[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
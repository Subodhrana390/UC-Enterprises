"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { deleteBanner, toggleBannerStatus } from "@/lib/actions/admin/banners";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BannerCardProps {
  banner: any;
}

export function BannerCard({ banner }: BannerCardProps) {
  return (
    <div className="bg-white border border-[#ebebeb] shadow-sm rounded-xl overflow-hidden group">
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
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <form action={async () => {
            await toggleBannerStatus(banner.id, !banner.is_active);
          }}>
            <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
              {banner.is_active ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </form>
          <form action={async () => {
            await deleteBanner(banner.id);
          }}>
            <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </form>
        </div>
        {!banner.is_active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Inactive</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1a1c1d]">{banner.title}</h3>
        {banner.subtitle && (
          <p className="text-sm text-[#616161] mt-1">{banner.subtitle}</p>
        )}
        <div className="flex items-center gap-2 mt-3 text-xs text-[#616161]">
          <span className="px-2 py-0.5 bg-[#f1f1f1] rounded">{banner.position}</span>
          <span>Order: {banner.sort_order}</span>
        </div>
      </div>
    </div>
  );
}
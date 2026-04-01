"use client";

import { useEffect, useState } from "react";
import BannerCarousel from "./BannerCrousel";
import { getAllBanners } from "@/lib/actions/admin/banners";

export default function HeroBanner() {
    const [banners, setBanners] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchBanners() {
            try {
                const { data, error } = await getAllBanners();
                if (error) {
                    console.error("Failed to fetch banners:", error);
                }
                setBanners(data || []);
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBanners();
    }, []);
    
    if (isLoading) {
        return (
            <div className="relative w-full h-[450px] md:h-[600px] bg-slate-950 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

                <div className="max-w-7xl mx-auto w-full px-6 md:px-12 space-y-6">
                    <div className="h-4 w-48 bg-slate-900 rounded-full animate-pulse" />
                    <div className="h-12 md:h-20 w-2/3 bg-slate-900 rounded-2xl animate-pulse" />
                    <div className="h-4 w-1/3 bg-slate-900 rounded-full animate-pulse" />
                    <div className="flex gap-4 pt-4">
                        <div className="h-14 w-40 bg-slate-900 rounded-xl animate-pulse" />
                        <div className="h-14 w-40 bg-slate-900 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (banners.length === 0) return null;

    return <BannerCarousel banners={banners} />;
}
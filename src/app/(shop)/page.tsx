import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getShopCategories, getFeaturedProducts, getLatestProducts } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import HeroBanner from "@/components/shop/HeroBanner";
import FeatureBanner from "@/components/shop/FeatureBanner";
import FeatureProductSection from "./_components/FeatureProductSection";
import LatestProductSection from "./_components/LatestProductSection";
import ShopByCategory from "./_components/ShopByCategory";
import FabricationServices from "./_components/FabricationServices";
import TestimonialSection from "@/components/shop/TestimonialSection";
import ReviewSection from "@/components/shop/ReviewSection";
import BrandSection from "./_components/BrandSection";
import { getAllBanners } from "@/lib/actions/admin/banners";

export default async function HomePage() {
  const supabase = await createClient();

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const [categories, featuredProducts, latestProducts] = await Promise.all([
    getShopCategories(),
    getFeaturedProducts(),
    getLatestProducts(),
  ]);

  const skuCount = productCount || 0;

  return (
    <div className="flex-1">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Feature Banner */}
      <FeatureBanner />

      {/* Shop by Category */}
      <ShopByCategory categories={categories} skuCount={skuCount} />

      {/* Featured Products */}
      <FeatureProductSection featuredProducts={featuredProducts} />

      {/* Latest Products */}
      <LatestProductSection latestProducts={latestProducts} />

      {/* Fabrication Services - Indian Industry Standard */}
      <FabricationServices />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Review Section  */}
      <ReviewSection />

      {/* Brands */}
      <BrandSection />
    </div >
  );
}




import { getAllBanners } from "@/lib/actions/admin/banners";
import { BannerForm } from "../../_components/BannerForm";
import { BannerCard } from "../../_components/BannerCard";

export default async function BannersPage() {
  const { data: banners } = await getAllBanners();

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Banners</h1>
        <BannerForm />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners?.map((banner: any) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
        {(!banners || banners.length === 0) && (
          <div className="col-span-full text-center py-12 text-[#616161]">
            No banners created yet. Create your first banner to get started.
          </div>
        )}
      </div>
    </div>
  );
}
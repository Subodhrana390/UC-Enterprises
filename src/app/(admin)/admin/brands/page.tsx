import { createClient } from "@/lib/supabase/server";
import { BrandsTable } from "../../_components/BrandsTable";
import { getAdminBrandsPaginated } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function BrandManagementPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  
  const { brands, total, totalPages } = await getAdminBrandsPaginated(page, 20);

  return (
    <div className="space-y-6">
      <BrandsTable initialBrands={brands || []} />
      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/brands" />
    </div>
  );
}
  
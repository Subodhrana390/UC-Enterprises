import { createClient } from "@/lib/supabase/server";
import { CollectionsTable } from "../../_components/CollectionsTable";
import { getAdminCategories } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function CollectionsPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  
  const { categories, total, totalPages } = await getAdminCategories(page, 20);
  
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Collections</h1>
      </header>
      
      <CollectionsTable initialCategories={categories || []} />
      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/categories" />
    </div>
  );
}
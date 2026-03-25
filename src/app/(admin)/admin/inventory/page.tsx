import { createClient } from "@/lib/supabase/server";
import { InventoryTable } from "../../_components/InventoryTable";
import { getAdminInventory } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function InventoryManagementPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  
  const { products, total, totalPages } = await getAdminInventory(page, 20);

  return (
    <div className="space-y-6">
      <InventoryTable products={products || []} />
      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/inventory" />
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "../../_components/ProductsTable";
import { getAdminProducts } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function ProductManagementPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  
  const supabase = await createClient();
  const { products, total, totalPages } = await getAdminProducts(page, 20);
  const { data: brands } = await supabase.from("brands").select("id, name").order("name");
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div className="space-y-6">
      <ProductsTable products={products || []} brands={brands || []} categories={categories || []} />
      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/products" />
    </div>
  );
}
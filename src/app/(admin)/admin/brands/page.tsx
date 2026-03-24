import { createClient } from "@/lib/supabase/server";
import { BrandsTable } from "../../_components/BrandsTable";

export default async function BrandManagementPage() {
  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("*, products(count)")
    .order("name");

  return (
    <div className="space-y-6">
      <BrandsTable initialBrands={brands || []} />
    </div>
  );
}
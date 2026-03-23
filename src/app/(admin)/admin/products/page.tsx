import { createClient } from "@/lib/supabase/server";
import { ProductsTable } from "../../_components/ProductsTable";

export default async function ProductManagementPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, brands(name), categories(name)")
    .order("created_at", { ascending: false });
  const { data: brands } = await supabase.from("brands").select("id, name").order("name");
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div className="space-y-6">
      <ProductsTable products={products || []} brands={brands || []} categories={categories || []} />
    </div>
  );
}
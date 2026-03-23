import { createClient } from "@/lib/supabase/server";
import { InventoryTable } from "../../_components/InventoryTable";

export default async function InventoryManagementPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, brands(name)")
    .order("stock_quantity", { ascending: true });

  return (
    <div className="space-y-6">
      <InventoryTable products={products || []} />
    </div>
  );
}
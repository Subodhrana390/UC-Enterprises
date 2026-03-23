import { createClient } from "@/lib/supabase/server";
import { CollectionsTable } from "../../_components/CollectionsTable";

export default async function CollectionsPage() {
  const supabase = await createClient();
  
  const { data: categories } = await supabase
    .from("categories")
    .select("*, products(count)")
    .order("name");

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Collections</h1>
      </header>
      
      {/* Pass data to the Client Component */}
      <CollectionsTable initialCategories={categories || []} />
    </div>
  );
}
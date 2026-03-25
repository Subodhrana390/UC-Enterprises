import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { OrdersTableClient } from "@/components/admin/orders-table-client";
import { getAdminOrders } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  
  const { orders, total, totalPages } = await getAdminOrders(page, 20);
    
  return (
    <div className="min-h-screen p-6 space-y-4">
      <OrdersTableClient initialOrders={orders || []} />
      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/orders" />
    </div>
  );
}
    
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import { QuotesClient } from "../../_components/QuotesClient";
import { getAdminQuotes } from "@/lib/actions/admin";

export default async function QuotesPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const { quotes, total, totalPages } = await getAdminQuotes(page, 20);

  return (
    <div className="space-y-8 p-8 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quotations</h1>
          <p className="text-slate-500 mt-1">Review inquiries and send price offers to customers.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden rounded-xl">
        <div className="p-4 border-b border-slate-100 flex gap-3 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ID or Customer..."
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
            />
          </div>
          <Button variant="outline" className="h-11 border-slate-200">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <CardContent className="p-0">
          <QuotesClient quotes={quotes} />
        </CardContent>

        {/* Pagination Footer */}
        <div className="border-t border-slate-100 px-6 py-6 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-slate-500">
              Showing {total > 0 ? (page - 1) * 20 + 1 : 0} to {Math.min(page * 20, total)} of {total}
            </div>
            <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/quotes" />
          </div>
        </div>
      </Card>
    </div>
  );
}
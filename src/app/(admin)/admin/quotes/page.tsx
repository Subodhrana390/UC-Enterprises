import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminQuotes } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function DraftOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  
  const { quotes, total, totalPages } = await getAdminQuotes(page, 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Draft orders</h1>
        <Button className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
          Create order
        </Button>
      </header>

      {/* Main Resource List */}
      <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center px-4 border-b border-[#f1f1f1] gap-6">
          <button className="py-3 text-xs font-medium border-b-2 border-black text-black">
            Open
          </button>
          <button className="py-3 text-xs font-medium border-b-2 border-transparent text-[#616161] hover:text-black">
            Invoice sent
          </button>
          <button className="py-3 text-xs font-medium border-b-2 border-transparent text-[#616161] hover:text-black">
            Completed
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 flex gap-2 border-b border-[#f1f1f1] bg-[#fafafa]">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#616161]">
              search
            </span>
            <input
              placeholder="Filter draft orders"
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-[#fafafa]">
              <TableRow className="hover:bg-transparent border-[#f1f1f1]">
                <TableHead className="w-10 px-6"><input type="checkbox" className="rounded-sm" /></TableHead>
                <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Draft</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Customer</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider text-center">Date</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#f1f1f1]">
              {quotes && quotes.length > 0 ? quotes.map((quote: any) => (
                <TableRow key={quote.id} className="group hover:bg-[#fafafa] cursor-pointer transition-colors border-[#f1f1f1]">
                  <TableCell className="px-6"><input type="checkbox" className="rounded-sm" /></TableCell>
                  <TableCell className="text-xs font-semibold text-[#1a1c1d] group-hover:underline">
                    #{quote.id.toString().substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#1a1c1d]">
                         {quote.profiles?.first_name} {quote.profiles?.last_name || "Guest Customer"}
                      </span>
                      <span className="text-[10px] text-[#616161]">
                        {quote.profiles?.company_name || "No company"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-[#616161] text-center">
                    {new Date(quote.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-[#fff4da] text-[#8a6116] hover:bg-[#fff4da] border-none text-[10px] font-medium rounded-md px-2 py-0">
                      Open
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-medium text-[#1a1c1d]">
                    ${quote.total_amount?.toFixed(2)}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-[#d2d2d2] text-4xl">drafts</span>
                      <p className="text-xs text-[#616161]">No draft orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/quotes" />
    </div>
  );
}
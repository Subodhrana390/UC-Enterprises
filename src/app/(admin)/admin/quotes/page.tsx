
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminQuotes } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";
import {
  Search,
  Filter,
  MoreVertical,
  Send,
  CheckCircle,
  Clock,
  FileText,
  User,
  Calendar,
  IndianRupee
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default async function QuotesPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;
  const tab = params.tab as string || "open";

  const { quotes, total, totalPages } = await getAdminQuotes(page, 20);

  const tabs = [
    { id: "open", label: "Open", icon: Clock, count: quotes?.filter((q: any) => q.status === "open").length || 0 },
    { id: "closed", label: "Closed", icon: Send, count: quotes?.filter((q: any) => q.status === "closed").length || 0 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return { label: "Open", className: "bg-amber-50 text-amber-700 border-amber-200" };
      case "closed":
        return { label: "Closed", className: "bg-blue-50 text-blue-700 border-blue-200" };
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quotations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all customer quotations</p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-6">
          <div className="flex gap-6">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                className={cn(
                  "py-3 text-sm font-medium transition-colors relative",
                  tab === tabItem.id
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <tabItem.icon className="h-4 w-4" />
                  <span>{tabItem.label}</span>
                  <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">
                    {tabItem.count}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by ID, customer, or subject..."
                className="pl-9 h-10 bg-white border-gray-200 focus:border-gray-400"
              />
            </div>
            <Button variant="outline" size="sm" className="h-10 border-gray-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="w-12 px-6">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Items</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Offered Price</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {quotes && quotes.length > 0 ? quotes.map((quote: any) => {
                console.log(quote)
                const status = getStatusBadge(quote.status);
                return (
                  <TableRow
                    key={quote.id}
                    className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <TableCell className="px-6">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-mono font-medium text-gray-900">
                        #{quote.id.toString().substring(0, 8).toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                          {quote.subject}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-700">
                          {quote.profiles?.full_name || "Guest Customer"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        {quote.items?.length || 0} items
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border", status?.className)}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {quote.offered_price ? `₹${Number(quote.offered_price).toLocaleString()}` : '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : '—'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">No quotations found</p>
                        <p className="text-xs text-gray-500 mt-1">Create your first quotation to get started</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Footer with pagination */}
        {quotes && quotes.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} quotations
              </p>
              <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/quotes" />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
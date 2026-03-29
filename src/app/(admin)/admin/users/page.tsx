import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminUsersPaginated } from "@/lib/actions/admin";
import { PaginationControls } from "@/components/shared/PaginationControls";

export default async function UsersPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;

  const supabase = await createClient();
  const { users, total, totalPages } = await getAdminUsersPaginated(page, 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Customers</h1>
      </header>

      {/* Resource List Card */}
      <div className="bg-white border border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">

        {/* Filter Bar */}
        <div className="p-3 flex gap-2 border-b border-[#f1f1f1] bg-[#fafafa]">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#616161]">
              search
            </span>
            <input
              placeholder="Search customers"
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-[#fafafa]">
            <TableRow className="hover:bg-transparent border-[#f1f1f1]">
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Customer name</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Role</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Email subscription</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Orders</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider text-right">Amount spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-[#f1f1f1]">
            {users?.map((user) => (
              <TableRow key={user.id} className="hover:bg-[#fafafa] cursor-pointer group border-[#f1f1f1]">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1a1c1d] group-hover:underline">
                      {user.full_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1a1c1d] group-hover:underline">
                      {user.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-[#e3f1df] text-[#008060] hover:bg-[#e3f1df] border-none text-[10px] font-medium rounded-md px-2 py-0">
                    Subscribed
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-[#1a1c1d]">
                  -
                </TableCell>
                <TableCell className="text-xs text-[#1a1c1d] text-right font-medium">
                  -
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControls currentPage={page} totalPages={totalPages} basePath="/admin/users" />
    </div>
  );
}
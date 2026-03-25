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

  const { data: authUsers } = await supabase
    .from("auth.users")
    .select("id, email");

  const emailMap = new Map(authUsers?.map(u => [u.id, u.email]) || []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Customers</h1>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm">
            Export
          </Button>
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm">
            Import
          </Button>
          <Button className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
            Add customer
          </Button>
        </div>
      </header>

      {/* Resource List Card */}
      <div className="bg-white border border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center px-4 border-b border-[#f1f1f1] gap-6">
          {["All", "New", "Returning", "Abandoned checkouts"].map((tab, i) => (
            <button
              key={tab}
              className={`py-3 text-xs font-medium border-b-2 transition-colors ${i === 0 ? "border-black text-black" : "border-transparent text-[#616161] hover:text-black"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

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
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-8 text-[11px]">Email subscription</Button>
          <Button variant="outline" className="bg-white border-[#d2d2d2] h-8 text-[11px]">Location</Button>
        </div>

        <Table>
          <TableHeader className="bg-[#fafafa]">
            <TableRow className="hover:bg-transparent border-[#f1f1f1]">
              <TableHead className="w-10 px-6"><input type="checkbox" className="rounded-sm" /></TableHead>
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
                <TableCell className="px-6"><input type="checkbox" className="rounded-sm" /></TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1a1c1d] group-hover:underline">
                      {user.full_name || "Unknown"}
                    </span>
                    <span className="text-[11px] text-[#616161]">{emailMap.get(user.id) || "No email"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#1a1c1d] group-hover:underline">
                      {user.role}
                    </span>
                    <span className="text-[11px] text-[#616161]">{emailMap.get(user.id) || "No email"}</span>
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
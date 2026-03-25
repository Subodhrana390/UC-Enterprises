import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFabricationRequests } from "@/lib/actions/fabrication";
import { FabricationActions } from "@/app/(admin)/_components/FabricationActions";

export default async function FabricationManagementPage() {
  const requests = await getFabricationRequests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-emerald-500 bg-emerald-500";
      case "processing": return "text-blue-500 bg-blue-500";
      case "pending": return "text-amber-500 bg-amber-500";
      case "rejected": return "text-red-500 bg-red-500";
      default: return "text-gray-500 bg-gray-500";
    }
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      pcb: "PCB Fabrication",
      pcba: "PCB Assembly",
      iot: "IoT Prototype",
      stencil: "Laser Stencil"
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1c1d]">Fabrication Requests</h1>
          <p className="text-sm text-gray-600 mt-1">Manage custom fabrication and assembly orders</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <span className="text-blue-600">{requests.length}</span> Total Requests
        </div>
      </header>

      <div className="bg-white rounded-xl border border-[#ebebeb] shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-[#fafafa]">
            <TableRow className="hover:bg-transparent border-b border-[#f1f1f1]">
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Request ID</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Customer</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Service Type</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Details</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-[11px] font-semibold text-[#616161] uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  No fabrication requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req: any) => {
                let details;
                try {
                  details = JSON.parse(req.description);
                } catch {
                  details = { contact: "N/A", email: "N/A", company: "N/A" };
                }

                return (
                  <TableRow key={req.id} className="border-b border-[#f1f1f1] hover:bg-[#fafafa]">
                    <TableCell className="font-mono text-xs text-gray-600">
                      {req.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-semibold text-[#1a1c1d]">
                        {req.profiles?.full_name || details.contact}
                      </div>
                      <div className="text-xs text-gray-500">{details.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {getServiceLabel(req.service_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      <div>Company: {details.company}</div>
                      <div>Qty: {details.quantity}</div>
                      <div>Timeline: {details.timeline}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${getStatusColor(req.status).split(" ")[0]}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(req.status).split(" ")[1]} shadow-[0_0_8px_currentColor]`}></div>
                        {req.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {new Date(req.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <FabricationActions request={req} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

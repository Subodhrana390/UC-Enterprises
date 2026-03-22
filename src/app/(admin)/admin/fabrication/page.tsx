"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FabricationManagementPage() {
  const requests = [
    { id: 1, ticket: "FAB-2024-001", client: "Tesla Motors", type: "Custom PCB", layers: 4, status: "Processing", priority: "High" },
    { id: 2, ticket: "FAB-2024-002", client: "SpaceX", type: "IoT Prototype", layers: "N/A", status: "In Review", priority: "Urgent" },
    { id: 3, ticket: "FAB-2024-003", client: "Intel Corp", type: "HDI Board", layers: 12, status: "Completed", priority: "Medium" },
  ];

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Fabrication Queue</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">Engineering & Production Workflow</p>
        </div>
        <div className="flex gap-4">
             <Button variant="outline" className="h-12 px-6 rounded-xl border-border/40 font-black text-[10px] uppercase tracking-widest hover:bg-white text-on-surface">
                Production Schedule
             </Button>
             <Button className="h-12 px-6 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                New Service Ticket
             </Button>
        </div>
      </header>

      <div className="bg-white/50 backdrop-blur-xl rounded-[32px] border border-border/40 shadow-2xl shadow-primary/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface/50 border-b border-border/10">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ticket ID</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Enterprise Client</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Service Type</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Complexity</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id} className="h-20 border-b border-border/5 hover:bg-white transition-colors">
                <TableCell className="font-mono text-[11px] font-black text-primary uppercase">{req.ticket}</TableCell>
                <TableCell className="font-black text-sm uppercase">{req.client}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-black bg-surface uppercase border-border/20 px-3">{req.type}</Badge>
                </TableCell>
                <TableCell className="text-[10px] font-black uppercase opacity-40">
                    {req.layers !== "N/A" ? `${req.layers} Layers` : "Prototype"}
                </TableCell>
                <TableCell>
                   <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                       req.status === 'Completed' ? 'text-emerald-500' : 
                       req.status === 'Processing' ? 'text-blue-500' : 'text-amber-500'
                   }`}>
                       <div className={`w-1.5 h-1.5 rounded-full ${
                           req.status === 'Completed' ? 'bg-emerald-500' : 
                           req.status === 'Processing' ? 'bg-blue-500' : 'bg-amber-500'
                       } shadow-[0_0_8px_currentColor]`}></div>
                       {req.status}
                   </span>
                </TableCell>
                <TableCell className="text-center">
                   <Button variant="ghost" className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">Update Manifest</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

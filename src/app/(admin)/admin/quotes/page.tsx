import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function QuotesManagementPage() {
  const supabase = await createClient();
  
  // Treat pending or specific orders as quotes for B2B portal
  const { data: quotes } = await supabase
    .from("orders")
    .select("*, profiles(first_name, last_name, company_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Procurement Quotes</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant opacity-40">Custom Pricing & Negotiation Desk</p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          <span className="material-symbols-outlined mr-2">add_task</span>
          Create Proposal
        </Button>
      </header>

      <div className="bg-white/50 backdrop-blur-xl rounded-[32px] border border-border/40 shadow-2xl shadow-primary/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-surface/50 border-b border-border/10">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Procurement Subject</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Enterprise Client</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">SKU Count</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Offered Value</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</TableHead>
              <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes && quotes.length > 0 ? quotes.map((quote: any) => (
              <TableRow key={quote.id} className="h-20 border-b border-border/5 hover:bg-white transition-colors">
                <TableCell className="font-black text-sm uppercase leading-tight max-w-xs">Manifest #{quote.id.toString().substring(0, 8)}</TableCell>
                <TableCell className="text-xs font-bold uppercase text-on-surface-variant">
                    {quote.profiles?.company_name || `${quote.profiles?.first_name || ""} ${quote.profiles?.last_name || ""}`.trim() || "Independent"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="text-[9px] font-black bg-surface uppercase border-border/20 px-3">Standard Line Items</Badge>
                </TableCell>
                <TableCell className="text-right font-black text-sm">${quote.total_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>
                   <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-blue-500`}>
                       <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_currentColor]`}></div>
                       Pending Analysis
                   </span>
                </TableCell>
                <TableCell className="text-center">
                   <Button variant="ghost" className="h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5">Negotiate</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 opacity-40">
                    <span className="material-symbols-outlined text-4xl mb-2">request_quote</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No pending quotes found.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

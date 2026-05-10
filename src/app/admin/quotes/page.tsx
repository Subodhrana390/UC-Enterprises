"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  MessageSquareQuote, 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Filter,
  Clock,
  Download,
  FileText,
  FileSpreadsheet,
  Building2,
  Mail,
  Phone,
  Hash,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const supabase = createClient();

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [supabase]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
      if (selectedQuote?.id === id) {
        setSelectedQuote({ ...selectedQuote, status });
      }
      toast.success(`Quotation marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "responded": return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.product_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || q.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    const headers = ["Quote ID", "Customer", "Company", "Product", "Quantity", "Date", "Status"];
    const rows = filteredQuotes.map(q => [
      q.id.slice(0, 8),
      q.customer_name,
      q.company_name || "N/A",
      q.product_name,
      q.quantity,
      new Date(q.created_at).toLocaleDateString(),
      q.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `quotes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotation Management</h1>
          <p className="text-muted-foreground">Manage and respond to B2B product inquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToCSV} className="gap-2 border-zinc-200 rounded-xl h-11 px-6">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-white/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search by customer, company or product..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 rounded-2xl bg-zinc-50 border-zinc-100 font-medium" 
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Filter:</span>
              <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
                {["All", "New", "Pending", "Responded"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === s ? "bg-white text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-zinc-50/50">
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Customer / Company</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Product Info</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Date</th>
                  <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="h-12 px-6 text-right align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="group transition-colors hover:bg-zinc-50/50">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-zinc-900">{quote.customer_name}</span>
                        <div className="flex items-center gap-2 text-zinc-400">
                          <Building2 className="w-3 h-3" />
                          <span className="text-xs">{quote.company_name || "Personal Request"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-zinc-900">{quote.product_name}</span>
                        <div className="flex items-center gap-2 text-primary font-bold">
                          <Hash className="w-3 h-3" />
                          <span className="text-xs">Qty: {quote.quantity}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-zinc-500 font-medium">
                      {new Date(quote.created_at).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Badge className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <Eye className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100">
                              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-zinc-100 shadow-xl bg-white z-50">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 py-2">Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateStatus(quote.id, "Pending")} className="gap-3 rounded-xl cursor-pointer">
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span className="font-bold text-zinc-600 text-sm">Mark Pending</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(quote.id, "Responded")} className="gap-3 rounded-xl cursor-pointer">
                              <ArrowRight className="w-4 h-4 text-purple-500" />
                              <span className="font-bold text-zinc-600 text-sm">Mark Responded</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(quote.id, "Completed")} className="gap-3 rounded-xl cursor-pointer">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="font-bold text-zinc-600 text-sm">Mark Completed</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem onClick={() => updateStatus(quote.id, "Cancelled")} className="gap-3 rounded-xl cursor-pointer text-red-600">
                              <XCircle className="w-4 h-4" />
                              <span className="font-bold text-sm">Cancel Quote</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredQuotes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-zinc-400">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center">
                          <MessageSquareQuote className="w-8 h-8 opacity-20" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900">No quotations found</p>
                          <p className="text-xs font-medium">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quote Details Modal */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuote(null)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden relative z-10 shadow-2xl border border-zinc-100 flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-zinc-950 tracking-tight">Quotation Details</h3>
                    <Badge className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedQuote.status)}`}>
                      {selectedQuote.status}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Request ID: #{selectedQuote.id.toUpperCase()}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedQuote(null)} className="rounded-full h-12 w-12 hover:bg-white shadow-sm border border-transparent hover:border-zinc-100">
                  <XCircle className="w-6 h-6 text-zinc-400" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Customer Information</h4>
                    <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                          <Eye className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Full Name</p>
                          <p className="font-bold text-zinc-900">{selectedQuote.customer_name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                          <Building2 className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Company</p>
                          <p className="font-bold text-zinc-900">{selectedQuote.company_name || "Individual Request"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contact Details</h4>
                    <div className="p-6 rounded-[2rem] bg-zinc-50 border border-zinc-100 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                          <Mail className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Email Address</p>
                          <p className="font-bold text-zinc-900">{selectedQuote.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                          <Phone className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                          <p className="font-bold text-zinc-900">{selectedQuote.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Inquiry Specifications</h4>
                  <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <MessageSquareQuote className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Product Requested</p>
                          <p className="text-2xl font-black">{selectedQuote.product_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Target Quantity</p>
                          <p className="text-3xl font-black text-primary">{selectedQuote.quantity} Units</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Message / Requirement Details</p>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-sm leading-relaxed text-zinc-300 italic">
                            "{selectedQuote.message || "No specific message provided."}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {selectedQuote.status === "New" && (
                    <Button 
                      onClick={() => updateStatus(selectedQuote.id, "Pending")}
                      className="h-12 px-6 rounded-2xl font-bold bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg shadow-amber-500/20"
                    >
                      Process Inquiry
                    </Button>
                  )}
                  {selectedQuote.status !== "Responded" && selectedQuote.status !== "Completed" && (
                    <Button 
                      onClick={() => updateStatus(selectedQuote.id, "Responded")}
                      className="h-12 px-6 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20"
                    >
                      Confirm Response
                    </Button>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedQuote(null)} 
                  className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-zinc-900"
                >
                  Close Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

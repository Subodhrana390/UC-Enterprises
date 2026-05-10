"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  ShoppingBag, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle,
  Filter,
  ArrowUpDown,
  Clock,
  Download,
  FileText,
  FileSpreadsheet,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingId, setTrackingId] = useState("");
  const [carrier, setCarrier] = useState("");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const supabase = createClient();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [supabase]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update status");
      }

      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      toast.success(`Order marked as ${status}${status === "Delivered" ? ". Invoice sent to customer." : ""}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const downloadInvoice = async (order: any) => {
    try {
      const { generateInvoicePDF } = await import("@/lib/invoice");
      
      // Fetch items if not present
      let items = order.items;
      if (!items || items.length === 0) {
        const { data } = await supabase
          .from("order_items")
          .select("*, products(name, image_url)")
          .eq("order_id", order.id);
        items = data || [];
      }

      const invoiceData = {
        orderId: order.id,
        date: order.created_at,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.phone,
        address: order.shipping_address || "N/A",
        items: items,
        totalAmount: parseFloat(order.total_amount)
      };

      const doc = generateInvoicePDF(invoiceData);
      doc.save(`Invoice_${order.id.slice(0, 8).toUpperCase()}.pdf`);
      toast.success("Invoice downloaded");
    } catch (error: any) {
      toast.error("Failed to generate invoice");
    }
  };

  const updateTracking = async (id: string) => {
    try {
      const response = await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status: "Shipped", trackingId, carrier })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update tracking");
      }

      setOrders(orders.map(o => o.id === id ? { ...o, tracking_id: trackingId, carrier, status: "Shipped" } : o));
      toast.success("Tracking information updated and marked as Shipped");
      setIsTrackingModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update tracking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "pending payment": return "bg-orange-100 text-orange-700 border-orange-200";
      case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const exportToCSV = () => {
    const headers = ["Order ID", "Customer ID", "Date", "Total", "Status"];
    const rows = orders.map(o => [
      o.id,
      o.user_id,
      new Date(o.created_at).toLocaleDateString(),
      `INR ${o.total_amount}`,
      o.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    
    const doc = new jsPDF();
    doc.text("Orders Report - UC Enterprises", 14, 15);
    
    const tableData = orders.map(o => [
      o.id.slice(0, 8),
      new Date(o.created_at).toLocaleDateString(),
      `INR ${o.total_amount}`,
      o.status.toUpperCase()
    ]);
    
    (doc as any).autoTable({
      head: [['Order ID', 'Date', 'Total', 'Status']],
      body: tableData,
      startY: 20,
    });
    
    doc.save(`orders_${new Date().toISOString().split('T')[0]}.pdf`);
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
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" className="gap-2 border-zinc-200 rounded-xl h-11 px-6">
                <Download className="w-4 h-4" />
                Export
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-zinc-100 shadow-xl bg-white z-50">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 py-2">Select Format</DropdownMenuLabel>
                <DropdownMenuItem onClick={exportToCSV} className="gap-3 rounded-xl cursor-pointer">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-zinc-600 text-sm">Excel (CSV)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF} className="gap-3 rounded-xl cursor-pointer">
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-zinc-600 text-sm">PDF Report</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-9 bg-zinc-50 border-none h-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-mono text-xs text-zinc-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 align-middle">
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle font-semibold">₹{parseFloat(order.total_amount).toLocaleString()}</td>
                    <td className="p-4 align-middle">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-[180px] p-2 rounded-2xl shadow-xl z-50">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 py-1">Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, "Pending")} className="gap-2 rounded-xl">
                               <Clock className="w-4 h-4 text-amber-500" /> Mark Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, "Processing")} className="gap-2 rounded-xl">
                               <Package className="w-4 h-4 text-zinc-500" /> Mark Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, "Shipped")} className="gap-2 rounded-xl">
                               <Truck className="w-4 h-4 text-blue-500" /> Mark Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, "Delivered")} className="gap-2 rounded-xl">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mark Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(order.id, "Cancelled")} className="gap-2 rounded-xl">
                               <XCircle className="w-4 h-4 text-red-500" /> Mark Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-3 py-1">Invoicing</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => downloadInvoice(order)} className="gap-2 rounded-xl">
                               <Download className="w-4 h-4 text-primary" /> Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuGroup>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedOrder(order);
                                setTrackingId(order.tracking_id || "");
                                setCarrier(order.carrier || "");
                                setIsTrackingModalOpen(true);
                              }} 
                              className="gap-2 rounded-xl"
                            >
                              <Truck className="w-4 h-4 text-primary" /> Update Tracking
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={async () => {
                                setLoading(true);
                                const { data: items } = await supabase
                                  .from("order_items")
                                  .select("*, products(name, image_url)")
                                  .eq("order_id", order.id);
                                setSelectedOrder({ ...order, items: items || [] });
                                setLoading(false);
                              }}
                              className="gap-2 rounded-xl"
                            >
                              <Eye className="w-4 h-4 text-zinc-500" /> View Details
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="w-8 h-8 opacity-20" />
                        <p>No orders found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details & Tracking Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />
            
            {isTrackingModalOpen ? (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl border border-zinc-100"
              >
                <h3 className="text-xl font-black text-zinc-950 mb-2">Update Tracking</h3>
                <p className="text-sm text-zinc-500 mb-6">Enter logistics details for order #{selectedOrder?.id.slice(0, 8)}</p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logistics Partner</label>
                    <Input 
                      placeholder="e.g. Delhivery, BlueDart" 
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="h-12 rounded-xl bg-zinc-50 border-zinc-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tracking ID / AWB</label>
                    <Input 
                      placeholder="e.g. 123456789" 
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="h-12 rounded-xl bg-zinc-50 border-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsTrackingModalOpen(false);
                      setSelectedOrder(null);
                    }}
                    className="flex-1 h-12 rounded-xl font-bold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => updateTracking(selectedOrder?.id)}
                    className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    Save Details
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl border border-zinc-100 flex flex-col"
              >
                <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-zinc-950">Order Details</h3>
                      <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                    </div>
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">#{selectedOrder.id}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)} className="rounded-full h-12 w-12 hover:bg-zinc-100">
                    <XCircle className="w-6 h-6 text-zinc-400" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Customer Information</h4>
                      <div className="p-5 rounded-2xl bg-zinc-50 space-y-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Name</span>
                          <span className="font-bold text-zinc-900">{selectedOrder.customer_name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Email</span>
                          <span className="font-bold text-zinc-600">{selectedOrder.customer_email}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Phone</span>
                          <span className="font-bold text-zinc-600">{selectedOrder.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Payment & Tracking</h4>
                      <div className="p-5 rounded-2xl bg-zinc-50 space-y-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Method</span>
                          <span className="font-bold text-zinc-900">{selectedOrder.payment_method === "ONLINE" ? "Online Payment (Razorpay)" : "Cash on Delivery"}</span>
                        </div>
                        
                        {selectedOrder.razorpay_payment_id && (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Transaction ID</span>
                            <span className="font-bold text-zinc-600 text-xs">{selectedOrder.razorpay_payment_id}</span>
                          </div>
                        )}

                        {selectedOrder.tracking_id && (
                          <div className="pt-4 border-t border-zinc-200">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tracking Info</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Truck className="w-4 h-4 text-blue-500" />
                              <span className="font-bold text-zinc-900">{selectedOrder.carrier}: {selectedOrder.tracking_id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Line Items</h4>
                    <div className="rounded-2xl border border-zinc-100 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-zinc-50 border-b border-zinc-100">
                          <tr>
                            <th className="h-10 px-4 text-left align-middle font-black text-[10px] uppercase tracking-widest text-zinc-400">Product</th>
                            <th className="h-10 px-4 text-center align-middle font-black text-[10px] uppercase tracking-widest text-zinc-400">Qty</th>
                            <th className="h-10 px-4 text-right align-middle font-black text-[10px] uppercase tracking-widest text-zinc-400">Unit Price</th>
                            <th className="h-10 px-4 text-right align-middle font-black text-[10px] uppercase tracking-widest text-zinc-400">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {selectedOrder.items?.map((item: any) => (
                            <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                                    <img src={item.products?.image_url || "/placeholder.png"} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-bold text-zinc-900">{item.products?.name}</span>
                                </div>
                              </td>
                              <td className="p-4 align-middle text-center font-bold text-zinc-600">{item.quantity}</td>
                              <td className="p-4 align-middle text-right font-bold text-zinc-600">₹{parseFloat(item.unit_price).toLocaleString()}</td>
                              <td className="p-4 align-middle text-right font-black text-zinc-900">₹{(item.quantity * item.unit_price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-zinc-50/50">
                          <tr>
                            <td colSpan={3} className="p-4 text-right font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Grand Total</td>
                            <td className="p-4 text-right font-black text-xl text-primary">₹{parseFloat(selectedOrder.total_amount).toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                  <Button onClick={() => setSelectedOrder(null)} className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Close Details
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

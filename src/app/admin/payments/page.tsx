"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  CreditCard, 
  Search, 
  ExternalLink, 
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  FileSpreadsheet,
  PieChart
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*, orders(customer_name, customer_email)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [supabase]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "failed": return "bg-red-100 text-red-700 border-red-200";
      case "refunded": return "bg-zinc-100 text-zinc-700 border-zinc-200";
      default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const downloadCSV = () => {
    const headers = ["Payment ID", "Order ID", "Amount", "Method", "Status", "Date"];
    const rows = payments.map(p => [
      p.id,
      p.order_id,
      p.amount,
      p.payment_method,
      p.status,
      new Date(p.created_at).toLocaleDateString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTaxReport = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Tax Report - UC Enterprises", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    
    const totalRevenue = payments.reduce((acc, p) => p.status === 'completed' ? acc + (p.amount || 0) : acc, 0);
    const estimatedTax = totalRevenue * 0.18; // Assuming 18% GST for demo
    
    doc.text(`Total Revenue (Completed): INR ${totalRevenue.toLocaleString()}`, 14, 40);
    doc.text(`Estimated Tax (18% GST): INR ${estimatedTax.toLocaleString()}`, 14, 48);
    
    const tableData = payments.filter(p => p.status === 'completed').map(p => [
      p.id.slice(0, 8),
      new Date(p.created_at).toLocaleDateString(),
      `INR ${p.amount.toLocaleString()}`,
      `INR ${(p.amount * 0.18).toLocaleString()}`
    ]);
    
    (doc as any).autoTable({
      head: [['Payment ID', 'Date', 'Amount', 'GST (18%)']],
      body: tableData,
      startY: 55,
      theme: 'striped',
      headStyles: { fillStyle: [100, 100, 255] }
    });
    
    doc.save(`tax_report_${new Date().toISOString().split('T')[0]}.pdf`);
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
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="flex gap-3">
          <Button onClick={downloadCSV} variant="outline" className="gap-2 border-zinc-200 rounded-xl h-11 px-6 font-bold">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Download CSV
          </Button>
          <Button onClick={downloadTaxReport} variant="outline" className="gap-2 border-zinc-200 rounded-xl h-11 px-6 font-bold">
            <PieChart className="w-4 h-4 text-primary" />
            Tax Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{payments.reduce((acc, curr) => acc + (curr.status === "completed" ? parseFloat(curr.amount) : 0), 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {payments.filter(p => p.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {payments.filter(p => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === "failed").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9 bg-zinc-50 border-none h-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="font-mono text-xs text-zinc-500">#{payment.transaction_id || payment.id.slice(0, 12).toUpperCase()}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium text-primary">#{payment.order_id.slice(0, 8).toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{payment.orders?.customer_email}</div>
                    </td>
                    <td className="p-4 align-middle font-semibold">
                      ₹{parseFloat(payment.amount).toLocaleString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span className="capitalize">{payment.payment_method || "Credit Card"}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(payment.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <CreditCard className="w-8 h-8 opacity-20" />
                        <p>No transactions found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

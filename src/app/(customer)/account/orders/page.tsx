"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, ChevronRight, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "archived">("current");
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (
              *,
              products (*)
            )
          `
          )
          .eq("customer_email", user.email)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        toast.error(error.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [supabase]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      case "shipped":
        return "bg-blue-50 text-blue-600 border-blue-100";
      default:
        return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "current") return order.status !== "Delivered" && order.status !== "Cancelled";
    return order.status === "Delivered" || order.status === "Cancelled";
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b-2 border-zinc-950 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">My Orders</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Track your orders, deliveries and invoice history</p>
        </div>

        <div className="flex items-center bg-zinc-100 p-1 border border-zinc-200">
          <button
            onClick={() => setActiveTab("current")}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "current" ? "bg-white text-primary shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            Ongoing Orders
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "archived" ? "bg-white text-primary shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            Past Orders
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="SEARCH BY ORDER ID OR PRODUCT NAME..."
            className="w-full bg-white border border-zinc-100 pl-12 pr-4 py-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary transition-all rounded-none"
          />
        </div>
        <Button variant="outline" className="h-14 border-zinc-100 bg-white text-zinc-400 font-black uppercase tracking-widest text-[10px] px-8 rounded-none flex items-center gap-2 hover:bg-zinc-50">
          <Filter className="w-4 h-4" /> Filter Orders
        </Button>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white border border-zinc-100 shadow-xl overflow-hidden hover:border-primary/50 transition-all group">
            <div className="bg-zinc-50 p-6 flex flex-wrap items-center justify-between gap-6 border-b border-zinc-100">
              <div className="flex gap-10">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Order ID</p>
                  <p className="text-xs font-black uppercase">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Order Date</p>
                  <p className="text-xs font-black uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Order Total</p>
                  <p className="text-xs font-black uppercase">{formatCurrency(order.total_amount)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <Button variant="outline" className="h-10 border-zinc-100 text-zinc-400 hover:text-primary rounded-none px-4">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-zinc-50 relative shrink-0">
                    <Image src={item.products?.image_url || "/images/placeholder.png"} alt={item.products?.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black tracking-tight uppercase group-hover:text-primary transition-colors">{item.products?.name}</h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                      Qty: {item.quantity} | Price: {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <Button 
                    render={<Link href={`/track-order?orderId=${order.id}&email=${order.customer_email}`} />}
                    className="h-12 bg-zinc-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-none"
                  >
                    Track Order <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>

            {order.status === "Shipped" && (
              <div className="px-8 py-4 bg-zinc-50/50 border-t border-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-primary" />
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Courier Tracking: <span className="text-zinc-900">{order.carrier || "Standard Delivery"} - {order.tracking_id || "Awaiting Update"}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">On the way</p>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="bg-white border border-zinc-100 shadow-xl p-20 text-center space-y-4">
            <Package className="w-12 h-12 text-zinc-200 mx-auto" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">No orders found for this section.</p>
            <Link href="/products">
              <Button variant="outline" className="rounded-none font-black uppercase tracking-widest text-[10px] h-10 px-6">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackageCheck, Search, Loader2, Package, CheckCircle2, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";

function TrackOrderContent() {
  const [orderId, setOrderId] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const supabase = createClient();

  const performTracking = async (id: string, contact: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data, error: supabaseError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .eq("id", id)
        .or(`customer_email.eq.${contact},phone.eq.${contact}`)
        .maybeSingle();

      if (supabaseError) throw supabaseError;
      
      if (!data) {
        setError("Order nahi mila. Kripya Order ID aur registered details (Email/Phone) check karein.");
      } else {
        setOrder(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("Kuch galti hui tracking ke waqt. Kripya baad mein koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlOrderId = searchParams.get("orderId");
    const urlEmail = searchParams.get("email");

    if (urlOrderId && urlEmail) {
      setOrderId(urlOrderId);
      setEmailOrPhone(urlEmail);
      performTracking(urlOrderId, urlEmail);
    }
  }, [searchParams]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    performTracking(orderId, emailOrPhone);
  };

  const getStatusStep = (status: string) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    const currentIdx = steps.indexOf(status.toLowerCase());
    return currentIdx === -1 ? 0 : currentIdx;
  };

  return (
    <div className="bg-zinc-50 min-h-screen pb-20">
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Order Tracking</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-950">Track your industrial supply</h1>
            <p className="text-sm leading-6 text-zinc-600 max-w-xl">
              Enter your Order ID and registered email or phone number to see live status updates, shipment timelines, and delivery details.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-12">
          {/* Tracking Form */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-white">
              <h2 className="text-xl font-bold text-zinc-950 mb-6">Track Shipment</h2>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order ID</label>
                  <Input 
                    placeholder="e.g. 8b2f91..." 
                    className="h-12 rounded-xl bg-zinc-50 border-zinc-100"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email or Phone</label>
                  <Input 
                    placeholder="Registered details" 
                    className="h-12 rounded-xl bg-zinc-50 border-zinc-100"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  className="w-full h-12 rounded-xl font-bold gap-2 text-base shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  {loading ? "Tracking..." : "Track Now"}
                </Button>
              </form>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</div>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-7">
            {order ? (
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-white">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Status for Order</p>
                      <h3 className="text-2xl font-black text-zinc-950 uppercase tracking-tighter">#{order.id.slice(0, 8)}</h3>
                    </div>
                    <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                      {order.status}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative flex justify-between">
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-100 z-0" />
                    <div 
                      className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-1000" 
                      style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                    />
                    
                    {[
                      { icon: Clock, label: "Placed", status: "pending" },
                      { icon: Package, label: "Processing", status: "processing" },
                      { icon: Truck, label: "Shipped", status: "shipped" },
                      { icon: CheckCircle2, label: "Delivered", status: "delivered" },
                    ].map((step, idx) => {
                      const isCompleted = getStatusStep(order.status) >= idx;
                      const Icon = step.icon;
                      return (
                        <div key={step.label} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                            isCompleted ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white border-2 border-zinc-100 text-zinc-300"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest",
                            isCompleted ? "text-zinc-950" : "text-zinc-400"
                          )}>{step.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tracking Info */}
                  {order.tracking_id && (
                    <div className="mt-10 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Truck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Tracking Information</p>
                          <p className="text-sm font-bold text-zinc-950">{order.carrier || "Delivery Partner"} — {order.tracking_id}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-white">
                  <h4 className="font-bold text-zinc-950 mb-6">Order Items</h4>
                  <div className="divide-y divide-zinc-100">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                        <div className="w-16 h-16 rounded-xl bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
                          {item.products?.image_url && (
                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-zinc-950">{item.products?.name}</p>
                          <p className="text-xs text-zinc-500">Qty: {item.quantity} × ₹{item.unit_price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-zinc-950">₹{item.quantity * item.unit_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-zinc-100 flex justify-between items-center">
                    <p className="text-sm font-bold text-zinc-500">Total Amount Paid</p>
                    <p className="text-2xl font-black text-zinc-950">₹{order.total_amount}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <PackageCheck className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 mb-2">Awaiting Tracking Info</h3>
                <p className="text-sm text-zinc-500 max-w-xs">
                  Once you enter your details, we'll fetch the real-time movement of your shipment from our logistics partners.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

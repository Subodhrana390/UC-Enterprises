"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, CreditCard, MapPin, Phone, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCartItems, getCartTotal, clearCart, type CartItem } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  useEffect(() => {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      router.push("/cart");
      return;
    }
    setItems(cartItems);

    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Fetch Profile for Contact Info
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setForm(prev => ({
            ...prev,
            fullName: profile.full_name || user.user_metadata?.full_name || "",
            email: profile.email || user.email || "",
            phone: profile.phone || "",
          }));
        }

        // 2. Fetch Addresses for Shipping
        const { data: addrData } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (addrData && addrData.length > 0) {
          setAddresses(addrData);
          const defaultAddr = addrData.find(a => a.is_default) || addrData[0];
          setSelectedAddressId(defaultAddr.id);
          setForm(prev => ({
            ...prev,
            address: `${defaultAddr.address_line1}${defaultAddr.address_line2 ? ", " + defaultAddr.address_line2 : ""}`,
            city: defaultAddr.city || "",
            state: defaultAddr.state || "",
            postalCode: defaultAddr.postal_code || "",
          }));
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [router, supabase]);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    setForm(prev => ({
      ...prev,
      address: `${addr.address_line1}${addr.address_line2 ? ", " + addr.address_line2 : ""}`,
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postal_code || "",
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.postalCode) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: form.fullName,
          customer_email: form.email,
          phone: form.phone,
          shipping_address: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postalCode,
          total_amount: getCartTotal(),
          status: "pending",
          payment_method: "COD",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Order placed successfully!");
      clearCart();
      router.push(`/account/orders?success=true&id=${order.id}`);
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center font-bold text-zinc-400 animate-pulse">PREPARING CHECKOUT...</div>;

  return (
    <div className="bg-zinc-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary mb-8">
          <ChevronLeft className="h-4 w-4" />
          Back to cart
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            {/* Contact Information */}
            <section className="bg-white border border-orange-100 p-8 shadow-sm rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Contact Information</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name *</label>
                  <Input 
                    value={form.fullName} 
                    onChange={e => setForm({...form, fullName: e.target.value})} 
                    placeholder="Enter your name"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone Number *</label>
                  <Input 
                    value={form.phone} 
                    onChange={e => setForm({...form, phone: e.target.value})} 
                    placeholder="10-digit mobile number"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address (Optional)</label>
                  <Input 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    placeholder="email@example.com"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address Selection */}
            <section className="bg-white border border-orange-100 p-8 shadow-sm rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Shipping Address</h2>
                </div>
                <Link href="/account/address-book">
                  <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest gap-2">
                    <Plus className="w-3 h-3" /> Add New
                  </Button>
                </Link>
              </div>

              {addresses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 mb-8">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => handleSelectAddress(addr)}
                      className={cn(
                        "p-4 border-2 rounded-2xl cursor-pointer transition-all relative group",
                        selectedAddressId === addr.id 
                          ? "border-primary bg-orange-50 shadow-lg shadow-primary/5" 
                          : "border-zinc-100 bg-white hover:border-orange-200"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{addr.type}</span>
                         {selectedAddressId === addr.id && <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-white" /></div>}
                      </div>
                      <p className="text-xs font-black mb-1">{addr.full_name}</p>
                      <p className="text-[10px] font-medium text-zinc-500 leading-relaxed">
                        {addr.address_line1}, {addr.address_line2 && addr.address_line2 + ", "}{addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8 p-10 border-2 border-dashed border-orange-100 rounded-[2rem] text-center">
                  <p className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest">No saved addresses found</p>
                  <Link href="/account/address-book">
                    <Button className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-xs">Add Your First Address</Button>
                  </Link>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Or Enter New Address *</label>
                  <Input 
                    value={form.address} 
                    onChange={e => {
                      setForm({...form, address: e.target.value});
                      setSelectedAddressId(null);
                    }} 
                    placeholder="House no, Building, Street name"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">City *</label>
                  <Input 
                    value={form.city} 
                    onChange={e => setForm({...form, city: e.target.value})} 
                    placeholder="e.g. Zirakpur"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">State *</label>
                  <Input 
                    value={form.state} 
                    onChange={e => setForm({...form, state: e.target.value})} 
                    placeholder="e.g. Punjab"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">PIN Code *</label>
                  <Input 
                    value={form.postalCode} 
                    onChange={e => setForm({...form, postalCode: e.target.value})} 
                    placeholder="6-digit PIN"
                    className="h-12 border-orange-100 focus:border-primary rounded-xl"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white border border-orange-100 p-8 shadow-sm rounded-2xl">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Payment Method</h2>
              </div>
              <div className="p-4 border-2 border-primary bg-orange-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Cash on Delivery / Business Invoice</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pay after verification or on delivery</p>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-primary bg-white" />
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="space-y-6">
            <div className="bg-zinc-950 text-white p-8 rounded-[2rem] shadow-xl sticky top-10">
              <h2 className="text-xl font-black tracking-tight mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-12 h-12 bg-white/10 rounded-lg shrink-0 overflow-hidden">
                      <Image src={item.image_url || "/images/prod_main.png"} alt={item.name} fill className="object-contain p-2" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.quantity} x {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-6 space-y-3">
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(getCartTotal())}</span>
                </div>
              </div>
              <Button 
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-8 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-white hover:text-zinc-950 transition-all shadow-lg shadow-primary/20"
              >
                {submitting ? "Processing..." : "Place Order Now"}
              </Button>
            </div>

            <div className="bg-orange-100/50 p-6 rounded-2xl border border-orange-200 text-center">
              <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1">GST Benefits</p>
              <p className="text-[10px] font-bold text-orange-700/70">Registered businesses can claim input tax credit on this order.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

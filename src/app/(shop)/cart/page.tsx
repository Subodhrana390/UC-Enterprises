import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPriceINR } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CartItemActions } from "@/components/shop/CartItemActions";
import { CartQuantityControls } from "@/components/shop/CartQuantityControls";
import { ApplyCouponForm } from "@/components/shop/ApplyCouponForm";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id);

  const subtotal = cartItems?.reduce((acc, item: any) => acc + (item.products?.base_price * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? 15.00 : 0;
  const gst = subtotal * 0.18;
  const total = subtotal + shipping + gst;

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-10 pb-20 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase font-headline">Procurement Manifest</h1>
          <p className="text-on-surface-variant font-bold text-xs uppercase tracking-widest opacity-60">
            Review your industrial component selection and finalize the distribution protocol.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8">
            {/* Cart Items List */}
            <div className="space-y-6">
              {cartItems && cartItems.length > 0 ? cartItems.map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl flex flex-col md:flex-row gap-8 items-start md:items-center border border-border/40 hover:shadow-xl hover:shadow-primary/5 transition-all">
                  <div className="w-32 h-32 bg-surface rounded-2xl flex-shrink-0 flex items-center justify-center p-4 relative shadow-inner">
                    <Image src={item.products?.images?.[0] || ""} alt={item.products?.name} fill className="object-contain p-4 grayscale-[0.2]" />
                  </div>
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                    <div className="md:col-span-8 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-xl leading-none uppercase tracking-tight mb-3">{item.products?.name}</h4>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="bg-surface border-border/60 text-[10px] font-black font-mono tracking-tighter py-0.5 opacity-60">
                            {item.products?.sku}
                          </Badge>
                        </div>
                      </div>
                      <CartItemActions cartItemId={item.id} />
                    </div>
                    
                    <div className="md:col-span-4 flex flex-col items-start md:items-end justify-between gap-6 border-l border-border/20 md:pl-6">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-60">Unit Price</p>
                        <p className="font-black text-on-surface text-lg font-headline">{formatPriceINR(item.products?.base_price ?? 0)}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-1">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-60 w-full text-left md:text-right">
                          Quantity
                        </p>
                        <CartQuantityControls
                          cartItemId={item.id}
                          quantity={item.quantity}
                          maxStock={item.products?.stock_quantity}
                        />
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1 opacity-60">Line Valuation</p>
                        <p className="font-black text-2xl text-primary font-headline tracking-tighter">{formatPriceINR((item.products?.base_price ?? 0) * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center space-y-4 opacity-30">
                    <span className="material-symbols-outlined text-6xl">shopping_basket</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No procurement manifestations found in your current session</p>
                    <Link href="/search">
                        <Button variant="ghost" className="mt-4 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">Explore Global Distribution</Button>
                    </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar Summary */}
          <aside className="lg:col-span-4">
            <div className="bg-primary text-white p-10 rounded-3xl sticky top-28 shadow-2xl shadow-primary/20 border-b-8 border-blue-950">
              <h2 className="text-3xl font-black tracking-tight mb-10 uppercase font-headline">Order Summary</h2>
              <div className="space-y-6 mb-10 opacity-80">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatPriceINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>Estimated Shipping</span>
                  <span>{formatPriceINR(shipping)}</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest items-center">
                  <div className="flex items-center gap-2">
                    <span>GST (18%)</span>
                    <Badge variant="outline" className="text-white border-white/20 px-1 font-mono text-[9px] py-0 cursor-default">INDUSTRIAL</Badge>
                  </div>
                  <span>{formatPriceINR(gst)}</span>
                </div>
              </div>
              
              <div className="py-8 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-4 opacity-60">Coupon Code</p>
                <ApplyCouponForm />
              </div>

              <div className="py-8 border-t border-white/10 mb-10">
                <div className="flex justify-between items-end">
                  <p className="text-sm font-black uppercase tracking-widest opacity-60">Total Payable</p>
                  <p className="text-4xl font-black tracking-tighter font-headline">{formatPriceINR(total)}</p>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest mt-4 opacity-40 text-right">Prices in INR. Net payable at checkout.</p>
              </div>

              <Link href={cartItems && cartItems.length > 0 ? "/checkout" : "#"}>
                <Button disabled={!cartItems || cartItems.length === 0} className="w-full h-16 bg-white text-primary font-black text-sm rounded-2xl shadow-xl hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.15em] flex items-center justify-center gap-3">
                  Finalize Procurement
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

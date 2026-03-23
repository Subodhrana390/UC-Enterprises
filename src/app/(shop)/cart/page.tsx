import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatPriceINR } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CartItemActions } from "@/components/shop/CartItemActions";
import { CartQuantityControls } from "@/components/shop/CartQuantityControls";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, products(*)")
    .eq("user_id", user.id);

  const subtotal = cartItems?.reduce((acc, item: any) => acc + (item.products?.base_price * item.quantity), 0) || 0;

  return (
    <div className="bg-white min-h-screen text-[#1a1c1d]">
      <main className="max-w-[1200px] mx-auto px-4 py-12 md:py-20">
        
        {/* Shopify Header Style */}
        <header className="flex justify-between items-end mb-10 border-b border-[#ebebeb] pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
          <Link href="/search" className="text-sm font-medium text-[#005bd3] underline underline-offset-4 hover:text-blue-700">
            Continue shopping
          </Link>
        </header>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Cart Items Table Style */}
            <div className="lg:col-span-8">
              <div className="hidden md:grid grid-cols-12 text-[11px] font-bold uppercase tracking-widest text-[#616161] mb-4 px-2">
                <div className="col-span-7">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y divide-[#ebebeb] border-t border-[#ebebeb]">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-7 flex gap-6">
                      <div className="w-24 h-24 bg-[#f5f5f5] rounded-lg relative flex-shrink-0 border border-[#ebebeb]">
                        <Image 
                          src={item.products?.images?.[0] || ""} 
                          alt={item.products?.name} 
                          fill 
                          className="object-contain p-2" 
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-1">
                        <h3 className="font-semibold text-base">{item.products?.name}</h3>
                        <p className="text-xs text-[#616161]">SKU: {item.products?.sku}</p>
                        <p className="text-sm font-medium mt-1">{formatPriceINR(item.products?.base_price)}</p>
                        <CartItemActions cartItemId={item.id} />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-3 flex justify-start md:justify-center">
                      <CartQuantityControls
                        cartItemId={item.id}
                        quantity={item.quantity}
                        maxStock={item.products?.stock_quantity}
                      />
                    </div>

                    {/* Line Total */}
                    <div className="col-span-2 text-right font-medium text-sm md:text-base">
                      {formatPriceINR(item.products?.base_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary Sidebar */}
            <aside className="lg:col-span-4">
              <div className="bg-[#f7f7f7] rounded-xl p-8 sticky top-28">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm text-[#616161]">
                    <span>Subtotal</span>
                    <span className="text-[#1a1c1d] font-medium">{formatPriceINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#616161]">
                    <span>Shipping</span>
                    <span className="italic">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#616161]">
                    <span>Tax</span>
                    <span className="italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[#ebebeb] pt-6 mb-8">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-base font-semibold">Estimated Total</span>
                    <span className="text-2xl font-bold">{formatPriceINR(subtotal)}</span>
                  </div>
                  <p className="text-[11px] text-[#616161] leading-relaxed">
                    Taxes and shipping calculated at checkout. All prices in INR.
                  </p>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button className="w-full h-14 bg-[#1a1c1d] hover:bg-[#333] text-white font-semibold rounded-lg text-base shadow-none transition-all">
                    Check out
                  </Button>
                </Link>

                <div className="mt-6 flex justify-center gap-4 opacity-40">
                   {/* Add small payment icons here (Visa, MC, etc) */}
                   <span className="material-symbols-outlined text-xl">payments</span>
                   <span className="material-symbols-outlined text-xl">shield</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <Link href="/search">
              <Button className="bg-[#1a1c1d] text-white px-8 h-12 rounded-full">
                Continue shopping
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
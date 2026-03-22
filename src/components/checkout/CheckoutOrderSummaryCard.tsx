import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPriceINR } from "@/lib/utils";

type CartLine = {
  id: string;
  quantity: number;
  products?: {
    name?: string;
    sku?: string;
    images?: string[];
    base_price?: number;
  } | null;
};

/** stitch_screens/list1/checkout.html — Order Summary sidebar */
export function CheckoutOrderSummaryCard({
  cartItems,
  subtotal,
  gst,
  totalAmount,
  shippingLabel = "PROMO FREE",
  footer,
}: {
  cartItems: CartLine[];
  subtotal: number;
  gst: number;
  totalAmount: number;
  shippingLabel?: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-surface-container-highest p-6 md:p-8 rounded-3xl border border-border/40 shadow-xl shadow-primary/5">
      <h3 className="font-headline text-lg font-black mb-6 text-on-surface uppercase tracking-tight">Order Summary</h3>

      <div className="space-y-5 mb-8">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 items-start justify-between">
            <div className="flex gap-3 min-w-0">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-border/20 relative">
                <Image
                  src={item.products?.images?.[0] || "/placeholder-product.png"}
                  alt={item.products?.name || ""}
                  fill
                  className="object-contain p-1.5 grayscale-[0.15]"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-on-surface leading-tight line-clamp-2">{item.products?.name}</p>
                <Badge variant="outline" className="text-[8px] font-mono mt-1 opacity-60">
                  SKU: {item.products?.sku}
                </Badge>
              </div>
            </div>
            <p className="text-sm font-black shrink-0">{formatPriceINR((item.products?.base_price ?? 0) * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border/30 pt-6 text-sm">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal</span>
          <span className="font-bold">{formatPriceINR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Shipping (Standard Express)</span>
          <span className="text-primary font-black text-xs uppercase">{shippingLabel}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Estimated GST (18%)</span>
          <span className="font-bold">{formatPriceINR(gst)}</span>
        </div>
        <div className="flex justify-between items-end pt-4 border-t border-border/20">
          <span className="text-on-surface font-black uppercase text-xs tracking-widest">Total</span>
          <span className="text-2xl font-black text-primary font-headline tracking-tighter">{formatPriceINR(totalAmount)}</span>
        </div>
        <p className="text-[10px] text-on-surface-variant italic pt-1">Prices in INR. Net payable at confirmation.</p>
      </div>

      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
}

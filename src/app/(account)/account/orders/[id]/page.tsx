import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceINR } from "@/lib/utils";
import { getOrderById } from "@/lib/actions/order";
import { RealTimeTracker } from "@/app/(account)/_components/RealTimeTracker";
import { OrderActions } from "@/app/(account)/_components/OrderActions";

interface OrderPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) notFound();

    const address = order.shipping_address;

    return (
        <div className="min-h-screen bg-[#f6f6f7] p-4 md:p-10 font-sans antialiased">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER & TOP NAV */}
                <header className="space-y-6">
                    <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#616161]">
                        <Link href="/account" className="hover:text-[#005bd3]">Account</Link>
                        <span className="text-[#d2d2d2]">/</span>
                        <Link href="/account/orders" className="hover:text-[#005bd3]">Orders</Link>
                        <span className="text-[#d2d2d2]">/</span>
                        <span className="text-[#1a1c1d]">#{order.id.substring(0, 8).toUpperCase()}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-[#1a1c1d] tracking-tight">
                                Order #{order.id.substring(0, 8).toUpperCase()}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <p className="text-sm text-[#616161]">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                        month: 'long', day: 'numeric', year: 'numeric'
                                    })}
                                </p>
                                <span className="text-[#d2d2d2]">|</span>
                                <Badge className="bg-[#e3f1df] text-[#008060] border-none px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-none">
                                    {order.status}
                                </Badge>
                                <Badge variant="outline" className="border-[#ebebeb] bg-white text-[#1a1c1d] text-[11px] font-bold px-3 py-1 uppercase tracking-wider">
                                    Paid
                                </Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="bg-white border-[#d2d2d2] h-10 px-6 font-semibold text-sm shadow-sm hover:bg-[#fafafa]">
                            Download Invoice
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT SIDE: ITEMS & TRACKING */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* PREMIUM TRACKER */}
                        <RealTimeTracker
                            status={order.status}
                            updatedAt={order.updated_at || order.created_at}
                        />

                        {/* ITEMS CARD */}
                        <div className="bg-white border border-[#ebebeb] rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#f1f1f1] flex justify-between items-center bg-white">
                                <h2 className="text-sm font-bold text-[#1a1c1d] uppercase tracking-wider">Shipment Details</h2>
                                <span className="text-[11px] font-medium text-[#616161]">Package 1 of 1</span>
                            </div>

                            <div className="divide-y divide-[#f1f1f1]">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="p-6 flex gap-6 items-center group">
                                        <div className="w-20 h-24 bg-[#f9f9f9] border border-[#f1f1f1] rounded-xl relative flex-shrink-0 overflow-hidden">
                                            <Image
                                                src={item.products?.images?.[0] || "/placeholder.png"}
                                                alt={item.products?.name}
                                                fill
                                                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-bold text-[#1a1c1d] leading-snug hover:text-[#005bd3] transition-colors cursor-pointer">
                                                {item.products?.name}
                                            </p>
                                            <p className="text-xs font-medium text-[#616161]">SKU: {item.products?.sku || 'N/A'}</p>
                                            <p className="text-xs font-bold text-[#1a1c1d] pt-1">QTY: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#1a1c1d]">
                                                {formatPriceINR(item.unit_price * item.quantity)}
                                            </p>
                                            <p className="text-[10px] text-[#616161] line-through decoration-[#d2d2d2]">
                                                {formatPriceINR((item.unit_price * 1.2) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: SUMMARY & ADDRESS */}
                    <div className="space-y-6">

                        {/* ORDER SUMMARY */}
                        <div className="bg-white border border-[#ebebeb] rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-[#f1f1f1]">
                                <h3 className="text-xs font-bold text-[#1a1c1d] uppercase tracking-widest">Order Summary</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-sm text-[#616161]">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[#1a1c1d]">{formatPriceINR(order.total_amount - (order.shipping_amount || 0))}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#616161]">
                                    <span>Shipping</span>
                                    <span className="text-[#008060] font-bold uppercase text-[10px] tracking-widest">
                                        {order.shipping_amount === 0 ? "Free" : formatPriceINR(order.shipping_amount)}
                                    </span>
                                </div>
                                <div className="pt-4 mt-2 border-t border-[#f1f1f1] flex justify-between items-end">
                                    <span className="text-sm font-bold text-[#1a1c1d]">Total</span>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-[#1a1c1d] tracking-tight">
                                            {formatPriceINR(order.total_amount)}
                                        </p>
                                        <p className="text-[10px] text-[#616161] font-medium uppercase">Inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SHIPPING & PAYMENT */}
                        <div className="bg-white border border-[#ebebeb] rounded-2xl shadow-sm p-6 space-y-6">
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-bold text-[#1a1c1d] uppercase tracking-widest">Delivery Address</h3>
                                {address ? (
                                    <div className="text-sm text-[#616161] leading-relaxed">
                                        <p className="text-[#1a1c1d] font-bold">{address.full_name}</p>
                                        <p>{address.address_line1}</p>
                                        <p>{address.city}, {address.state} — {address.pincode}</p>
                                        <p className="mt-2 text-[#1a1c1d] font-semibold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">phone_iphone</span>
                                            {address.phone_number}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-amber-600">Address not found</p>
                                )}
                            </section>

                            <section className="space-y-3 pt-6 border-t border-[#f1f1f1]">
                                <h3 className="text-[10px] font-bold text-[#1a1c1d] uppercase tracking-widest">Payment Method</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-5 bg-[#f6f6f7] border border-[#ebebeb] rounded-sm flex items-center justify-center">
                                        <span className="text-[8px] font-black italic">UPI</span>
                                    </div>
                                    <p className="text-xs font-medium text-[#1a1c1d]">Google Pay / PhonePe</p>
                                </div>
                            </section>
                        </div>

                        {/* 5. Quick Actions Footer */}
                        {/* 5. Quick Actions Footer */}
                        <div className="mt-auto p-4 bg-white border-t border-[#ebebed] flex gap-2 shrink-0">
                            <OrderActions
                                status={order.status}
                                orderId={order.id}
                                items={order.order_items || []}
                                userId={order.user_id}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}


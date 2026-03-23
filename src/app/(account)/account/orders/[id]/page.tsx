import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPriceINR } from "@/lib/utils";

interface OrderPageProps {
    params: { id: string };
}

export default async function page({ params }: OrderPageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: order, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (
        *,
        products (*)
      ),
      addresses (*)
    `)
        .eq("id", id)
        .single();

    console.log(order)
    if (!order) notFound();

    return (
        <div className="min-h-screen bg-[#f1f1f1] p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* SHOPIFY HEADER */}
                <header className="space-y-4">
                    <Link
                        href="/account/orders"
                        className="text-sm text-[#616161] hover:text-[#005bd3] flex items-center gap-1 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Orders
                    </Link>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-[#1a1c1d]">
                                Order #{order.id.substring(0, 8).toUpperCase()}
                            </h1>
                            <Badge className="bg-[#e3f1df] text-[#008060] border-none font-medium capitalize shadow-none">
                                {order.status}
                            </Badge>
                            <Badge variant="outline" className="border-[#d2d2d2] text-[#616161] font-medium bg-white">
                                Paid
                            </Badge>
                        </div>

                        <p className="text-sm text-[#616161]">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-[#ebebeb] rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-[#f1f1f1]">
                                <h2 className="text-sm font-semibold text-[#1a1c1d]">Items</h2>
                            </div>

                            <div className="divide-y divide-[#f1f1f1]">
                                {order.order_items?.map((item: any) => (
                                    <div key={item.id} className="p-4 flex gap-4 items-center">
                                        <div className="w-14 h-14 bg-[#f7f7f7] border border-[#f1f1f1] rounded-lg relative flex-shrink-0">
                                            <Image
                                                src={item.products?.images?.[0] || ""}
                                                alt={item.products?.name}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#1a1c1d]">{item.products?.name}</p>
                                            <p className="text-xs text-[#616161]">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium text-[#1a1c1d]">
                                            {formatPriceINR(item.price_at_purchase * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-[#fafafa] border-t border-[#f1f1f1] space-y-2">
                                <div className="flex justify-between text-sm text-[#616161]">
                                    <span>Subtotal</span>
                                    <span>{formatPriceINR(order.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-[#1a1c1d] pt-2 border-t border-[#ebebeb]">
                                    <span>Total</span>
                                    <span>{formatPriceINR(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white border border-[#ebebeb] rounded-xl shadow-sm p-5 space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold text-[#1a1c1d] uppercase tracking-wider mb-3">
                                    Shipping Address
                                </h3>
                                <div className="text-sm text-[#616161] leading-relaxed">
                                    <p className="text-[#1a1c1d] font-medium">{order.addresses?.full_name}</p>
                                    <p>{order.addresses?.address_line1}</p>
                                    <p>{order.addresses?.city}, {order.addresses?.state}</p>
                                    <p>{order.addresses?.pincode}</p>
                                    <p className="mt-2 text-[#1a1c1d]">{order.addresses?.phone_number}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
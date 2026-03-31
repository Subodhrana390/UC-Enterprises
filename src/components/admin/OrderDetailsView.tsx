"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    CreditCard,
    MapPin,
    FileText
} from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState, useEffect } from "react";
import { updateOrderStatus, getAllowedStatuses } from "@/lib/actions/admin/orders";
import { toast } from "sonner";

export function OrderDetailsView({ order, onUpdate }: { order: any, onUpdate: (s: string) => void }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [allowedStatuses, setAllowedStatuses] = useState<string[]>([]);

    useEffect(() => {
        getAllowedStatuses(order.status).then(setAllowedStatuses);
    }, [order.status]);

    const parseNotes = (notes: string) => {
        if (!notes) return {};
        return Object.fromEntries(
            notes.split(" | ").map(item => item.split(":"))
        );
    };

    const metadata = parseNotes(order.notes || "");

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            const result = await updateOrderStatus(order.id, newStatus);
            if (result.error) {
                toast.error(result.error);
            } else {
                onUpdate(newStatus);
                toast.success(`Order marked as ${newStatus}`);
            }
        } catch (e) {
            toast.error("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f6f6f7]">

            <div className="p-6 bg-white border-b border-[#ebebed] shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-[#202223]">
                            Order #{order.id.substring(0, 8).toUpperCase()}
                        </h2>
                        <p className="text-xs text-[#6d7175]">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <Badge className={`bg-[#e3f1df] text-[#005e4d] 
                    ${order.status === "cancelled" ? "bg-rose-600 text-white" : ""}
                    ${order.status === "delivered" ? "bg-green-600 text-white" : ""}
                    ${order.status === "shipped" ? "bg-blue-600 text-white" : ""}
                    ${order.status === "processing" ? "bg-yellow-600 text-white" : ""}
                    ${order.status === "returned" ? "bg-red-600 text-white" : ""}
                    border-[#bbe5b3] hover:bg-[#e3f1df]`}>
                        {order.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                <section className="bg-white rounded-xl border border-[#ebebed] shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-[#202223]">Update Fulfillment</h3>
                        {isUpdating && <span className="text-[10px] text-[#008060] animate-pulse font-medium">Saving...</span>}
                    </div>

                    <Select
                        defaultValue={order.status}
                        onValueChange={handleStatusChange}
                        disabled={isUpdating}
                    >
                        <SelectTrigger className="w-full h-10 border-[#babfc3] bg-white focus:ring-1 focus:ring-[#008060]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {allowedStatuses.includes("processing") && (
                                <SelectItem value="processing">Processing</SelectItem>
                            )}
                            {allowedStatuses.includes("shipped") && (
                                <SelectItem value="shipped">Shipped</SelectItem>
                            )}
                            {allowedStatuses.includes("delivered") && (
                                <SelectItem value="delivered">Delivered</SelectItem>
                            )}
                            {allowedStatuses.includes("cancelled") && (
                                <SelectItem value="cancelled" className="text-rose-600 font-medium">Cancelled</SelectItem>
                            )}
                            {allowedStatuses.includes("returned") && (
                                <SelectItem value="returned">Returned</SelectItem>
                            )}
                        </SelectContent>
                    </Select>

                    <p className="mt-3 text-[11px] text-[#6d7175]">
                        Current status: <strong>{order.status}</strong>.
                        {allowedStatuses.length > 0
                            ? ` Allowed transitions: ${allowedStatuses.join(", ")}`
                            : " No more status changes allowed."}
                    </p>
                </section>

                {/* 3. Items List */}
                <section className="bg-white rounded-xl border border-[#ebebed] shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#f1f1f1] flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#6d7175]" />
                        <h3 className="text-sm font-semibold text-[#202223]">Items</h3>
                        <Badge variant="secondary" className="ml-auto bg-[#f1f1f1] text-[#202223] text-[10px]">
                            {order.order_items?.length || 0} {order.order_items?.length === 1 ? 'item' : 'items'}
                        </Badge>
                    </div>

                    <div className="divide-y divide-[#f1f1f1]">
                        {order.order_items?.map((item: any) => (
                            <div key={item.id} className="p-4 flex gap-3 items-center">
                                {/* Product Image Placeholder */}
                                <div className="w-12 h-12 bg-[#f6f6f7] border border-[#ebebed] rounded-md flex items-center justify-center overflow-hidden shrink-0">
                                    {item.products?.images ? (
                                        <img src={item.products.images[0]} alt="" className="object-cover w-full h-full" />
                                    ) : (
                                        <Package className="w-5 h-5 text-[#babfc3]" />
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-[#005bd3] truncate hover:underline cursor-pointer">
                                        {item.products?.name || "Unknown Product"}
                                    </p>
                                    <p className="text-[10px] text-[#6d7175]">
                                        ₹ {item.unit_price?.toLocaleString()} × {item.quantity || 1}
                                    </p>
                                </div>

                                {/* Total per Item */}
                                <div className="text-xs font-medium text-[#202223]">
                                    ₹ {(item.unit_price * (item.quantity || 1)).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        {order.order_items?.length === 0 && (
                            <div className="p-8 text-center text-xs text-[#6d7175]">
                                No items found in this order.
                            </div>
                        )}
                    </div>
                </section>

                {/* Payment Status & Razorpay Info */}
                <div className="bg-white rounded-lg border border-[#ebebed] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 text-[#6d7175]" />
                        <h3 className="text-sm font-semibold text-[#202223]">Payment Details</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-[#6d7175]">Status</span>
                            <span className="font-medium text-[#008060] uppercase">{order.payment_status}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-[#6d7175]">Method</span>
                            <span className="font-medium capitalize">{metadata.method || order.payment_method || "N/A"}</span>
                        </div>
                        {metadata.method === "razorpay" && (
                            <div className="flex justify-between text-xs">
                                <span className="text-[#6d7175]">Razorpay ID</span>
                                <code className="bg-[#f1f1f1] px-1 rounded text-[10px] font-mono">{metadata.razorpay_payment_id || "N/A"}</code>
                            </div>
                        )}
                    </div>
                </div>

                {/* Customer & Shipping */}
                <div className="bg-white rounded-lg border border-[#ebebed] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-[#6d7175]" />
                        <h3 className="text-sm font-semibold text-[#202223]">Customer & Shipping</h3>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4">
                        <p className="text-sm font-medium text-[#005bd3] mb-1">{order.profiles?.full_name}</p>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="mt-3 pt-3 border-t border-[#f1f1f1]">
                            <p className="text-[10px] font-bold text-[#6d7175] uppercase tracking-wider mb-2">Shipping Address</p>
                            <div className="text-xs text-[#202223] space-y-0.5">
                                <p className="font-medium">{order.shipping_address.full_name}</p>
                                <p>{order.shipping_address.address_line1}</p>
                                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                                <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                                <p className="text-[#6d7175]">Phone: {order.shipping_address.phone_number}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-[#f1f1f1]">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#6d7175] uppercase">GST Invoice</span>
                            <Badge variant="outline" className="text-[10px] bg-gray-50">
                                {metadata.gst_invoice === 'requested' ? "YES (Requested)" : "NO"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white rounded-lg border border-[#ebebed] p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-[#6d7175]" />
                        <h3 className="text-sm font-semibold text-[#202223]">Financial Summary</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-[#6d7175]">Subtotal</span>
                            <span>₹{(order.total_amount - order.tax_amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6d7175]">Tax (GST)</span>
                            <span>₹{order.tax_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#6d7175]">Shipping</span>
                            <span>{order.shipping_amount === 0 ? "FREE" : `₹${order.shipping_amount}`}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm font-bold text-[#202223]">
                            <span>Total paid</span>
                            <span>₹{order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. FIXED FOOTER */}
            <div className="p-4 bg-white border-t border-[#ebebed] flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="flex-1 text-xs border-[#babfc3] font-semibold h-9">
                    Print Invoice
                </Button>
            </div>
        </div>
    );
}
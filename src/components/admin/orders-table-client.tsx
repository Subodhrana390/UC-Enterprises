"use client";

import { useState } from "react";

import { Sheet, SheetContent } from "../ui/sheet";
import { Search } from "lucide-react";
import { OrderDetailsView } from "./OrderDetailsView";

export function OrdersTableClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toString().includes(search);

        if (!matchesSearch) return false;

        switch (activeTab) {
            case "pending":
                return order.status === "pending"
            case "processing":
                return order.status === "processing";
            case "shipped":
                return order.status === "shipped";
            case "delivered":
                return order.status === "delivered";
            case "cancelled":
                return order.status === "cancelled";
            case "returned":
                return order.status === "returned";
            case "unpaid":
                return order.payment_status === "unpaid";
            case "paid":
                return order.payment_status === "paid";
            case "All":
            default:
                return true;
        }
    });

    return (
        <>
            {/* Tabs & Search */}
            <div className="flex px-4 gap-6 overflow-x-auto bg-white">
                {["all", "pending", "processing", "shipped", "delivered", "cancelled", "returned", "unpaid", "paid"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab
                            ? "border-[#008060] text-[#202223]"
                            : "border-transparent text-[#6d7175] hover:text-[#202223]"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        <span className="ml-2 text-[10px] text-[#ababab]">
                            {orders.filter(o => {
                                if (tab === "all") return true;
                                if (tab === "pending") return o.status === "pending";
                                if (tab === "processing") return o.status === "processing";
                                if (tab === "shipped") return o.status === "shipped";
                                if (tab === "delivered") return o.status === "delivered";
                                if (tab === "cancelled") return o.status === "cancelled";
                                if (tab === "returned") return o.status === "returned";
                                if (tab === "unpaid") return o.payment_status === "unpaid";
                                if (tab === "paid") return o.payment_status === "paid";
                                return true;
                            }).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="p-3 flex gap-2 bg-[#fafafa] border-b border-[#f1f1f1]">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7175]" />
                    <input
                        type="text"
                        placeholder="Filter orders"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#babfc3] rounded-md text-xs outline-none focus:ring-1 focus:ring-[#008060]"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#fafafa] border-b border-[#f1f1f1] text-[12px] text-[#6d7175] font-semibold">
                            <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded" /></th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f1f1]">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-[#f6f6f7] cursor-pointer group transition-colors"
                                >
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" className="rounded border-[#babfc3]" />
                                    </td>
                                    <td className="px-4 py-4 text-xs font-bold text-[#202223] group-hover:text-[#005bd3]">
                                        #{order.id.toString().substring(0, 5).toUpperCase()}
                                    </td>
                                    <td className="px-4 py-4 text-xs text-[#6d7175]">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-xs font-medium text-[#202223]">
                                        {order.profiles?.full_name || "Guest"}
                                    </td>
                                    <td className="px-4 py-4 text-xs font-medium text-[#202223]">
                                        ₹ {order.total_amount?.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <PaymentBadge status={order.payment_status} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-20 text-xs text-[#6d7175]">
                                    No orders found for this view.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <SheetContent className="p-0 sm:max-w-[500px]">
                    {selectedOrder && (
                        <OrderDetailsView
                            order={selectedOrder}
                            onUpdate={(s) => {
                                setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: s } : o));
                                setSelectedOrder({ ...selectedOrder, status: s });
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

// --- BADGES ---

function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    const isPositive = ["delivered", "shipped", "completed"].includes(s);
    const isNeutral = ["processing", "pending"].includes(s);

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${isPositive ? "bg-[#e3f1df] text-[#005e4d] border-[#bbe5b3]" :
            isNeutral ? "bg-[#fff4da] text-[#8a6116] border-[#ffe2b5]" :
                "bg-[#f9eaea] text-[#8e1f0b] border-[#f4bfbf]"
            }`}>
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
        </span>
    );
}

function PaymentBadge({ status }: { status: string }) {
    const isPaid = status?.toLowerCase() === "paid";
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${isPaid ? "bg-[#e3f1df] text-[#005e4d] border-transparent" : "bg-[#f1f1f1] text-[#6d7175] border-transparent"
            }`}>
            {isPaid ? "● Paid" : "○ Unpaid"}
        </span>
    );
}
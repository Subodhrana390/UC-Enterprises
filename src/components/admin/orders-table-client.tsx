"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import { Search, Filter, ChevronDown, Eye, MoreVertical, Package, User, Calendar, DollarSign, CreditCard, Truck, CheckCircle, XCircle, Clock, RefreshCw, IndianRupee } from "lucide-react";
import { OrderDetailsView } from "./OrderDetailsView";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export function OrdersTableClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const tabs = [
        { id: "all", label: "All Orders", icon: Package },
        { id: "pending", label: "Pending", icon: Clock },
        { id: "processing", label: "Processing", icon: RefreshCw },
        { id: "shipped", label: "Shipped", icon: Truck },
        { id: "delivered", label: "Delivered", icon: CheckCircle },
        { id: "cancelled", label: "Cancelled", icon: XCircle },
        { id: "returned", label: "Returned", icon: RefreshCw },
        { id: "unpaid", label: "Unpaid", icon: CreditCard },
        { id: "paid", label: "Paid", icon: DollarSign },
    ];

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            order.id.toString().includes(search) ||
            order.id.toString().toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        switch (activeTab) {
            case "pending":
                return order.status === "pending";
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
            case "all":
            default:
                return true;
        }
    });

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const toggleSelectOrder = (id: string) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return Clock;
            case "processing": return RefreshCw;
            case "shipped": return Truck;
            case "delivered": return CheckCircle;
            case "cancelled": return XCircle;
            default: return Package;
        }
    };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white">
                <div className="flex gap-1 overflow-x-auto px-4">
                    {tabs.map((tab) => {
                        const count = orders.filter(o => {
                            if (tab.id === "all") return true;
                            if (tab.id === "pending") return o.status === "pending";
                            if (tab.id === "processing") return o.status === "processing";
                            if (tab.id === "shipped") return o.status === "shipped";
                            if (tab.id === "delivered") return o.status === "delivered";
                            if (tab.id === "cancelled") return o.status === "cancelled";
                            if (tab.id === "returned") return o.status === "returned";
                            if (tab.id === "unpaid") return o.payment_status === "unpaid";
                            if (tab.id === "paid") return o.payment_status === "paid";
                            return true;
                        }).length;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                                <Badge variant="secondary" className="ml-1 bg-gray-100 text-gray-600">
                                    {count}
                                </Badge>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center justify-between gap-4 px-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 bg-white border-gray-200 focus:border-blue-400"
                    />
                </div>
                <Button variant="outline" size="sm" className="h-10 border-gray-200">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-gray-300"
                                />
                            </th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => {
                                const StatusIcon = getStatusIcon(order.status);
                                return (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => toggleSelectOrder(order.id)}
                                                className="rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm font-mono font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    #{order.id.toString().substring(0, 8).toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User className="h-3.5 w-3.5 text-gray-500" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {order.profiles?.full_name || "Guest Customer"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ₹ {order.total_amount?.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <PaymentBadge status={order.payment_status} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <StatusIcon className={cn(
                                                    "h-3.5 w-3.5",
                                                    order.status === "delivered" && "text-green-600",
                                                    order.status === "shipped" && "text-blue-600",
                                                    order.status === "pending" && "text-amber-600",
                                                    order.status === "processing" && "text-purple-600",
                                                    order.status === "cancelled" && "text-red-600"
                                                )} />
                                                <StatusBadge status={order.status} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center">
                                            <Package className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">No orders found</p>
                                            <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Selection Actions Bar */}
            {selectedOrders.length > 0 && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-3 z-50">
                    <span className="text-sm">{selectedOrders.length} orders selected</span>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        Bulk Update
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                        Export
                    </Button>
                </div>
            )}

            {/* Order Details Sheet */}
            <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <SheetContent className="p-0 sm:max-w-[600px] lg:max-w-[700px] overflow-y-auto">
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
        </div>
    );
}

// --- BADGES ---

function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();

    const config: Record<string, { label: string; className: string }> = {
        pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
        processing: { label: "Processing", className: "bg-purple-50 text-purple-700 border-purple-200" },
        shipped: { label: "Shipped", className: "bg-blue-50 text-blue-700 border-blue-200" },
        delivered: { label: "Delivered", className: "bg-green-50 text-green-700 border-green-200" },
        cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200" },
        returned: { label: "Returned", className: "bg-orange-50 text-orange-700 border-orange-200" },
    };

    const { label, className } = config[s] || { label: status, className: "bg-gray-50 text-gray-700 border-gray-200" };

    return (
        <Badge className={cn("border font-medium", className)}>
            {label}
        </Badge>
    );
}

function PaymentBadge({ status }: { status: string }) {
    const isPaid = status?.toLowerCase() === "paid";

    return (
        <Badge variant={isPaid ? "default" : "secondary"} className={cn(
            "font-medium gap-1.5",
            isPaid && "bg-green-50 text-green-700 border-green-200 hover:bg-green-50"
        )}>
            <div className={cn("h-1.5 w-1.5 rounded-full", isPaid ? "bg-green-600" : "bg-gray-400")} />
            {isPaid ? "Paid" : "Unpaid"}
        </Badge>
    );
}
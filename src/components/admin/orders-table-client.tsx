"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import {
    Search, Filter, ChevronDown, Eye, Package, User,
    Calendar, DollarSign, CreditCard, Truck, CheckCircle,
    XCircle, Clock, RefreshCw, IndianRupee
} from "lucide-react";
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

    const counts = useMemo(() => {
        return orders.reduce((acc, order) => {
            acc.all++;
            if (order.status) acc[order.status] = (acc[order.status] || 0) + 1;
            if (order.payment_status) acc[order.payment_status] = (acc[order.payment_status] || 0) + 1;
            return acc;
        }, { all: 0 } as Record<string, number>);
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const searchStr = search.toLowerCase();
            const matchesSearch =
                order.profiles?.full_name?.toLowerCase().includes(searchStr) ||
                order.id.toString().toLowerCase().includes(searchStr);

            if (!matchesSearch) return false;
            if (activeTab === "all") return true;

            return order.status === activeTab || order.payment_status === activeTab;
        });
    }, [orders, search, activeTab]);

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
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex gap-1 overflow-x-auto px-4 no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 outline-none",
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                            <Badge variant="secondary" className={cn(
                                "ml-1 bg-gray-100 text-gray-600",
                                activeTab === tab.id && "bg-blue-50 text-blue-600"
                            )}>
                                {counts[tab.id] || 0}
                            </Badge>
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search order ID or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="h-10 border-gray-200 flex-1 sm:flex-none">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        <ChevronDown className="h-3 w-3 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white mx-4 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-200">
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
                                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    #{order.id.toString().substring(0, 8).toUpperCase()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                                {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                                                    {order.profiles?.full_name?.charAt(0) || "G"}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                                    {order.profiles?.full_name || "Guest Customer"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center font-bold text-gray-900">
                                                <IndianRupee className="h-3 w-3 mr-0.5 text-gray-500" />
                                                {order.total_amount?.toLocaleString('en-IN')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <PaymentBadge status={order.payment_status} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusBadge status={order.status} icon={StatusIcon} />
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-blue-600"
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
                                <td colSpan={8} className="text-center py-20 bg-gray-50/30">
                                    <div className="flex flex-col items-center gap-3">
                                        <Package className="h-12 w-12 text-gray-200" />
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold text-gray-900">No orders found</p>
                                            <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
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
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 z-50 animate-in fade-in slide-in-from-bottom-4">
                    <span className="text-sm font-medium border-r border-gray-700 pr-6">
                        {selectedOrders.length} orders selected
                    </span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 h-8">
                            Bulk Update
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800 h-8">
                            Export PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-950/30 h-8"
                            onClick={() => setSelectedOrders([])}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Order Details Sheet */}
            <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <SheetContent className="p-0 sm:max-w-[600px] lg:max-w-[700px]">
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

// --- REFACTORED BADGES ---

function StatusBadge({ status, icon: Icon }: { status: string; icon: any }) {
    const s = status?.toLowerCase();

    const config: Record<string, { label: string; className: string; iconClass: string }> = {
        pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", iconClass: "text-amber-600" },
        processing: { label: "Processing", className: "bg-purple-50 text-purple-700 border-purple-200", iconClass: "text-purple-600" },
        shipped: { label: "Shipped", className: "bg-blue-50 text-blue-700 border-blue-200", iconClass: "text-blue-600" },
        delivered: { label: "Delivered", className: "bg-green-50 text-green-700 border-green-200", iconClass: "text-green-600" },
        cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200", iconClass: "text-red-600" },
        returned: { label: "Returned", className: "bg-orange-50 text-orange-700 border-orange-200", iconClass: "text-orange-600" },
    };

    const { label, className, iconClass } = config[s] || { label: status, className: "bg-gray-50 text-gray-700 border-gray-200", iconClass: "text-gray-500" };

    return (
        <Badge className={cn("border font-medium flex items-center gap-1.5 px-2.5 py-0.5", className)}>
            <Icon className={cn("h-3 w-3", iconClass)} />
            {label}
        </Badge>
    );
}

function PaymentBadge({ status }: { status: string }) {
    const isPaid = status?.toLowerCase() === "paid";

    return (
        <Badge variant="outline" className={cn(
            "font-medium gap-1.5 px-2.5 py-0.5",
            isPaid ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
        )}>
            <div className={cn("h-1.5 w-1.5 rounded-full", isPaid ? "bg-green-600 animate-pulse" : "bg-gray-400")} />
            {isPaid ? "Paid" : "Unpaid"}
        </Badge>
    );
}
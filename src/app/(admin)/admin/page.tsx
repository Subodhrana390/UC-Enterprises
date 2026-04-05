"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Package,
  Users,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard({
  recentOrders = [],
  totalRevenue = 0,
  totalOrders = 0,
  totalProducts = 0,
  totalUsers = 0
}: any) {

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 font-sans text-[#202223]">
      <div className="max-w-[1200px] mx-auto space-y-6">

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202223]">Dashboard</h1>
            <p className="text-sm text-[#6d7175]">Overview of MedicineFinder operations today.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none bg-white text-xs font-semibold h-9">
              Export Data
            </Button>
            <Button className="flex-1 sm:flex-none bg-[#008060] hover:bg-[#006e52] text-white text-xs font-semibold h-9">
              Add Product
            </Button>
          </div>
        </header>

        {/* Stats Grid - 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            delta="+12.5%"
            trend="up"
            icon={<IndianRupee size={16} />}
          />
          <StatsCard
            title="Active Orders"
            value={totalOrders}
            delta="+5.2%"
            trend="up"
            icon={<ShoppingBag size={16} />}
          />
          <StatsCard
            title="Inventory Items"
            value={totalProducts}
            delta="0%"
            trend="neutral"
            icon={<Package size={16} />}
          />
          <StatsCard
            title="Total Customers"
            value={totalUsers}
            delta="+2.4%"
            trend="up"
            icon={<Users size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table Area: 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-[#ebebed] shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#f1f1f1] px-5 py-4">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-[14px] font-bold">Recent Orders</CardTitle>
                  <span className="bg-[#f1f1f1] text-[#6d7175] text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Last 5
                  </span>
                </div>
                <Link href="/admin/orders" className="text-xs font-bold text-[#005bd3] hover:underline flex items-center gap-1">
                  View all <ArrowUpRight size={12} />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-[#6d7175] border-b border-[#f1f1f1] bg-[#fafafa]">
                        <th className="px-5 py-3 font-bold">Order ID</th>
                        <th className="px-5 py-3 font-bold">Customer</th>
                        <th className="px-5 py-3 font-bold text-right">Amount</th>
                        <th className="px-5 py-3 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f1f1]">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order: any) => (
                          <tr key={order.id} className="hover:bg-[#f6f6f7] transition-colors cursor-pointer group">
                            <td className="px-5 py-4 text-sm font-semibold text-[#202223]">
                              <span className="text-[#005bd3]">#{order.id.toString().substring(0, 6).toUpperCase()}</span>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#202223] font-medium">
                              {order.profiles?.full_name || "Guest User"}
                            </td>
                            <td className="px-5 py-4 text-sm text-right font-bold text-[#202223]">
                              ₹{order.total_amount?.toLocaleString()}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <StatusBadge status={order.status} />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#6d7175]">
                            No recent orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area: 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Store Status Card */}
            <Card className="bg-white border-[#ebebed] shadow-sm rounded-xl">
              <CardHeader className="px-5 py-4 border-b border-[#f1f1f1] flex flex-row justify-between items-center">
                <CardTitle className="text-[14px] font-bold">System Health</CardTitle>
                <MoreHorizontal size={14} className="text-[#6d7175]" />
              </CardHeader>
              <CardContent className="px-5 py-5 space-y-5">
                <StatusRow label="Medicine Portal" status="Active" />
                <StatusRow label="Stock Ledger Sync" status="Pending" />
                <StatusRow label="Payment Gateway" status="Active" />
                <Separator />
                <div className="bg-[#fff4e5] p-3 rounded-lg flex gap-3 border border-[#ffe1b2]">
                  <AlertCircle size={16} className="text-[#8a6116] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-[#5c3e00] uppercase tracking-wide">Action Required</p>
                    <p className="text-xs text-[#8a6116] leading-snug">3 Prescriptions awaiting verification from pharmacists.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white border-[#ebebed] shadow-sm rounded-xl">
              <CardContent className="p-5">
                <h3 className="text-[14px] font-bold mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-2">
                  <QuickLink label="Orders" href="/admin/orders" color="bg-blue-50 text-blue-700" />
                  <QuickLink label="Stock" href="/admin/inventory" color="bg-emerald-50 text-emerald-700" />
                  <QuickLink label="Users" href="/admin/users" color="bg-purple-50 text-purple-700" />
                  <QuickLink label="Quotes" href="/admin/quotes" color="bg-amber-50 text-amber-700" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components for Cleanliness ---

function StatsCard({ title, value, delta, trend, icon }: any) {
  return (
    <Card className="bg-white border-[#ebebed] shadow-sm rounded-xl group hover:border-[#b6b6b6] transition-all">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-[#f1f1f1] rounded-lg text-[#6d7175] group-hover:bg-[#202223] group-hover:text-white transition-colors">
            {icon}
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md",
            trend === 'up' ? "bg-[#e3f1df] text-[#008060]" : "bg-[#f1f1f1] text-[#6d7175]"
          )}>
            {trend === 'up' && <TrendingUp size={10} />}
            {delta}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-[#6d7175] uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-[#202223] mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isDelivered = status.toLowerCase() === 'delivered';
  const isCancelled = status.toLowerCase() === 'cancelled';

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight",
      isDelivered ? "bg-[#e3f1df] text-[#005e4d]" :
        isCancelled ? "bg-[#fff0f0] text-[#bf0711]" : "bg-[#fff4e5] text-[#8a6116]"
    )}>
      {status}
    </span>
  );
}

function StatusRow({ label, status }: { label: string, status: string }) {
  const isActive = status === 'Active';
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[#6d7175]">{label}</span>
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-[#008060] animate-pulse" : "bg-[#e4b200]")} />
        <span className="text-xs font-bold text-[#202223]">{status}</span>
      </div>
    </div>
  );
}

function QuickLink({ label, href, color }: { label: string, href: string, color: string }) {
  return (
    <Link href={href} className={cn("text-center py-3 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity", color)}>
      {label}
    </Link>
  );
}

function Separator() {
  return <div className="h-[1px] w-full bg-[#f1f1f1]" />;
}
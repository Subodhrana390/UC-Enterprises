"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Activity,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    totalSales: 0,
    activeProducts: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchStats() {
      try {
        const { count: productCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { data: orders } = await supabase
          .from("orders")
          .select("total_amount, customer_name, created_at, id")
          .order("created_at", { ascending: false });

        const { count: customerCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer");

        const revenue = orders?.reduce((acc, order) => acc + parseFloat(order.total_amount), 0) || 0;
        const sales = orders?.length || 0;

        setStats({
          totalRevenue: revenue,
          activeUsers: customerCount || 0,
          totalSales: sales,
          activeProducts: productCount || 0,
        });

        if (orders) {
          setRecentOrders(orders.slice(0, 5));
          
          // Process chart data (last 7 days)
          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
          }).reverse();

          const groupedData = last7Days.map(date => {
            const dayOrders = orders.filter(o => o.created_at.startsWith(date));
            const dayRevenue = dayOrders.reduce((acc, o) => acc + parseFloat(o.total_amount), 0);
            return {
              name: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
              revenue: dayRevenue,
              orders: dayOrders.length
            };
          });
          setChartData(groupedData);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      description: "+20.1% from last month",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      color: "bg-emerald-500/10",
      trend: "up"
    },
    {
      title: "Active Products",
      value: stats.activeProducts.toString(),
      description: "Live in store",
      icon: <Package className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-500/10",
      trend: "up"
    },
    {
      title: "Total Orders",
      value: `+${stats.totalSales}`,
      description: "Successful orders",
      icon: <ShoppingBag className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-500/10",
      trend: "up"
    },
    {
      title: "Total Customers",
      value: stats.activeUsers.toLocaleString(),
      description: "Registered accounts",
      icon: <Users className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-500/10",
      trend: "up"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Business <span className="text-primary">Dashboard</span></h1>
          <p className="text-sm text-muted-foreground font-medium">Strategic overview of UC Enterprises operations (Zirakpur Hub).</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border shadow-sm">
           <Button variant="ghost" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9">Last 24h</Button>
           <Button variant="default" size="sm" className="rounded-xl font-bold text-[10px] uppercase tracking-widest px-4 h-9 shadow-lg shadow-primary/20">Last 7 Days</Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card) => (
          <motion.div variants={item} key={card.title}>
            <Card className="border-none shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-8">
                <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  {card.title}
                </CardTitle>
                <div className={cn("p-3 rounded-2xl transition-all duration-500 group-hover:scale-110", card.color)}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="text-4xl font-black tracking-tighter mb-2">{card.value}</div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 px-2 py-0.5 bg-emerald-50 rounded-full text-emerald-600">
                    <ArrowUpRight className="w-3 h-3 font-bold" />
                    <span className="text-[10px] font-black">2.5%</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-xl font-black tracking-tight">Revenue Analytics</CardTitle>
                  <CardDescription className="text-xs font-medium">Sales performance — Last 7 Days.</CardDescription>
               </div>
               <Button variant="outline" size="sm" className="rounded-xl border-zinc-100 font-bold text-[10px] uppercase tracking-widest h-9">Export Data</Button>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] m-8 mt-4">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#a1a1aa'}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fontWeight: 700, fill: '#a1a1aa'}}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '0.25rem' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-none shadow-sm rounded-[2.5rem]">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black tracking-tight">Recent Activity</CardTitle>
            <CardDescription className="text-xs font-medium">Latest orders and updates.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
             <div className="space-y-6">
                {recentOrders.map((order, i) => (
                  <div key={order.id} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center font-black text-sm group-hover:bg-primary group-hover:text-white transition-all border border-zinc-100">
                      {order.customer_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-black tracking-tight leading-none group-hover:text-primary transition-colors">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {order.customer_name} &bull; {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="font-black text-sm tracking-tighter">₹{ parseFloat(order.total_amount).toLocaleString('en-IN') }</div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    No orders yet
                  </div>
                )}
             </div>
             <Button variant="ghost" className="w-full mt-8 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary hover:bg-primary/5 h-12">
                View All Orders
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
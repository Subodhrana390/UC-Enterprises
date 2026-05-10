"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RefreshCw,
  ArrowUpRight,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity, category_id, categories(name)")
        .order("stock_quantity", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [supabase]);

  const updateStock = async (id: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newQuantity })
        .eq("id", id);

      if (error) throw error;
      setProducts(products.map(p => p.id === id ? { ...p, stock_quantity: newQuantity } : p));
      toast.success("Stock updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update stock");
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
    if (quantity < 10) return { label: "Low Stock", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Monitor and manage product stock levels.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={fetchInventory}>
            <RefreshCw className="w-4 h-4" />
            Sync Stock
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Stock Audit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-zinc-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-zinc-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.stock_quantity === 0).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-zinc-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total SKUs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." className="pl-9 bg-zinc-50 border-none h-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Current Stock</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quick Adjust</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const status = getStockStatus(product.stock_quantity);
                  return (
                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">ID: {product.id.slice(0, 8)}</div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="outline">{product.categories?.name || "Uncategorized"}</Badge>
                      </td>
                      <td className="p-4 align-middle text-center">
                        <span className={`text-lg font-bold ${product.stock_quantity < 10 ? "text-amber-600" : ""}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={status.color}>{status.label}</Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateStock(product.id, product.stock_quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateStock(product.id, product.stock_quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                            <History className="w-4 h-4 opacity-50" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

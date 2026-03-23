"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryForm } from "./InventoryForm";

export function InventoryTable({ products }: { products: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const lowStockThreshold = 100;

  return (
    <>
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Inventory</h1>
      </header>

      <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr className="border-[#f1f1f1]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Product</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Available</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {products?.map((product) => (
                <tr key={product.id} className="group hover:bg-[#fafafa] transition-colors border-[#f1f1f1]">
                  <td className="px-4 py-4 text-xs font-semibold text-[#1a1c1d]">{product.name}</td>
                  <td className="px-4 py-4 text-xs font-mono text-[#616161]">{product.sku}</td>
                  <td className="px-4 py-4">
                    {product.stock_quantity <= 0 ? (
                      <Badge className="bg-[#fff0f0] text-[#d72c0d] hover:bg-[#fff0f0] border-none text-[10px] font-medium rounded-md px-2 py-0">
                        Out of stock
                      </Badge>
                    ) : product.stock_quantity < lowStockThreshold ? (
                      <Badge className="bg-[#fff4da] text-[#8a6116] hover:bg-[#fff4da] border-none text-[10px] font-medium rounded-md px-2 py-0">
                        Low stock
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-[#616161]">Optimal</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-medium text-[#1a1c1d]">{product.stock_quantity}</td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsOpen(true);
                      }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 p-0 h-auto"
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <InventoryForm isOpen={isOpen} onClose={() => setIsOpen(false)} isEdit={!!selectedProduct} product={selectedProduct} />
    </>
  );
}

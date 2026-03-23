"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteBrandForm } from "@/lib/actions/admin";
import { BrandForm } from "./BrandForm";

export function BrandsTable({ initialBrands }: { initialBrands: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  const openCreate = () => {
    setSelectedBrand(null);
    setIsOpen(true);
  };

  const openEdit = (brand: any) => {
    setSelectedBrand(brand);
    setIsOpen(true);
  };

  return (
    <>
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Vendors</h1>
        <Button onClick={openCreate} className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
          Add vendor
        </Button>
      </header>

      <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-[#fafafa]">
              <tr className="border-[#f1f1f1]">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Products</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {initialBrands?.map((brand) => (
                <tr key={brand.id} className="group hover:bg-[#fafafa] transition-colors border-[#f1f1f1]">
                  <td className="px-4 py-4 text-xs font-semibold text-[#1a1c1d]">{brand.name}</td>
                  <td className="px-4 py-4">
                    {brand.is_featured ? (
                      <Badge className="bg-[#fff4da] text-[#8a6116] hover:bg-[#fff4da] border-none text-[10px] font-medium rounded-md px-2 py-0">
                        Top Vendor
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-[#616161]">Standard</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-[#616161]">{(brand.products as any)?.[0]?.count || 0} products</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(brand)} className="text-xs font-medium text-blue-600 hover:text-blue-700 p-0 h-auto">
                        Edit
                      </Button>
                      <form action={deleteBrandForm}>
                        <input type="hidden" name="brandId" value={brand.id} />
                        <Button type="submit" variant="ghost" size="sm" className="text-xs font-medium text-rose-600 hover:text-rose-700 p-0 h-auto">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <BrandForm isOpen={isOpen} onClose={() => setIsOpen(false)} isEdit={!!selectedBrand} brand={selectedBrand} />
    </>
  );
}

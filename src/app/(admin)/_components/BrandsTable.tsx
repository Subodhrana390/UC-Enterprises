"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteBrandForm } from "@/lib/actions/admin";
import { BrandForm } from "./BrandForm";
import { Edit2, Trash2, } from "lucide-react";
import Image from "next/image";

export interface Brand {

  id: string;

  name: string;

  slug: string;

  logo_url: string | null;

  description: string | null;

  is_featured: boolean;

  website_url: string | null;

  created_at: string;

  products: [{ count: number }];

}

export function BrandsTable({ initialBrands }: { initialBrands: Brand[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const openCreate = () => {
    setSelectedBrand(null);
    setIsOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Shopify Style Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#202223]">Brands</h1>
          <p className="text-sm text-[#6d7175]">Manage manufacturers and supply chain partners.</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#008060] hover:bg-[#006e52] text-white shadow-sm font-semibold h-9 px-4"
        >
          Add brand
        </Button>
      </header>

      {/* Main Table Card */}
      <Card className="border-[#ebebed] shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f1f1f1] bg-[#fafafa]">
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#6d7175] w-[60px]">Logo</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#6d7175]">Brand name</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#6d7175]">Tier</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#6d7175]">Inventory</th>
                  <th className="px-5 py-3 text-[12px] font-semibold text-[#6d7175] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f1f1]">
                {initialBrands?.map((brand) => (
                  <tr key={brand.id} className="group hover:bg-[#f6f6f7] transition-colors cursor-default">
                    <td className="px-5 py-3">
                      <div className="h-10 w-10 rounded-md border border-[#e1e3e5] bg-white flex items-center justify-center overflow-hidden relative shadow-sm">
                        {brand.logo_url ? (
                          <Image
                            src={brand.logo_url}
                            alt={brand.name}
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-[#8c9196]">
                            {brand.name.substring(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#202223] group-hover:text-[#005bd3]">
                          {brand.name}
                        </span>
                        <span className="text-xs text-[#6d7175] line-clamp-1 max-w-[250px]">
                          {brand.description || "No description provided"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {brand.is_featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#fff4e5] text-[#8a6116] border border-[#ffebcc]">
                          Top Vendor
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f2f3] text-[#454f5b]">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-[#202223]">
                        {brand.products?.[0]?.count ?? 0}
                        <span className="ml-1 text-[#6d7175] font-normal text-xs uppercase tracking-tight">SKUs</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(brand)}
                          className="h-8 w-8 p-0 text-[#6d7175] hover:bg-[#edeeef] hover:text-[#202223]"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <form
                          action={async (fd) => {
                            await deleteBrandForm(fd);
                          }}
                          className="inline"
                        >
                          <input type="hidden" name="brandId" value={brand.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#6d7175] hover:bg-[#fff0f0] hover:text-[#bf0711]"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <BrandForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isEdit={!!selectedBrand}
        brand={selectedBrand}
      />
    </div>
  );
}
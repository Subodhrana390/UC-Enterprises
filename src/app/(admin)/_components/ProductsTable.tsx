"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteProductForm } from "@/lib/actions/admin";
import { ProductForm } from "./ProductForm";
import Image from "next/image";
import { EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProductsTable({ products, brands, categories }: { products: any[]; brands: any[]; categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  const onCreate = () => {
    setSelectedProduct(null);
    setIsOpen(true);
  };

  const onEdit = (product: any) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  return (
    <>
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-[#1a1c1d]">Products</h1>
        <Button onClick={onCreate} className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
          Add product
        </Button>
      </header>

      <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl overflow-auto">
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#f1f1f1]">
                <th className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Inventory</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[#616161] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {products?.map((product) => (
                <tr key={product.id} className="group hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-4">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden border border-[#ebebeb] bg-[#f5f5f5]">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-[#616161] text-[10px]">N/A</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <p className="font-semibold text-[#1a1c1d]">{product.name}</p>
                    <p className="text-[10px] text-[#616161]">SKU: {product.sku}</p>
                  </td>

                  <td className="px-4 py-4 text-xs">{product.stock_quantity}</td>
                  <td className="px-4 py-4 text-xs text-[#616161]">{(product.categories as any)?.name}</td>
                  <td className="px-4 py-4 text-xs text-[#616161]">{(product.brands as any)?.name}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEyeOpen(true);
                        }}
                      >
                        <EyeIcon size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="text-xs font-medium text-blue-600 hover:text-blue-700 p-0 h-auto">
                        Edit
                      </Button>
                      <form action={async (fd) => deleteProductForm(fd)}>
                        <input type="hidden" name="productId" value={product.id} />
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

      <ProductForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isEdit={!!selectedProduct}
        product={selectedProduct}
        brands={brands}
        categories={categories}
      />

      <ViewProductDetails
        product={selectedProduct}
        isOpen={isEyeOpen}
        onClose={() => setIsEyeOpen(false)}
      />
    </>
  );
}


const ViewProductDetails = ({
  product,
  isOpen,
  onClose,
}: {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl">

        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg font-semibold">
            Product Details
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Image Section */}
          <div className="space-y-3">
            <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden border bg-gray-50">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {product.images?.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {product.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden border"
                  >
                    <Image
                      src={img}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-4 text-sm">

            <InfoRow label="Name" value={product.name} strong />

            <InfoRow label="SKU" value={product.sku} />
            <InfoRow label="Base Price" value={`₹ ${product.base_price}`} />

            <InfoRow
              label="Inventory"
              value={product.stock_quantity}
            />

            <InfoRow
              label="Category"
              value={product.categories?.name}
            />

            <InfoRow
              label="Brand"
              value={product.brands?.name}
            />

            {product.price && (
              <InfoRow
                label="Price"
                value={`₹${product.price}`}
                strong
              />
            )}

            {product.description && (
              <div>
                <p className="text-gray-500 text-xs mb-1">
                  Description
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


/* Reusable row component */
const InfoRow = ({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: any;
  strong?: boolean;
}) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p
      className={`${strong ? "font-semibold text-base" : "text-sm"
        } text-gray-900`}
    >
      {value || "-"}
    </p>
  </div>
);

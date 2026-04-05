"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteProductForm } from "@/lib/actions/admin";
import { ProductForm } from "./ProductForm";
import Image from "next/image";
import { EyeIcon, Pencil, Trash2, PackageSearch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProductsTable({ products, brands, categories }: { products: any[]; brands: any[]; categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEyeOpen, setIsEyeOpen] = useState(false);

  // State for Delete Confirmation
  const [productToDelete, setProductToDelete] = useState<any>(null);

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
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Product</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Manage Products</p>
        </div>
        <Button onClick={onCreate} className="bg-slate-900 text-white h-9 text-[11px] font-black uppercase tracking-widest px-6 hover:bg-slate-800 rounded-xl shadow-sm">
          Add New Product
        </Button>
      </header>

      <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Details</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-300"><PackageSearch size={20} /></div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-900 leading-none">{product.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1.5 uppercase">{product.sku || 'No SKU'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-sm font-bold",
                            product.stock_quantity < 10 ? "text-rose-600" : "text-slate-700"
                          )}>
                            {product.stock_quantity}
                          </span>
                          {product.stock_quantity < 10 && (
                            <span className="text-[9px] font-black uppercase text-rose-400">Low Stock</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                          {product.categories?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedProduct(product); setIsEyeOpen(true); }} className="h-8 w-8 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50">
                            <EyeIcon size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Pencil size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setProductToDelete(product)} className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <PackageSearch size={48} strokeWidth={1} />
                        <p className="mt-4 font-bold uppercase tracking-widest text-xs">No Products Found</p>
                        <Button variant="link" onClick={onCreate} className="text-cyan-600 text-[11px] font-black uppercase mt-1">Initialize Catalog</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Terminate Product?</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete <span className="font-bold text-slate-900">{productToDelete?.name}</span>?
              This will remove all associated inventory records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setProductToDelete(null)} className="rounded-xl text-xs font-bold uppercase">Cancel</Button>
            <form action={deleteProductForm} className="flex-1 sm:flex-none">
              <input type="hidden" name="productId" value={productToDelete?.id} />
              <Button type="submit" variant="destructive" onClick={() => setProductToDelete(null)} className="w-full rounded-xl text-xs font-bold uppercase">
                Confirm Delete
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <ProductForm isOpen={isOpen} onClose={() => setIsOpen(false)} isEdit={!!selectedProduct} product={selectedProduct} brands={brands} categories={categories} />
      <ViewProductDetails product={selectedProduct} isOpen={isEyeOpen} onClose={() => setIsEyeOpen(false)} />
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

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopForm } from "./PopForm";
import { saveProductForm } from "@/lib/actions/admin";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  product?: any;
  brands: any[];
  categories: any[];
}

export function ProductForm({ isOpen, onClose, isEdit, product, brands, categories }: ProductFormProps) {
  const formId = "product-form";
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState("0");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [minOrderQuantity, setMinOrderQuantity] = useState("1");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLatest, setIsLatest] = useState(true);

  useEffect(() => {
    setName(product?.name ?? "");
    setSku(product?.sku ?? "");
    setDescription(product?.description ?? "");
    setBrandId(product?.brand_id ?? brands?.[0]?.id ?? "");
    setCategoryId(product?.category_id ?? categories?.[0]?.id ?? "");
    setBasePrice(String(product?.base_price ?? 0));
    setCompareAtPrice(product?.compare_at_price ? String(product.compare_at_price) : "");
    setMinOrderQuantity(String(product?.min_order_quantity ?? 1));
    setStockQuantity(String(product?.stock_quantity ?? 0));
    setIsFeatured(!!product?.is_featured);
    setIsLatest(product?.is_latest ?? true);
  }, [product, isOpen, brands, categories]);

  return (
    <PopForm
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={isEdit ? "Edit product" : "Create product"}
      description={isEdit ? "Update product details." : "Add a new product."}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm">
            Cancel
          </Button>
          <Button form={formId} type="submit" className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
            {isEdit ? "Save product" : "Create product"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        encType="multipart/form-data"
        action={async (formData) => {
          await saveProductForm(formData);
          onClose();
        }}
        className="space-y-4"
      >
        {isEdit && product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm" />
          <input name="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" required className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm" />
          <select name="brandId" value={brandId} onChange={(e) => setBrandId(e.target.value)} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm">
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="basePrice" type="number" min="0" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="Base price" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm" />
          <input name="compareAtPrice" type="number" min="0" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="Compare at price" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm" />
          <input name="minOrderQuantity" type="number" min="1" value={minOrderQuantity} onChange={(e) => setMinOrderQuantity(e.target.value)} placeholder="Minimum order qty" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm" />
          <input name="stockQuantity" type="number" min="0" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} placeholder="Stock qty" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm" />
        </div>
        {isEdit && Array.isArray(product?.images)
          ? product.images.map((imageUrl: string) => (
              <input key={imageUrl} type="hidden" name="existingImages" value={imageUrl} />
            ))
          : null}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Product images</label>
          <input
            type="file"
            name="productImages"
            accept="image/*"
            multiple
            className="w-full text-xs file:mr-3 file:rounded-md file:border file:border-[#d2d2d2] file:bg-white file:px-3 file:py-1.5 file:text-xs"
          />
        </div>
        <div className="flex items-center gap-6 text-xs">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isLatest} onChange={(e) => setIsLatest(e.target.checked)} />
            Latest
          </label>
        </div>
        <input type="hidden" name="isFeatured" value={String(isFeatured)} />
        <input type="hidden" name="isLatest" value={String(isLatest)} />
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm resize-none"
        />
      </form>
    </PopForm>
  );
}

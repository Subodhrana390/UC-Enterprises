"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopForm } from "./PopForm";
import { saveProductForm } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  product?: any;
  brands: any[];
  categories: any[];
}

export function ProductForm({ isOpen, onClose, isEdit, product, brands, categories }: ProductFormProps) {
  const router = useRouter();
  const formId = "product-form";
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
    setExistingImages(Array.isArray(product?.images) ? product.images.filter((img: unknown): img is string => typeof img === "string" && img.length > 0) : []);
  }, [product, isOpen, brands, categories]);

  const moveImage = (fromIndex: number, toIndex: number) => {
    setExistingImages((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleDropImage = (toIndex: number) => {
    if (dragIndex === null || dragIndex === toIndex) return;
    moveImage(dragIndex, toIndex);
    setDragIndex(null);
  };

  return (
    <PopForm
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={isEdit ? "Edit product" : "Create product"}
      description={isEdit ? "Update product details." : "Add a new product."}
      footer={
        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            className="bg-white border-[#d2d2d2] h-10 sm:h-9 text-xs font-medium px-4 shadow-sm w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            form={formId} 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-[#1a1c1d] text-white h-10 sm:h-9 text-xs font-medium px-4 hover:bg-[#303030] disabled:opacity-70 w-full sm:w-auto"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save product" : "Create product"}
          </Button>
        </div>
      }
    >
      {/* Scrollable container for mobile usability */}
      <div className="max-h-[65vh] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-300">
        <form
          id={formId}
          action={async (formData) => {
            setIsSubmitting(true);
            const result = await saveProductForm(formData);
            if (result?.error) {
              alert(result.error);
              setIsSubmitting(false);
              return;
            }
            router.refresh();
            setIsSubmitting(false);
            onClose();
          }}
          className="space-y-5 py-1"
        >
          {isEdit && product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
          <input type="hidden" name="manageImages" value="true" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-gray-500 ml-1">Product Name</label>
              <input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-gray-500 ml-1">SKU</label>
              <input name="sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU" required className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black" />
            </div>
            <select name="brandId" value={brandId} onChange={(e) => setBrandId(e.target.value)} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black">
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="basePrice" type="number" min="0" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="Base price" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black" />
            <input name="compareAtPrice" type="number" min="0" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} placeholder="Compare at price" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black" />
            <input name="minOrderQuantity" type="number" min="1" value={minOrderQuantity} onChange={(e) => setMinOrderQuantity(e.target.value)} placeholder="Minimum order qty" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black" />
            <input name="stockQuantity" type="number" min="0" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} placeholder="Stock qty" className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none focus:ring-1 focus:ring-black" />
          </div>

          {isEdit ? existingImages.map((imageUrl) => (
            <input key={imageUrl} type="hidden" name="existingImages" value={imageUrl} />
          )) : null}

          {isEdit && existingImages.length > 0 ? (
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#1a1c1d]">Existing images (drag to reorder)</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                {existingImages.map((imageUrl, index) => (
                  <div
                    key={imageUrl}
                    className={`space-y-1 rounded-md transition-all ${dragIndex === index ? "opacity-50 scale-95" : ""}`}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropImage(index)}
                    onDragEnd={() => setDragIndex(null)}
                  >
                    <div className="relative h-20 w-full rounded-md overflow-hidden border border-[#ebebeb] bg-[#f5f5f5]">
                      <Image src={imageUrl} alt="Product image" fill className="object-cover" sizes="(max-width: 640px) 50vw, 120px" />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <button
                        type="button"
                        onClick={() => setExistingImages((prev) => prev.filter((img) => img !== imageUrl))}
                        className="text-[10px] text-rose-600 hover:underline font-medium"
                      >
                        Remove
                      </button>
                      <span className="text-[10px] text-gray-400">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1a1c1d]">{isEdit ? "Add more images" : "Product images"}</label>
            <input
              type="file"
              name="productImages"
              accept="image/*"
              multiple
              className="w-full text-xs file:mr-3 file:rounded-md file:border file:border-[#d2d2d2] file:bg-white file:px-3 file:py-1.5 file:text-xs cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="accent-black" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="accent-black" checked={isLatest} onChange={(e) => setIsLatest(e.target.checked)} />
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
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm resize-none outline-none focus:ring-1 focus:ring-black"
          />
        </form>
      </div>
    </PopForm>
  );
}
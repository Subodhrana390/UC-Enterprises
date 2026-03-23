"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PopForm } from "./PopForm";
import { saveInventoryForm } from "@/lib/actions/admin";

interface InventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  product?: any;
}

export function InventoryForm({ isOpen, onClose, isEdit, product }: InventoryFormProps) {
  const formId = "inventory-form";
  const [stockQuantity, setStockQuantity] = useState("0");
  const [delta, setDelta] = useState("0");

  useEffect(() => {
    setStockQuantity(String(product?.stock_quantity ?? 0));
    setDelta("0");
  }, [product, isOpen]);

  return (
    <PopForm
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={isEdit ? "Update inventory" : "Inventory"}
      description="Adjust the stock quantity for this product."
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm">
            Cancel
          </Button>
          <Button form={formId} type="submit" className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
            Save quantity
          </Button>
        </>
      }
    >
      <form
        id={formId}
        action={async (formData) => {
          await saveInventoryForm(formData);
          onClose();
        }}
        className="space-y-4"
      >
        <input type="hidden" name="productId" value={product?.id ?? ""} />
        <input type="hidden" name="currentStock" value={String(product?.stock_quantity ?? 0)} />
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Stock Quantity</label>
          <input
            type="number"
            min={0}
            name="stockQuantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Adjust by delta (optional)</label>
          <input
            type="number"
            name="delta"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
          />
          <p className="text-[11px] text-[#616161]">Use positive or negative value; direct quantity above takes priority.</p>
        </div>
      </form>
    </PopForm>
  );
}

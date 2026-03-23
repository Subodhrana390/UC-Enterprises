"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { saveBrandForm } from "@/lib/actions/admin";
import { PopForm } from "./PopForm";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  brand?: any;
}

export function BrandForm({ isOpen, onClose, isEdit, brand }: BrandFormProps) {
  const formId = "brand-form";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    setName(brand?.name ?? "");
    setDescription(brand?.description ?? "");
    setIsFeatured(!!brand?.is_featured);
  }, [brand, isOpen]);

  return (
    <PopForm
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={isEdit ? "Edit vendor" : "Create vendor"}
      description={isEdit ? "Update vendor details." : "Add a vendor for product grouping."}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm">
            Cancel
          </Button>
          <Button form={formId} type="submit" className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
            {isEdit ? "Save vendor" : "Create vendor"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        action={async (formData) => {
          await saveBrandForm(formData);
          onClose();
        }}
        className="space-y-4"
      >
        {isEdit && brand?.id ? <input type="hidden" name="id" value={brand.id} /> : null}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Name</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none resize-none"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-[#1a1c1d]">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded-sm"
          />
          <span>Top vendor</span>
        </label>
        <input type="hidden" name="isFeatured" value={String(isFeatured)} />
      </form>
    </PopForm>
  );
}

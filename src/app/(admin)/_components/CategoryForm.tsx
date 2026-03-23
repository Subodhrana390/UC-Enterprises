"use client";

import { useState, useEffect } from "react";
import { saveCategoryForm } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { PopForm } from "./PopForm";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  category?: any; // The category object if editing
}

export function CategoryForm({ isOpen, onClose, isEdit, category }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const formId = "category-form";

  // Sync state when category prop changes
  useEffect(() => {
    if (category) {
      setName(category.name ?? "");
      setDescription(category.description ?? "");
      setIcon(category.icon ?? "");
    } else {
      setName("");
      setDescription("");
      setIcon("");
    }
  }, [category, isOpen]);

  return (
    <PopForm
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={isEdit ? "Edit collection" : "Create collection"}
      description={isEdit ? "Update collection details." : "Create a new collection."}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm"
          >
            Cancel
          </Button>
          <Button form={formId} type="submit" className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
            {isEdit ? "Save collection" : "Create collection"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        encType="multipart/form-data"
        action={async (formData) => {
          await saveCategoryForm(formData);
          onClose();
        }}
        className="space-y-4"
      >
        {isEdit && category?.id ? <input type="hidden" name="id" value={category.id} /> : null}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Title</label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Summer Components"
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none transition-all"
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
            placeholder="Collection description"
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Icon (optional)</label>
          <input
            name="icon"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="e.g. category-chip"
            className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-1 focus:ring-black outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Icon image file</label>
          <input
            type="file"
            name="iconFile"
            accept="image/*"
            className="w-full text-xs file:mr-3 file:rounded-md file:border file:border-[#d2d2d2] file:bg-white file:px-3 file:py-1.5 file:text-xs"
          />
        </div>
      </form>
    </PopForm>
  );
}
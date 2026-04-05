"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { saveBrandForm } from "@/lib/actions/admin";
import { PopForm } from "./PopForm";
import { Upload, X } from "lucide-react";

interface BrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  brand?: any;
}

export function BrandForm({ isOpen, onClose, isEdit, brand }: BrandFormProps) {
  const formId = "brand-form";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [logoUrl, setLogoUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(brand?.name ?? "");
      setSlug(brand?.slug ?? "");
      setDescription(brand?.description ?? "");
      setWebsiteUrl(brand?.website_url ?? "");
      setIsFeatured(!!brand?.is_featured);
      setLogoUrl(brand?.logo_url ?? "");
      setPreviewUrl(brand?.logo_url ?? null);
    }
  }, [brand, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    setLogoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const autoSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setName(name);
    if (!isEdit) {
      setSlug(autoSlug(name));
    }
  };

  return (
    <PopForm
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={isEdit ? "Edit vendor" : "Create vendor"}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button form={formId} type="submit" disabled={isUploading}>
            {isEdit ? "Save changes" : "Create vendor"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        action={async (formData) => {
          setIsUploading(true);
          await saveBrandForm(formData);
          setIsUploading(false);
          onClose();
        }}
        className="space-y-4"
      >
        {isEdit && brand?.id && <input type="hidden" name="id" value={brand.id} />}
        <input type="hidden" name="is_featured" value={String(isFeatured)} />

        {/* Logo Upload Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Vendor Logo</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer border-2 border-dashed border-[#ebebeb] rounded-xl p-4 hover:bg-[#fafafa] hover:border-[#d2d2d2] transition-all flex flex-col items-center justify-center min-h-[120px]"
          >
            {previewUrl ? (
              <div className="relative h-20 w-full flex justify-center">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={120}
                  height={80}
                  className="h-full w-auto object-contain rounded"
                  unoptimized
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute -top-2 -right-2 bg-white border border-[#ebebeb] p-1 rounded-full shadow-sm text-rose-500 hover:bg-rose-50"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-[#fafafa] p-2 rounded-full inline-block mb-2 group-hover:scale-110 transition-transform">
                  <Upload size={18} className="text-[#616161]" />
                </div>
                <p className="text-[11px] font-medium text-[#1a1c1d]">Click to upload logo</p>
                <p className="text-[10px] text-[#9e9e9e]">PNG, JPG up to 2MB</p>
              </div>
            )}
            <input
              type="file"
              name="logo_file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        {/* Name and Slug (Compact Grid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1a1c1d]">Name</label>
            <input name="name" value={name} onChange={(e) => handleNameChange(e.target.value)} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#1a1c1d]">URL Slug</label>
            <input name="slug" value={slug} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm bg-[#fafafa] font-mono text-[12px] outline-none" required disabled />
          </div>
        </div>``

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Website URL</label>
          <input name="website_url" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#1a1c1d]">Description</label>
          <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm outline-none resize-none" />
        </div>

        <label className="flex items-center gap-2 p-3 border border-[#f1f1f1] rounded-md bg-[#fafafa]/50 cursor-pointer">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded-sm accent-black h-4 w-4" />
          <span className="text-xs font-semibold text-[#1a1c1d]">Top Vendor</span>
        </label>
      </form>
    </PopForm>
  );
}
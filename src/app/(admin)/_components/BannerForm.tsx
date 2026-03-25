"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createBanner, updateBanner } from "@/lib/actions/admin/banners";
import { Plus, X, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BannerFormProps {
  banner?: any;
}

export function BannerForm({ banner }: BannerFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant={banner ? "secondary" : "default"}
        size={banner ? "sm" : "default"}
        className={banner ? "h-8 w-8 p-0" : "bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]"}
      >
        {banner ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
        {!banner && "Add Banner"}
      </Button>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = banner 
        ? await updateBanner(banner.id, formData)
        : await createBanner(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(banner ? "Banner updated successfully" : "Banner created successfully");
        setIsOpen(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-[#f1f1f1]">
          <h2 className="text-lg font-semibold">{banner ? "Edit Banner" : "Create Banner"}</h2>
          <button 
            onClick={() => setIsOpen(false)} 
            disabled={isPending}
            className="text-[#616161] hover:text-black disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Title</label>
            <input
              name="title"
              required
              defaultValue={banner?.title}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
              placeholder="Summer Sale"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Subtitle</label>
            <input
              name="subtitle"
              defaultValue={banner?.subtitle}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
              placeholder="Up to 50% off"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Image URL</label>
            <input
              name="image_url"
              required
              defaultValue={banner?.image_url}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
              placeholder="https://example.com/banner.jpg"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Link URL (optional)</label>
            <input
              name="link_url"
              defaultValue={banner?.link_url}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
              placeholder="/products"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Position</label>
            <select
              name="position"
              defaultValue={banner?.position || "homepage"}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
              disabled={isPending}
            >
              <option value="homepage">Homepage</option>
              <option value="category">Category</option>
              <option value="product">Product Page</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#616161] mb-1">Start Date</label>
              <input
                type="datetime-local"
                name="start_date"
                defaultValue={banner?.start_date ? new Date(banner.start_date).toISOString().slice(0, 16) : ""}
                className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#616161] mb-1">End Date</label>
              <input
                type="datetime-local"
                name="end_date"
                defaultValue={banner?.end_date ? new Date(banner.end_date).toISOString().slice(0, 16) : ""}
                className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              defaultValue={banner?.sort_order || 0}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50"
              disabled={isPending}
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="is_active" 
              id="is_active" 
              defaultChecked={banner ? banner.is_active : true} 
              disabled={isPending}
            />
            <label htmlFor="is_active" className="text-xs">Active</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#1a1c1d] text-white"
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {banner ? "Update Banner" : "Create Banner"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
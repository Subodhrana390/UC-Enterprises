"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createBanner } from "@/lib/actions/admin/banners";
import { Plus, X } from "lucide-react";

export function BannerForm() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Banner
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-[#f1f1f1]">
          <h2 className="text-lg font-semibold">Create Banner</h2>
          <button onClick={() => setIsOpen(false)} className="text-[#616161] hover:text-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form action={async (formData) => {
          await createBanner(formData);
          setIsOpen(false);
        }} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Title</label>
            <input
              name="title"
              required
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
              placeholder="Summer Sale"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Subtitle</label>
            <input
              name="subtitle"
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
              placeholder="Up to 50% off"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Image URL</label>
            <input
              name="image_url"
              required
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Link URL (optional)</label>
            <input
              name="link_url"
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
              placeholder="/products"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Position</label>
            <select
              name="position"
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
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
                className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#616161] mb-1">End Date</label>
              <input
                type="datetime-local"
                name="end_date"
                className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#616161] mb-1">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              defaultValue={0}
              className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-xs outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_active" id="is_active" defaultChecked />
            <label htmlFor="is_active" className="text-xs">Active</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1a1c1d] text-white">
              Create Banner
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
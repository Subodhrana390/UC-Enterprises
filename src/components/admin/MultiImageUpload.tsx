"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function MultiImageUpload({ images, onChange }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        newImages.push(publicUrl);
      }
      onChange(newImages);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addUrl = () => {
    if (!urlInput) return;
    if (!urlInput.match(/^https?:\/\/.+/)) {
      toast.error("Please enter a valid URL");
      return;
    }
    onChange([...images, urlInput]);
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg border overflow-hidden bg-zinc-50 group">
            <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-contain" />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest">
                Primary
              </div>
            )}
          </div>
        ))}
        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-zinc-200 hover:border-primary hover:bg-zinc-50 transition-all cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <>
                <Plus className="w-6 h-6" />
                <span className="text-xs font-medium">Upload</span>
              </>
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add image by URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addUrl()}
        />
        <Button variant="outline" onClick={addUrl} size="icon" type="button">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

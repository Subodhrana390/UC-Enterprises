"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitQuotationRequest } from "@/lib/actions/quotations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

interface QuoteItem {
  productName: string;
  sku: string;
  quantity: number;
  specifications?: string;
}

export function QuotationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<QuoteItem[]>([
    { productName: "", sku: "", quantity: 1, specifications: "" }
  ]);

  const addItem = () => {
    setItems([...items, { productName: "", sku: "", quantity: 1, specifications: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    formData.set("items", JSON.stringify(items));

    setIsSubmitting(true);
    const result = await submitQuotationRequest(formData);
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(result.message || "Quotation request submitted!");
      router.push("/account");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-black mb-6">Request Details</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Subject / Project Name</Label>
            <Input 
              name="subject"
              required
              placeholder="e.g., Q1 2024 Component Procurement"
              className="h-11 border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Additional Requirements (Optional)</Label>
            <Textarea 
              name="message"
              rows={4}
              placeholder="Delivery timeline, payment terms, special requirements..."
              className="border-gray-300 rounded-lg text-sm resize-none"
            />
          </div>
        </div>
      </section>

      {/* Items List */}
      <section className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Items</h3>
          <Button
            type="button"
            onClick={addItem}
            variant="outline"
            size="sm"
            className="h-9 text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="relative bg-gray-50 rounded-xl border border-gray-200 p-6">
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Product Name</Label>
                  <Input
                    value={item.productName}
                    onChange={(e) => updateItem(index, "productName", e.target.value)}
                    required
                    placeholder="e.g., STM32F407VGT6"
                    className="h-10 border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">SKU / Part Number</Label>
                  <Input
                    value={item.sku}
                    onChange={(e) => updateItem(index, "sku", e.target.value)}
                    placeholder="Optional"
                    className="h-10 border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    required
                    min="1"
                    className="h-10 border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Specifications (Optional)</Label>
                  <Input
                    value={item.specifications || ""}
                    onChange={(e) => updateItem(index, "specifications", e.target.value)}
                    placeholder="e.g., LQFP-100 package"
                    className="h-10 border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-gray-500 max-w-md">
          Our team will review your request and send a detailed quotation to your registered email within 24 hours.
        </p>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-10 bg-black hover:bg-gray-800 text-white font-semibold text-sm rounded-lg transition-all"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </form>
  );
}

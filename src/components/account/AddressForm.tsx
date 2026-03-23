"use client";

import { useActionState, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress, updateAddress } from "@/lib/actions/account"; // Ensure updateAddress exists
import { cn } from "@/lib/utils";

const LABEL_OPTIONS = ["Home", "Work", "Office"];

interface AddressFormProps {
  initialData?: any; // Pass the address object here for Editing
  onSuccess?: () => void;
  mode?: "add" | "edit";
}

export function AddressForm({ initialData, onSuccess, mode = "add" }: AddressFormProps) {
  const [open, setOpen] = useState(mode === "edit"); // Open immediately if editing
  const [selectedLabel, setSelectedLabel] = useState(initialData?.label || "Home");

  const [state, formAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      formData.set("label", selectedLabel);
      
      const result = mode === "edit" 
        ? await updateAddress(initialData.id, formData) 
        : await addAddress(formData);

      if (result.success) {
        setOpen(false);
        onSuccess?.();
        return { success: true };
      }
      return { error: result.error };
    },
    null
  );

  // Trigger button for "Add" mode
  if (!open && mode === "add") {
    return (
      <Button onClick={() => setOpen(true)} className="h-11 px-6 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2">
        <span className="material-symbols-outlined text-lg">add</span>
        Add New Address
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {mode === "edit" ? "Edit Address" : "Add New Address"}
          </h3>
          <button type="button" onClick={() => (mode === "edit" ? onSuccess?.() : setOpen(false))} className="text-gray-400 hover:text-black">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          {/* Label Selection */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Address Label</Label>
            <div className="flex gap-2">
              {LABEL_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedLabel(opt)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                    selectedLabel === opt ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-200"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Full Name *</Label>
            <Input name="full_name" defaultValue={initialData?.full_name} required placeholder="Receiver's name" className="h-11" />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Street / House No. *</Label>
            <Input name="street" defaultValue={initialData?.address_line1} required placeholder="House No, Street" className="h-11" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">City *</Label>
              <Input name="city" defaultValue={initialData?.city} required className="h-11" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Pincode *</Label>
              <Input name="zip" defaultValue={initialData?.pincode} required pattern="[0-9]{6}" className="h-11" />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Phone Number *</Label>
            <Input name="phone" defaultValue={initialData?.phone_number} required pattern="[0-9]{10}" className="h-11" />
          </div>

          <input type="hidden" name="country" value="India" />

          <div className="flex gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => (mode === "edit" ? onSuccess?.() : setOpen(false))} className="flex-1 h-11">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-11 bg-black text-white">
              {mode === "edit" ? "Update Details" : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addAddress } from "@/lib/actions/account";

export function AddAddressForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(
    async (_: unknown, formData: FormData) => {
      const result = await addAddress(formData);
      if (result.success) {
        setOpen(false);
        onSuccess?.();
        return { success: true };
      }
      return { error: result.error };
    },
    null as { error?: string; success?: boolean } | null
  );

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="h-12 px-8 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
        Register New Endpoint
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-black uppercase tracking-tight mb-6">Add Address</h3>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input name="label" placeholder="e.g. Home" className="h-12" />
          </div>
          <div className="space-y-2">
            <Label>Street</Label>
            <Input name="street" required placeholder="123 Main St" className="h-12" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input name="city" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input name="state" className="h-12" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ZIP</Label>
              <Input name="zip" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input name="country" required className="h-12" />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isDefault" value="true" />
            <span className="text-sm">Set as default</span>
          </label>
          <input type="hidden" name="type" value="shipping" />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">Add Address</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

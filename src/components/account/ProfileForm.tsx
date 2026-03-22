"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/lib/actions/account";

export function ProfileForm({
  defaultFirstName,
  defaultLastName,
  defaultCompanyName,
}: {
  defaultFirstName?: string;
  defaultLastName?: string;
  defaultCompanyName?: string;
}) {
  const [state, formAction] = useActionState(
    async (_: { error?: string; success?: boolean } | null, formData: FormData) => {
      const result = await updateProfile(formData);
      return result.error ? { error: result.error } : { success: true };
    },
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Given Name</Label>
          <Input name="firstName" defaultValue={defaultFirstName} className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Family Name</Label>
          <Input name="lastName" defaultValue={defaultLastName} className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Enterprise/Company Identity</Label>
        <Input name="companyName" defaultValue={defaultCompanyName} className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">Profile updated successfully.</p>}
      <Button type="submit" className="h-14 px-10 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
        Update Security Manifest
      </Button>
    </form>
  );
}

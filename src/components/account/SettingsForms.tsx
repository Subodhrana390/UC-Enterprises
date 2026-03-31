"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, requestDeactivation } from "@/lib/actions/account";
import { signOut } from "@/lib/actions/admin/settings";

export function PasswordForm() {
  const [state, formAction] = useActionState(
    async (_: { error?: string } | null, fd: FormData) => {
      const result = await updatePassword(fd);
      await signOut();
      return result?.error ? { error: result.error } : { success: true };
    },
    null
  );

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Current Password</Label>
        <Input name="currentPassword" type="password" placeholder="••••••••" className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">New Password</Label>
        <Input name="newPassword" type="password" placeholder="Minimum 8 characters" className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Confirm New Password</Label>
        <Input name="confirmPassword" type="password" placeholder="Re-enter new password" className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-600">Password updated.</p>}
      <Button type="submit" className="h-14 px-10 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
        change Password
      </Button>
    </form>
  );
}

export function DeactivationButton() {
  const [state, formAction] = useActionState(
    async (_: { error?: string; message?: string } | null) => {
      const result = await requestDeactivation();
      return result?.error ? { error: result.error } : { success: true, message: result.message };
    },
    null
  );

  return (
    <form action={formAction}>
      {state?.success && <p className="text-sm text-emerald-600 mb-2">{state.message || "Request submitted."}</p>}
      <Button type="submit" variant="outline" className="h-10 rounded-lg border-rose-300 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50">
        Request Deactivation
      </Button>
    </form>
  );
}

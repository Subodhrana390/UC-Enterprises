"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/actions/support";

export function SupportNewsletterForm() {
  const [state, formAction] = useActionState(
    async (_: { error?: string; success?: boolean } | null, formData: FormData) => {
      const email = formData.get("email") as string;
      const result = await subscribeNewsletter(email);
      return result.error ? { error: result.error } : { success: true };
    },
    null
  );

  return (
    <form action={formAction} className="flex gap-2">
      <Input
        name="email"
        required
        className="flex-1 bg-white border-none rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary transition-all text-sm"
        placeholder="Professional Email"
        type="email"
      />
      <Button type="submit" className="bg-primary text-white px-8 h-12 rounded-lg font-bold text-sm hover:opacity-90 transition-all">
        Subscribe
      </Button>
      {state?.success && <p className="text-sm text-emerald-600">Thank you for subscribing!</p>}
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { setDefaultAddressForm, deleteAddressForm } from "@/lib/actions/account";

export function AddressActions({ addressId, isDefault }: { addressId: string; isDefault: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <>
      {!isDefault && (
        <form action={(fd) => startTransition(() => { setDefaultAddressForm(fd); })} className="flex-1">
          <input type="hidden" name="addressId" value={addressId} />
          <Button type="submit" variant="ghost" disabled={pending} className="w-full rounded-lg text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-10">
            Set Default
          </Button>
        </form>
      )}
      <form action={(fd) => startTransition(() => { deleteAddressForm(fd); })} className="flex-1">
        <input type="hidden" name="addressId" value={addressId} />
        <Button type="submit" variant="ghost" disabled={pending} className="w-full rounded-lg text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 h-10">
          Remove
        </Button>
      </form>
    </>
  );
}

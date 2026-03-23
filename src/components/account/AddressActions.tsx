"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { setDefaultAddressForm, deleteAddressForm } from "@/lib/actions/account";
import { AddressForm } from "./AddressForm";

interface Address {
  id: string;
  label: string;
  full_name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  phone_number: string;
  type: 'shipping' | 'billing';
  is_default: boolean;
}

export function AddressActions({ address, isDefault }: { address: Address; isDefault: boolean }) {
  const [pending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex gap-2 w-full">
        {/* EDIT BUTTON */}
        <Button
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="flex-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-100 h-10"
        >
          Edit
        </Button>

        {/* SET DEFAULT BUTTON */}
        {!isDefault && (
          <form
            action={(fd) => {
              startTransition(async () => {
                await setDefaultAddressForm(fd);
              });
            }}
            className="flex-1"
          >
            <input type="hidden" name="addressId" value={address.id} />
            <Button
              type="submit"
              variant="ghost"
              disabled={pending}
              className="w-full rounded-lg text-[10px] font-bold uppercase tracking-wider text-black hover:bg-gray-100 h-10"
            >
              {pending ? "Setting..." : "Set Default"}
            </Button>
          </form>
        )}

        {/* REMOVE BUTTON */}
        <form
          action={(fd) => {
            startTransition(async () => {
              await deleteAddressForm(fd);
            });
          }}
          className="flex-1"
          onSubmit={(e) => {
            if (!confirm("Remove this address?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="addressId" value={address.id} />
          <Button
            type="submit"
            variant="ghost"
            disabled={pending}
            className="w-full rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 h-10 transition-opacity"
          >
            {pending ? <span className="animate-pulse">...</span> : "Remove"}
          </Button>
        </form>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <AddressForm
          mode="edit"
          initialData={address}
          onSuccess={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type AddressRow = {
  id: string;
  label: string | null;
  street: string | null;
  address_line1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  pincode: string | null;
  country: string | null;
  is_default: boolean | null;
};

function iconForLabel(label: string | null) {
  const l = (label || "").toLowerCase();
  if (l.includes("hq") || l.includes("office") || l.includes("corporate")) return "business";
  if (l.includes("warehouse") || l.includes("dock")) return "warehouse";
  if (l.includes("lab") || l.includes("r&d")) return "science";
  return "home_work";
}

/** stitch_screens/list2/select_address.html — radio cards + Deliver CTA */
export function CheckoutAddressStep({
  addresses,
  initialAddressId,
  cartItemCount,
}: {
  addresses: AddressRow[];
  initialAddressId: string | undefined;
  cartItemCount: number;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialAddressId || addresses[0]?.id
  );
  const [gst, setGst] = useState(false);

  const proceed = () => {
    if (!selectedId) return;
    const q = new URLSearchParams();
    q.set("addressId", selectedId);
    q.set("gst", gst ? "1" : "0");
    router.push(`/checkout/payment?${q.toString()}`);
  };

  if (addresses.length === 0) {
    return (
      <div className="rounded-3xl border border-amber-200/60 bg-amber-50/50 p-8 text-center">
        <p className="font-black text-amber-900 mb-2">No shipping address on file</p>
        <p className="text-sm text-amber-800/80 mb-6">Add an address to continue checkout.</p>
        <Link
          href="/account/addresses"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-white px-8 py-3 font-black uppercase tracking-widest text-sm hover:opacity-90"
        >
          Add address
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tight text-on-surface mb-2">
            Select Shipping Address
          </h2>
          <p className="text-sm text-on-surface-variant font-medium max-w-xl">
            Choose where you want your components delivered.
          </p>
        </div>
        <Link
          href="/account/addresses"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border/40 bg-white hover:bg-surface-container-low font-black text-xs uppercase tracking-widest shrink-0 transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-lg">add</span>
          Add a New Address
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {addresses.map((addr) => {
          const selected = selectedId === addr.id;
          const line1 = addr.street || addr.address_line1 || "";
          const pc = addr.zip || addr.pincode || "";
          const icon = iconForLabel(addr.label);
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => setSelectedId(addr.id)}
              className={`text-left h-full p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-md ${
                selected
                  ? "border-primary bg-blue-50/40 shadow-primary/5"
                  : "border-transparent bg-white border-border/30 hover:border-primary/30"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-2 rounded-lg ${selected ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <h3 className="text-lg font-black mb-1 text-on-surface">{addr.label || "Address"}</h3>
              <div className="space-y-1 text-sm text-on-surface-variant leading-relaxed">
                <p>{line1}</p>
                <p>
                  {addr.city}, {addr.state} {pc}
                </p>
                <p>{addr.country || "India"}</p>
              </div>
              {addr.is_default && (
                <div className="mt-6 pt-6 border-t border-border/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Default</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/40 mb-10">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={gst}
            onChange={(e) => setGst(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <span>
            <span className="font-bold text-on-surface group-hover:text-primary transition-colors">
              I need a GST invoice for this order
            </span>
            <p className="text-xs text-on-surface-variant mt-1">
              UCEnterprises supports B2B tax compliance. Enter your GSTIN on your profile or with support if required.
            </p>
          </span>
        </label>
      </div>

      <div className="bg-surface-container-low rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row justify-between items-center gap-8 border border-border/20">
        <div className="max-w-md">
          <h3 className="text-xl font-black font-headline mb-2">Ready to proceed?</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            All items in your cart ({cartItemCount} line{cartItemCount === 1 ? "" : "s"}) will be shipped to the selected address.
          </p>
        </div>
        <Button
          type="button"
          onClick={proceed}
          disabled={!selectedId}
          className="w-full lg:w-auto px-10 py-6 h-auto text-base font-black rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          Proceed to payment
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

const METHODS: { id: PaymentMethod; title: string; subtitle: string; icon: string; badge?: string }[] = [
  { id: "card", title: "Credit or Debit Card", subtitle: "Visa, Mastercard, RuPay", icon: "credit_card" },
  { id: "upi", title: "UPI", subtitle: "Google Pay, PhonePe, Paytm", icon: "contactless", badge: "Popular" },
  { id: "netbanking", title: "Net Banking", subtitle: "All major banks", icon: "account_balance" },
  { id: "wallet", title: "Digital Wallets", subtitle: "Paytm, Amazon Pay", icon: "account_balance_wallet" },
];

/** stitch_screens/list2/select_payment.html — method tiles + Continue */
export function PaymentMethodStep({
  addressId,
  gst,
  initialMethod,
}: {
  addressId: string;
  gst: boolean;
  initialMethod?: PaymentMethod | null;
}) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>(initialMethod || "card");

  const continueToReview = () => {
    const q = new URLSearchParams();
    q.set("addressId", addressId);
    q.set("gst", gst ? "1" : "0");
    q.set("paymentMethod", method);
    router.push(`/checkout/review?${q.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl md:text-3xl font-black tracking-tight text-on-surface mb-2">
        Select Payment Method
      </h2>
      <p className="text-sm text-on-surface-variant mb-8">
        Choose how you would like to pay. You will confirm the order on the next step.
      </p>

      {METHODS.map((m) => {
        const active = method === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => setMethod(m.id)}
            className={`w-full text-left p-6 rounded-2xl border transition-all ${
              active
                ? "bg-surface-container-lowest border-primary shadow-md ring-1 ring-primary/20"
                : "bg-surface border-border/30 hover:bg-surface-container-low hover:border-border/50"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full border-4 shrink-0 ${active ? "border-primary" : "border-outline-variant"}`}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-on-surface">{m.title}</h3>
                    {m.badge && (
                      <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded font-black uppercase text-on-secondary-container">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant">{m.subtitle}</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant shrink-0">{m.icon}</span>
            </div>

            {active && m.id === "card" && (
              <div className="mt-6 pt-6 border-t border-border/20 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                <p className="md:col-span-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Card details (demo — not charged)
                </p>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Card number</label>
                  <input
                    readOnly
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="mt-1 w-full bg-surface-container-highest border-none rounded-lg p-3 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Expiry</label>
                  <input readOnly placeholder="MM / YY" className="mt-1 w-full bg-surface-container-highest rounded-lg p-3 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">CVV</label>
                  <input readOnly placeholder="•••" type="password" className="mt-1 w-full bg-surface-container-highest rounded-lg p-3 text-sm" />
                </div>
              </div>
            )}

            {active && m.id === "upi" && (
              <div className="mt-6 pt-6 border-t border-border/20">
                <label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">UPI ID</label>
                <input readOnly placeholder="name@upi" className="mt-1 w-full bg-surface-container-highest rounded-lg p-3 text-sm" />
              </div>
            )}
          </button>
        );
      })}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-xl font-black uppercase tracking-widest"
          onClick={() => router.push("/checkout")}
        >
          Back
        </Button>
        <Button type="button" className="flex-1 py-6 h-auto font-black rounded-xl shadow-lg gap-2" onClick={continueToReview}>
          Continue to review
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>

      <div className="mt-6 flex items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-border/20">
        <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified_user
        </span>
        <p className="text-xs text-on-secondary-container leading-snug">
          Your checkout is protected. Real payments would be processed through a secure gateway (Razorpay, etc.).
        </p>
      </div>
    </div>
  );
}

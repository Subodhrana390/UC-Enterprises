"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPriceINR } from "@/lib/utils";
import { CreditCard, Wallet, Building, Check, ArrowRight } from "lucide-react";

interface CheckoutPaymentStepProps {
  totalAmount: number;
  onPaymentMethodSelect?: (method: string) => void;
  selectedMethod?: string;
  minimumRequired?: number;
  subtotal?: number;
}

export function CheckoutPaymentStep({
  totalAmount,
  minimumRequired,
  subtotal,
}: CheckoutPaymentStepProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("addressId");
  const gst = searchParams.get("gst");

  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const isBelowMinimum = subtotal && minimumRequired && subtotal < minimumRequired;

  const proceedToReview = () => {
    if (!selectedMethod || !addressId) {
      alert("Please select a payment method and ensure address is selected.");
      return;
    }
    const q = new URLSearchParams();
    q.set("addressId", addressId);
    q.set("paymentMethod", selectedMethod);
    if (gst) q.set("gst", gst);
    router.push(`/checkout/review?${q.toString()}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black font-headline tracking-tight text-on-surface">Payment Method</h2>

      {isBelowMinimum && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              Minimum order amount is {formatPriceINR(minimumRequired || 0)}.
              Add {formatPriceINR((minimumRequired || 0) - (subtotal || 0))} more to continue.
            </p>
          </div>
      )}

      <div className="space-y-4">
        {/* Razorpay / Card */}
        <PaymentOption
          icon={<CreditCard className="w-5 h-5" />}
          title="Credit / Debit Card / UPI"
          description="Pay securely with Razorpay"
          selected={selectedMethod === "razorpay"}
          disabled={!!isBelowMinimum}
          onClick={() => setSelectedMethod("razorpay")}
        />

        {/* Cash on Delivery */}
        <PaymentOption
          icon={<Wallet className="w-5 h-5" />}
          title="Cash on Delivery (COD)"
          description="Pay when you receive your order"
          selected={selectedMethod === "cod"}
          disabled={!!isBelowMinimum}
          onClick={() => setSelectedMethod("cod")}
        />

        {/* Bank Transfer */}
        <PaymentOption
          icon={<Building className="w-5 h-5" />}
          title="Bank Transfer / NEFT"
          description="Transfer to our bank account"
          selected={selectedMethod === "bank_transfer"}
          disabled={!!isBelowMinimum}
          onClick={() => setSelectedMethod("bank_transfer")}
        />
      </div>

      {selectedMethod === "bank_transfer" && (
        <div className="p-4 bg-surface-container-low border border-border/20 rounded-xl space-y-2">
          <p className="text-sm font-bold">Bank Details:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
            <span>Bank:</span> <span className="font-semibold text-on-surface">HDFC Bank</span>
            <span>Account:</span> <span className="font-semibold text-on-surface">1234567890</span>
            <span>IFSC:</span> <span className="font-semibold text-on-surface">HDFC0001234</span>
          </div>
          <p className="text-[10px] text-on-surface-variant mt-2 italic">Send payment screenshot to support@ucent.com</p>
        </div>
      )}

      {selectedMethod && (
        <div className="pt-6 border-t border-border/10">
          <Button
            onClick={proceedToReview}
            className="w-full h-14 bg-primary text-white font-black text-sm rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            Review Order Details
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function PaymentOption({
  icon,
  title,
  description,
  selected,
  disabled,
  onClick,
  onSelect,
  processing,
  totalAmount,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  onSelect?: () => void;
  processing?: boolean;
  totalAmount?: number;
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`p-5 rounded-2xl border-2 transition-all duration-300 shadow-sm ${
        selected
          ? "border-primary bg-primary/5 shadow-primary/5"
          : "border-border/30 bg-white hover:border-primary/30"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${selected ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-on-surface uppercase tracking-tight">{title}</p>
          <p className="text-xs text-on-surface-variant font-medium">{description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
          selected ? "border-primary bg-primary" : "border-border"
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
      {selected && onSelect && (
        <div className="mt-5 pt-5 border-t border-primary/10">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            disabled={processing}
            className="w-full h-12 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20"
          >
            {processing ? "Initializing…" : `Secure Pay ${formatPriceINR(totalAmount || 0)}`}
          </Button>
        </div>
      )}
    </div>
  );
}
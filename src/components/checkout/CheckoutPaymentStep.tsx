"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createRazorpayPaymentOrder } from "@/lib/actions/checkout";
import { formatPriceINR } from "@/lib/utils";
import { CreditCard, Wallet, Building, Check } from "lucide-react";

interface CheckoutPaymentStepProps {
  totalAmount: number;
  onPaymentMethodSelect: (method: string) => void;
  selectedMethod: string;
  minimumRequired?: number;
  subtotal?: number;
}

export function CheckoutPaymentStep({
  totalAmount,
  onPaymentMethodSelect,
  selectedMethod,
  minimumRequired,
  subtotal,
}: CheckoutPaymentStepProps) {
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const isBelowMinimum = subtotal && minimumRequired && subtotal < minimumRequired;

  const handleRazorpay = async () => {
    setProcessing(true);
    try {
      const result = await createRazorpayPaymentOrder("");
      if (result.error) {
        alert(result.error);
        setProcessing(false);
        return;
      }

      if (result.orderId && result.amount) {
        const orderId = result.orderId;
        const amount = result.amount;
        // Load Razorpay script if not loaded
        if (!razorpayLoaded) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            setRazorpayLoaded(true);
            openRazorpay({ orderId, amount, keyId: result.keyId });
          };
          document.body.appendChild(script);
        } else {
          openRazorpay({ orderId, amount, keyId: result.keyId });
        }
      } else {
        alert("Failed to create payment order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
    setProcessing(false);
  };

  const openRazorpay = (result: { orderId: string; amount: number; keyId: string | undefined }) => {
    const options = {
      key: result.keyId,
      amount: result.amount,
      currency: "INR",
      name: "UCEnterprises",
      description: "Order Payment",
      order_id: result.orderId,
      handler: (response: any) => {
        onPaymentMethodSelect("razorpay");
        window.location.href = `/checkout/success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`;
      },
      prefill: {
        name: "",
        email: "",
      },
      theme: {
        color: "#008060",
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Payment Method</h2>

      {isBelowMinimum && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            Minimum order amount is {formatPriceINR(minimumRequired || 0)}. 
            Add {formatPriceINR((minimumRequired || 0) - (subtotal || 0))} more to continue.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {/* Razorpay / Card */}
        <PaymentOption
          icon={<CreditCard className="w-5 h-5" />}
          title="Credit / Debit Card / UPI"
          description="Pay securely with Razorpay"
          selected={selectedMethod === "razorpay"}
          disabled={!!isBelowMinimum}
          onClick={() => onPaymentMethodSelect("razorpay")}
          onSelect={handleRazorpay}
          processing={processing}
        />

        {/* Cash on Delivery */}
        <PaymentOption
          icon={<Wallet className="w-5 h-5" />}
          title="Cash on Delivery (COD)"
          description="Pay when you receive your order"
          selected={selectedMethod === "cod"}
          disabled={!!isBelowMinimum}
          onClick={() => onPaymentMethodSelect("cod")}
        />

        {/* Bank Transfer */}
        <PaymentOption
          icon={<Building className="w-5 h-5" />}
          title="Bank Transfer / NEFT"
          description="Transfer to our bank account"
          selected={selectedMethod === "bank_transfer"}
          disabled={!!isBelowMinimum}
          onClick={() => onPaymentMethodSelect("bank_transfer")}
        />
      </div>

      {selectedMethod === "bank_transfer" && (
        <div className="p-4 bg-[#f5f5f5] rounded-lg space-y-2">
          <p className="text-sm font-medium">Bank Details:</p>
          <p className="text-xs text-[#616161]">Bank: HDFC Bank</p>
          <p className="text-xs text-[#616161]">Account: 1234567890</p>
          <p className="text-xs text-[#616161]">IFSC: HDFC0001234</p>
          <p className="text-xs text-[#616161]">Send payment screenshot to support@ucent.com</p>
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  onSelect?: () => void;
  processing?: boolean;
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        selected
          ? "border-[#008060] bg-[#e3f1df]"
          : "border-[#d2d2d2] hover:border-[#babfc3]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={selected ? "text-[#008060]" : "text-[#616161]"}>{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-[#616161]">{description}</p>
        </div>
        {selected && <Check className="w-5 h-5 text-[#008060]" />}
      </div>
      {selected && onSelect && (
        <div className="mt-3">
          <Button
            onClick={onSelect}
            disabled={processing}
            className="w-full bg-[#008060] hover:bg-[#006e52] text-white"
          >
            {processing ? "Processing..." : `Pay ${formatPriceINR(0)}`}
          </Button>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createOrder } from "@/lib/actions/checkout";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

export function CheckoutSuccessStep({ selectedMethod }: { selectedMethod: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrder = async () => {
      const orderId = searchParams.get("order_id");
      const paymentId = searchParams.get("payment_id");

      try {
        const result = await createOrder(
          "", // userId will be fetched from server
          "", // addressId will be fetched from session
          selectedMethod as "razorpay" | "cod" | "bank_transfer",
          paymentId || undefined,
          orderId || undefined
        );

        if (result.error) {
          setError(result.error);
        } else {
          router.push("/checkout/confirmation");
        }
      } catch (err) {
        setError("Order creation failed. Please contact support.");
      }
      setProcessing(false);
    };

    processOrder();
  }, [router, searchParams, selectedMethod]);

  if (processing) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-[#008060] mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Processing your order...</h2>
        <p className="text-[#616161]">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-xl">✕</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">Order Failed</h2>
        <p className="text-[#616161] mb-4">{error}</p>
        <Button onClick={() => router.push("/cart")} className="bg-[#1a1c1d] text-white">
          Return to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <CheckCircle className="w-12 h-12 text-[#008060] mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Order Confirmed!</h2>
      <p className="text-[#616161]">Redirecting to confirmation page...</p>
    </div>
  );
}
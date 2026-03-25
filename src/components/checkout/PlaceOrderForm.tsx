"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createRazorpayOrderAction,
  placeOrder,
  verifyRazorpayAndPlaceOrder,
} from "@/lib/actions/checkout";
import { clearCart as clearLocalCart } from "@/lib/store/shop-store";

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (ev: string, fn: (err: unknown) => void) => void };
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.Razorpay) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export function PlaceOrderForm({
  addressId,
  requestGst,
  paymentMethod = "card",
  razorpayEnabled,
}: {
  addressId?: string;
  requestGst?: boolean;
  paymentMethod?: string;
  /** Set from server: isRazorpayConfigured() */
  razorpayEnabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function payWithRazorpay() {
    setLoading(true);
    try {
      await loadRazorpayScript();
      const fd = new FormData();
      fd.set("addressId", addressId || "");
      const created = await createRazorpayOrderAction(fd);
      if ("error" in created && created.error) {
        toast.error(created.error);
        setLoading(false);
        return;
      }
      if (!("keyId" in created) || !created.keyId || !created.orderId) {
        toast.error("Could not start payment");
        setLoading(false);
        return;
      }

      const Rzp = window.Razorpay;
      if (!Rzp) {
        toast.error("Razorpay failed to load");
        setLoading(false);
        return;
      }

      const options: Record<string, unknown> = {
        key: created.keyId,
        amount: created.amountPaise,
        currency: created.currency || "INR",
        order_id: created.orderId,
        name: "UC Enterprises",
        description: "Order payment",
        prefill: created.prefill,
        theme: { color: "#000816" },
        handler: async (response: RazorpaySuccess) => {
          setLoading(true);
          const vfd = new FormData();
          vfd.set("razorpay_order_id", response.razorpay_order_id);
          vfd.set("razorpay_payment_id", response.razorpay_payment_id);
          vfd.set("razorpay_signature", response.razorpay_signature);
          vfd.set("addressId", addressId || "");
          vfd.set("gstInvoice", requestGst ? "true" : "false");
          vfd.set("paymentMethod", paymentMethod || "razorpay");
          const result = await verifyRazorpayAndPlaceOrder(vfd);
          if ("error" in result && result.error) {
            toast.error(result.error);
            setLoading(false);
            return;
          }
          if ("success" in result && result.success && result.orderId) {
            toast.success("Payment verified! Order placed.");
            clearLocalCart();
            router.push(`/checkout/success/${result.orderId}`);
            return;
          }
          toast.error("Order could not be completed");
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new Rzp(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Payment error");
      setLoading(false);
    }
  }

  async function handleDemoOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await placeOrder(fd);
    setLoading(false);
    if (result && "error" in result && result.error) {
      toast.error(result.error);
      return;
    }
    if (result && "success" in result && result.success && result.orderId) {
      toast.success("Order placed successfully!");
      // Sync with local shop-store
      clearLocalCart();
      router.push(`/checkout/success/${result.orderId}`);
    }
  }

  const isRazorpayMethod = paymentMethod !== "cod" && paymentMethod !== "bank_transfer";

  if (!razorpayEnabled || !isRazorpayMethod) {
    let buttonText = "Place order";
    if (loading) {
      buttonText = "Processing…";
    } else if (paymentMethod === "cod") {
      buttonText = "Confirm Order - Pay Cash";
    } else if (paymentMethod === "bank_transfer") {
      buttonText = "Confirm Order - Bank Transfer";
    } else if (!razorpayEnabled && isRazorpayMethod) {
      buttonText = "Place order (Demo)";
    }

    return (
      <form onSubmit={(e) => void handleDemoOrder(e)}>
        <input type="hidden" name="addressId" value={addressId || ""} />
        <input type="hidden" name="gstInvoice" value={requestGst ? "true" : "false"} />
        <input type="hidden" name="paymentMethod" value={paymentMethod} />
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary text-white font-black text-sm rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          {buttonText}
        </Button>
        {!razorpayEnabled && isRazorpayMethod && (
          <p className="text-[10px] text-on-surface-variant text-center mt-3 uppercase tracking-widest">
            Add Razorpay keys in env for live payments
          </p>
        )}
        {paymentMethod === "cod" && (
          <p className="text-[10px] text-on-surface-variant text-center mt-3 uppercase tracking-widest">
            Payment will be collected at delivery
          </p>
        )}
      </form>
    );
  }

  return (
    <>
      <Button
        type="button"
        disabled={loading}
        onClick={() => void payWithRazorpay()}
        className="w-full h-14 bg-primary text-white font-black text-sm rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
      >
        {loading ? "Please wait…" : "Pay with Razorpay"}
      </Button>
      <p className="text-[10px] text-on-surface-variant text-center mt-3 uppercase tracking-widest">
        Secure payment · Cards, UPI, netbanking via Razorpay
      </p>
    </>
  );
}

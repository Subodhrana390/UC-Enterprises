import crypto from "node:crypto";
import Razorpay from "razorpay";

function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function isRazorpayConfigured(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Amount in INR → paise (Razorpay smallest unit) */
export function inrToPaise(amountInr: number): number {
  return Math.round(amountInr * 100);
}

export async function createRazorpayOrderId(amountInr: number, receipt: string) {
  const rzp = getRazorpay();
  if (!rzp) {
    return { error: "Razorpay is not configured" as const };
  }
  const amountPaise = inrToPaise(amountInr);
  if (amountPaise < 100) {
    return { error: "Order total must be at least ₹1" as const };
  }
  try {
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: receipt.slice(0, 40),
    });
    return {
      orderId: order.id,
      amountPaise,
      currency: order.currency,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create payment order";
    console.error("[razorpay] create order", e);
    return { error: msg };
  }
}

export async function fetchRazorpayOrder(orderId: string) {
  const rzp = getRazorpay();
  if (!rzp) return null;
  try {
    return await rzp.orders.fetch(orderId);
  } catch {
    return null;
  }
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expected.length !== razorpaySignature.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(razorpaySignature, "utf8"));
  } catch {
    return false;
  }
}

export function getPublicRazorpayKeyId(): string | undefined {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? process.env.RAZORPAY_KEY_ID;
}

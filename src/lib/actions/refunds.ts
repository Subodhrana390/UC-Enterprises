"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Process refund for canceled order
export async function processRefund(formData: FormData) {
  const supabase = await createClient();
  
  const orderId = formData.get("orderId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const accountHolderName = formData.get("accountHolderName") as string;
  const accountNumber = formData.get("accountNumber") as string;
  const ifscCode = formData.get("ifscCode") as string;
  const bankName = formData.get("bankName") as string;
  const refundAmount = parseFloat(formData.get("refundAmount") as string);

  if (!orderId || !paymentMethod) {
    return { error: "Order ID and payment method are required." };
  }

  // Verify order is canceled
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, payment_records(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { error: "Order not found." };
  }

  if (order.status !== "cancelled") {
    return { error: "Only cancelled orders can be refunded." };
  }

  // Create refund record
  const refundData: any = {
    order_id: orderId,
    amount: refundAmount || order.total_amount,
    payment_method: paymentMethod,
    status: "pending",
    requested_at: new Date().toISOString(),
  };

  // For COD/Bank Transfer, store bank details
  if (paymentMethod === "cod" || paymentMethod === "bank_transfer") {
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return { error: "Bank details are required for COD/Bank Transfer refunds." };
    }
    
    refundData.bank_details = JSON.stringify({
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName
    });
  }

  const { error: refundError } = await supabase
    .from("refunds")
    .insert(refundData);

  if (refundError) {
    console.error("Error creating refund:", refundError);
    return { error: "Failed to process refund request." };
  }

  // Update order payment status
  await supabase
    .from("orders")
    .update({ payment_status: "refund_pending" })
    .eq("id", orderId);

  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
  
  return { 
    success: true, 
    message: paymentMethod === "razorpay" 
      ? "Refund will be processed to your original payment method within 5-7 business days."
      : "Refund request submitted. Amount will be transferred to your bank account within 7-10 business days."
  };
}

// Get refund details
export async function getRefundByOrderId(orderId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("refunds")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

// Update refund status (admin only)
export async function updateRefundStatus(refundId: string, status: string, transactionId?: string) {
  const supabase = await createClient();

  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  };

  if (status === "completed") {
    updates.processed_at = new Date().toISOString();
    if (transactionId) {
      updates.transaction_id = transactionId;
    }
  }

  const { error } = await supabase
    .from("refunds")
    .update(updates)
    .eq("id", refundId);

  if (error) {
    console.error("Error updating refund status:", error);
    return { error: error.message };
  }

  // Update order payment status
  if (status === "completed") {
    const { data: refund } = await supabase
      .from("refunds")
      .select("order_id")
      .eq("id", refundId)
      .single();

    if (refund) {
      await supabase
        .from("orders")
        .update({ payment_status: "refunded" })
        .eq("id", refund.order_id);
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

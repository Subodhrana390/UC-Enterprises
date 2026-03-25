"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isValidStatusTransition, getAllowedStatuses as getAllowedStatusesSync, getStatusTransitions } from "@/lib/utils/order-status";

// Async wrapper for getAllowedStatuses to comply with Next.js 16.2.1 server actions requirement
export async function getAllowedStatuses(currentStatus: string): Promise<string[]> {
  return getAllowedStatusesSync(currentStatus);
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  notes?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Get current order status
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!order) {
    return { error: "Order not found" };
  }

  // Validate status transition
  if (!isValidStatusTransition(order.status, newStatus)) {
    const STATUS_TRANSITIONS = getStatusTransitions();
    return {
      error: `Cannot transition from ${order.status} to ${newStatus}. Valid transitions: ${STATUS_TRANSITIONS[order.status].join(", ") || "none"}`,
    };
  }

  // Update order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Record status history
  await supabase.from("order_status_history").insert({
    order_id: orderId,
    from_status: order.status,
    to_status: newStatus,
    changed_by: user.id,
    notes,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/account/orders/${orderId}`);
  return { success: true };
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: string,
  paymentMethod?: string,
  transactionId?: string
) {
  const supabase = await createClient();

  const updateData: any = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  };

  if (paymentMethod) {
    updateData.payment_method = paymentMethod;
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  // Record payment
  if (paymentMethod) {
    const { data: order } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("id", orderId)
      .single();

    await supabase.from("payment_records").insert({
      order_id: orderId,
      payment_method: paymentMethod,
      transaction_id: transactionId,
      amount: order?.total_amount || 0,
      status: paymentStatus === "paid" ? "completed" : "pending",
    });
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getOrderStatusHistory(orderId: string) {
  const supabase = await createClient();
  return supabase
    .from("order_status_history")
    .select(`
      *,
      profiles(full_name)
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });
}

export async function addOrderNote(orderId: string, note: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      notes: note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateTrackingNumber(orderId: string, trackingNumber: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  return { success: true };
}
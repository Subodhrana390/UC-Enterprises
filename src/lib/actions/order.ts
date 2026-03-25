"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items(
        id,
        order_id,
        product_id,
        quantity,
        unit_price,
        total_price,
        products:products(
          id,
          name,
          slug,
          sku,
          images,
          base_price
        )
      ),
      shipping_address:addresses!shipping_address_id(
        *
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error fetching order details:', error);
    return null;
  }

  return data;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", orderId);

  if (error) {
    console.error("Update Error:", error);
    throw new Error("Could not update order status.");
  }

  revalidatePath("/admin/orders");
}

export async function updatePaymentStatus(orderId: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ payment_status: newStatus })
    .eq("id", orderId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
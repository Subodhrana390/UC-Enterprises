"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function RealtimeOrderUpdates({ userId }: { userId: string }) {
  const router = useRouter();
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("user-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          const oldStatus = payload.old?.status;

          // Show toast notification for status changes
          if (newStatus !== oldStatus) {
            // Play notification sound
            try {
              const audio = new Audio("/notification.mp3");
              audio.play().catch(() => {});
            } catch {}
          }

          // Refresh page data
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  return null;
}

export function RealtimeInventoryUpdates({ productIds }: { productIds: string[] }) {
  const [inventory, setInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    if (productIds.length === 0) return;

    const supabase = createClient();

    const channel = supabase
      .channel("inventory-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: productIds.length === 1 ? `id=eq.${productIds[0]}` : undefined,
        },
        (payload) => {
          setInventory((prev) => ({
            ...prev,
            [payload.new.id]: payload.new.stock_quantity,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productIds]);

  return null;
}

export function useOrderRealtime(orderId: string) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", orderId)
        .single();
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev: any) => (prev ? { ...prev, ...payload.new } : prev));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return { order, loading };
}
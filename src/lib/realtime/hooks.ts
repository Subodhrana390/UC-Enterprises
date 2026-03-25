"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useRealtimeOrders(userId?: string) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Initial fetch
    const fetchOrders = async () => {
      let query = supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data } = await query;
      setOrders(data || []);
    };

    fetchOrders();

    // Subscribe to changes
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new, ...prev]);
            if (!userId) {
              toast(`Order #${payload.new.id.toString().substring(0, 8)} placed`);
            }
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              )
            );
            if (userId && payload.new.status !== payload.old?.status) {
              toast(`Order #${payload.new.id.toString().substring(0, 8)} is now ${payload.new.status}`);
            }
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((order) => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return orders;
}

export function useRealtimeCart(userId: string) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchCart = async () => {
      const { data } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", userId);
      setCartItems(data || []);
    };

    fetchCart();

    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCartItems((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setCartItems((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setCartItems((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return cartItems;
}

export function useRealtimeProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brands(*), categories(*)")
        .order("created_at", { ascending: false });
      setProducts(data || []);
    };

    fetchProducts();

    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProducts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setProducts((prev) =>
              prev.map((product) =>
                product.id === payload.new.id ? { ...product, ...payload.new } : product
              )
            );
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) => prev.filter((product) => product.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return products;
}

export function useRealtimeInventory(productIds: string[]) {
  const [inventory, setInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    if (productIds.length === 0) return;

    const supabase = createClient();

    const fetchInventory = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, stock_quantity")
        .in("id", productIds);

      const inventoryMap = data?.reduce((acc, product) => {
        acc[product.id] = product.stock_quantity;
        return acc;
      }, {} as Record<string, number>) || {};

      setInventory(inventoryMap);
    };

    fetchInventory();

    const channel = supabase
      .channel("inventory-changes")
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

  return inventory;
}
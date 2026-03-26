"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addToCart, removeFromCart, useShopStore } from "@/lib/store/shop-store";
import { addToCart as addToCartAction, removeFromCartByProductId } from "@/lib/actions/cart";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AddToCartButton({
  productId,
  quantity = 1,
  className,
  children,
  productName = "Product",
  productPrice = 0,
  productImage = "/placeholder-product.png",
  stockQuantity,
}: {
  productId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  stockQuantity?: number;
}) {

  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDisabled = useMemo(() => stockQuantity !== undefined && stockQuantity <= 0, [stockQuantity]);
  const cartQuantity = useShopStore((s) => s.cart[productId]?.quantity ?? 0);
  const isAdded = isMounted && cartQuantity > 0;

  async function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login?redirect=/cart");
      return;
    }

    if (isDisabled) return;

    await addToCartAction(productId, quantity);

    addToCart(
      {
        productId,
        name: productName,
        price: productPrice,
        image: productImage,
        stockQuantity,
      },
      quantity,
    );
    router.refresh();
    toast.success(cartQuantity > 0 ? "Quantity updated" : "Added to cart");
  }

  return (
    <Button
      type="button"
      disabled={isDisabled}
      className={className}
      onClick={(e) => {
        if (isAdded) {
          removeFromCart(productId);
          removeFromCartByProductId(productId);
          toast.success("Removed from cart");
        } else {
          onAdd(e);
        }
      }}
    >
      {children ?? (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">
            {isAdded ? "check_circle" : "shopping_cart"}
          </span>
          <span>{isAdded ? "Added" : "Add to Cart"}</span>
        </div>
      )}
    </Button>
  );
}
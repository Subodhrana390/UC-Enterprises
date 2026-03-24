"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { addToCart, useShopStore } from "@/lib/store/shop-store";
import { toast } from "sonner";

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
  const isDisabled = useMemo(() => stockQuantity !== undefined && stockQuantity <= 0, [stockQuantity]);
  const cartQuantity = useShopStore((s) => s.cart[productId]?.quantity ?? 0);
  const isAdded = cartQuantity > 0;

  function onAdd() {
    if (isDisabled) return;
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
    toast.success(isAdded ? "Cart quantity updated" : "Added to cart");
  }

  return (
    <Button type="button" disabled={isDisabled} className={className} onClick={onAdd}>
      {children ?? (
        <>
          <span className="material-symbols-outlined">{isAdded ? "check_circle" : "shopping_cart"}</span>
          {isAdded ? "Added" : "Add to Cart"}
        </>
      )}
    </Button>
  );
}

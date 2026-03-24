"use client";

import { useMemo, useState, useEffect } from "react";
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
  // 1. Add mounting state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDisabled = useMemo(() => stockQuantity !== undefined && stockQuantity <= 0, [stockQuantity]);

  // 2. Only check the store value if we are on the client (mounted)
  const cartQuantity = useShopStore((s) => s.cart[productId]?.quantity ?? 0);
  const isAdded = isMounted && cartQuantity > 0;

  function onAdd(e: React.MouseEvent) {
    // 3. Prevent event bubbling if this button is inside a Link or Card
    e.preventDefault();
    e.stopPropagation();

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
    toast.success(cartQuantity > 0 ? "Quantity updated" : "Added to cart");
  }

  return (
    <Button
      type="button"
      disabled={isDisabled}
      className={className}
      onClick={onAdd}
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
"use client";

import { Button } from "@/components/ui/button";
import { toggleWishlist, useShopStore } from "@/lib/store/shop-store";
import { toast } from "sonner";

export function AddToWishlistButton({
  productId,
  className,
  variant = "outline",
  productName = "Product",
  productPrice = 0,
  productImage = "/placeholder-product.png",
  stockQuantity,
  brandName,
  description,
}: {
  productId: string;
  className?: string;
  variant?: "default" | "outline";
  productName?: string;
  productPrice?: number;
  productImage?: string;
  stockQuantity?: number;
  brandName?: string;
  description?: string;
}) {
  const isWishlisted = useShopStore((s) => Boolean(s.wishlist[productId]));

  function onToggle() {
    toggleWishlist(productId, {
      productId,
      name: productName,
      price: productPrice,
      image: productImage,
      stockQuantity,
      brandName,
      description,
    });
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  }

  return (
    <Button type="button" onClick={onToggle} variant={variant} className={className} aria-pressed={isWishlisted} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
      <span className="material-symbols-outlined" style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}>
        favorite
      </span>
    </Button>
  );
}

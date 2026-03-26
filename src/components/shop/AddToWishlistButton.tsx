"use client";

import { Button } from "@/components/ui/button";
import { toggleWishlist, useShopStore } from "@/lib/store/shop-store";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const supabase = createClient();

  async function onToggle() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to manage wishlist");
      router.push("/login?redirect=/wishlist");
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }

    toggleWishlist(productId, {
      productId,
      name: productName,
      price: productPrice,
      image: productImage,
      stockQuantity,
      brandName,
      description,
    });
    router.refresh();
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

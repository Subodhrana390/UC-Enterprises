"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addCartItem } from "@/lib/cart";
import { toast } from "sonner";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number | string;
    image_url?: string | null;
  };
  quantity?: number;
  className?: string;
  label?: string;
};

export default function AddToCartButton({ product, quantity = 1, className, label = "Add to Cart" }: Props) {
  return (
    <Button
      className={className}
      onClick={() => {
        addCartItem(
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
          },
          quantity
        );
        toast.success(`${product.name} added to cart`);
      }}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

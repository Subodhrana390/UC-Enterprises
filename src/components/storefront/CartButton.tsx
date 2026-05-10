"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartCount } from "@/lib/cart";

export default function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(getCartCount());
    sync();
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-primary">
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -right-3 -top-2 min-w-5 rounded-full bg-primary px-1.5 py-0.5 text-center text-[10px] font-black text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

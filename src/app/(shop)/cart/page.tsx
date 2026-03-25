import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCartSummary } from "@/lib/actions/cart";
import { CartClient } from "./CartClient";
import { ShoppingCart } from "lucide-react";

export default async function CartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/cart");
  }

  const { items, subtotal, count, belowMinimum, minimumRequired } = await getCartSummary(user.id);

  return (
    <main className="pt-10 pb-24 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto">
      <header className="mb-8 text-center md:text-left">
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-surface mb-2 flex items-center justify-center md:justify-start gap-3">
          <ShoppingCart className="w-8 h-8" />
          Shopping Cart
        </h1>
        <p className="text-on-surface-variant font-medium text-sm">
          {count} {count === 1 ? "item" : "items"} in your cart
        </p>
      </header>

      <CartClient
        userId={user.id}
        initialItems={items}
        subtotal={subtotal}
        belowMinimum={belowMinimum}
        minimumRequired={minimumRequired}
      />
    </main>
  );
}
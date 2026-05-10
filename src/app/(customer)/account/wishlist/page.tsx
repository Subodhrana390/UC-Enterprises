"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowRight, Star, AlertCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { addCartItem } from "@/lib/cart";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          *,
          products (*)
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Error fetching wishlist");
    } finally {
      setLoading(false);
    }
  }

  const removeFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase.from("wishlist").delete().eq("id", id);

      if (error) throw error;
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (error: any) {
      toast.error("Error removing item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">My Wishlist</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Products saved for later purchase</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 border border-primary/20">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">{items.length} Items Saved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group bg-white border border-zinc-100 shadow-xl p-6 hover:border-primary/50 transition-all flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-zinc-50 relative shrink-0">
              <Image
                src={item.products?.image_url || "/images/placeholder.png"}
                alt={item.products?.name}
                fill
                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="bg-zinc-950 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">Saved Item</span>
                  <div className="flex text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic">{item.products?.name}</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Product Code: UC-{item.products?.id.slice(0, 8).toUpperCase()}</p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-6">
                <p className="text-2xl font-black tracking-tighter text-primary">{formatCurrency(item.products?.price)}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 border border-emerald-100">
                  <Package className="w-3 h-3" /> In Stock
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Button
                className="h-12 bg-zinc-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-none shadow-lg group-hover:translate-x-1 transition-transform"
                onClick={() => {
                  if (!item.products) return;
                  addCartItem({
                    id: item.products.id,
                    slug: item.products.slug,
                    name: item.products.name,
                    price: Number(item.products.price),
                    image_url: item.products.image_url,
                  });
                  toast.success("Added to cart");
                }}
              >
                Add to Cart <ShoppingCart className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => removeFromWishlist(item.id)}
                className="h-12 border-zinc-100 text-zinc-400 hover:text-red-500 hover:border-red-500 font-black uppercase tracking-widest text-[10px] px-8 rounded-none"
              >
                Remove <Trash2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-white border border-zinc-100 shadow-xl p-20 text-center space-y-6">
            <div className="relative inline-block">
              <Heart className="w-16 h-16 text-zinc-100 mx-auto" />
              <AlertCircle className="w-6 h-6 text-primary absolute -bottom-1 -right-1" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-black uppercase tracking-tighter italic">Your wishlist is currently empty</p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest max-w-xs mx-auto">Start exploring products and save the items you want to order later.</p>
            </div>
            <Link href="/products">
              <Button className="h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-12 rounded-none mt-4 shadow-xl">
                Browse Products <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

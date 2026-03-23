import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { formatPriceINR } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WishlistRemoveButton, WishlistAddToCartButton } from "@/components/account/WishlistItemActions";

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select("*, products(*, brands(name))")
    .eq("user_id", user.id);

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-500 text-sm">
          View and manage the items you&apos;ve saved for later.
        </p>
      </header>

      {/* Stats & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold text-black">{wishlistItems?.length || 0}</span> items in your list
        </div>

        <div className="relative w-full md:w-80">
          <Input
            className="w-full h-11 bg-gray-50 border-gray-200 rounded-lg pl-10 text-sm focus:bg-white transition-all"
            placeholder="Search your wishlist..."
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">search</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistItems && wishlistItems.length > 0 ? (
          wishlistItems.map((item: any) => (
            <div key={item.id} className="group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">

              {/* Product Image */}
              <Link href={`/product/${item.products?.slug}`} className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={item.products?.images?.[0] || "/placeholder.png"}
                  alt={item.products?.name}
                  fill
                  className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Stock Badge */}
                <div className="absolute top-4 left-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1.5 ${item.products?.stock_quantity > 0 ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.products?.stock_quantity > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {item.products?.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                {/* Remove Button - Top Right */}
                <div className="absolute top-4 right-4">
                  <WishlistRemoveButton wishlistItemId={item.id} />
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-auto">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">
                    {item.products?.brands?.name}
                  </p>
                  <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-1">
                    {item.products?.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.products?.description}
                  </p>
                </div>

                {/* Bottom Row: Price & Add to Cart */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPriceINR(item.products?.base_price ?? 0)}
                    </p>
                    <p className="text-[10px] text-gray-400">Incl. all taxes</p>
                  </div>

                  <WishlistAddToCartButton wishlistItemId={item.id} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-gray-300 text-4xl">favorite</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven&apos;t added anything yet.</p>
            <Button className="bg-black text-white rounded-full px-8">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
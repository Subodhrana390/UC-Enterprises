import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { formatCurrency } from "@/lib/format";
import { getDepartmentFromCategoryName, getDepartmentMeta } from "@/lib/storefront";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, image_url, status, stock_quantity, categories(name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_30%,#fffdf7_100%)]">
      <section className="container mx-auto px-4 py-14">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Catalog</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">Business-ready products for every order size</h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            Explore our live catalog with current pricing, stock visibility, and direct category navigation across chemicals, glassware, tools, safety equipment, and industrial goods.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {(products || []).map((product) => {
            const categoryName = (product as any).categories?.[0]?.name || (product as any).categories?.name || "General";
            const department = getDepartmentMeta(getDepartmentFromCategoryName(categoryName));

            return (
              <div
                key={product.id}
                className="group overflow-hidden border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-square bg-orange-50">
                  <Image
                    src={product.image_url || "/images/prod_main.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>{categoryName}</span>
                    <span>{product.stock_quantity > 0 ? "In Stock" : "Back Soon"}</span>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">{department.label}</p>
                  <h2 className="line-clamp-2 text-lg font-bold text-zinc-950 transition group-hover:text-primary">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-zinc-950">{formatCurrency(product.price)}</span>
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                      View
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                </Link>
                <div className="px-5 pb-5">
                  <Link href={`/get-quote?product=${product.slug}`} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary">
                    Get Best Quote
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {!products?.length && (
          <div className="mt-10 flex flex-col items-center gap-4 border border-dashed border-orange-200 bg-white p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-primary" />
            <p className="text-sm font-semibold text-zinc-600">Products will appear here as soon as they are published in Supabase.</p>
          </div>
        )}
      </section>
    </div>
  );
}

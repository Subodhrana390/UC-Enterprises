import { createClient } from "@/utils/supabase/server";
import QuoteRequestForm from "@/components/storefront/QuoteRequestForm";

export default async function GetQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  let product:
    | {
        id: string;
        name: string;
      }
    | undefined;

  if (params.product) {
    const { data } = await supabase
      .from("products")
      .select("id, name")
      .eq("slug", params.product)
      .maybeSingle();

    if (data) {
      product = data;
    }
  }

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]">
      <section className="container mx-auto max-w-5xl px-4 py-14">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Get Quote</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">
            Request the best price for your requirement
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-zinc-600">
            Share your quantity, city, GST requirement, preferred brand, and delivery timeline. Our team will contact you with pricing and availability.
          </p>
        </div>

        <QuoteRequestForm product={product} />
      </section>
    </div>
  );
}

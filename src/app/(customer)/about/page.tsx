export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="container mx-auto max-w-4xl px-4 py-14">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">About UC Enterprises</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950">A sourcing partner for welding hardware, electronics, lab chemicals, powders, and general supply</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-600">
          <p>
            UC Enterprises serves customers across India with dependable supply, business-friendly pricing, and practical product guidance across hardware welding materials, electronic goods, lab chemicals, powders, and day-to-day order requirements.
          </p>
          <p>
            The catalog is designed for both direct purchases and inquiry-led procurement, which is why the storefront, account pages, and admin dashboard
            now connect to the same backend product and order records.
          </p>
        </div>
      </section>
    </div>
  );
}

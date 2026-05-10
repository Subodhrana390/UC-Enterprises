import { supportEmail, supportPhone } from "@/lib/storefront";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="container mx-auto max-w-4xl px-4 py-14">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Contact</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950">Reach our sales and support desk</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">
          Contact us for hardware welding materials, electronic goods, lab chemicals and powders, and general order supply requirements.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="border border-orange-100 bg-orange-50 p-6">
            <h2 className="text-lg font-bold text-zinc-950">Phone</h2>
            <p className="mt-2 text-sm text-zinc-600">{supportPhone}</p>
          </div>
          <div className="border border-orange-100 bg-white p-6">
            <h2 className="text-lg font-bold text-zinc-950">Email</h2>
            <p className="mt-2 text-sm text-zinc-600">{supportEmail}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

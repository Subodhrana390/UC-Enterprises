import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { AddAddressForm } from "@/components/account/AddAddressForm";
import { AddressActions } from "@/components/account/AddressActions";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Logistics Endpoints</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Manage your global shipping and billing coordinates</p>
        </div>
        <AddAddressForm />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {addresses && addresses.length > 0 ? addresses.map((addr) => (
          <Card key={addr.id} className={`rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5 hover:border-primary/20 transition-all group p-8 ${addr.is_default ? "ring-2 ring-primary ring-offset-4 ring-offset-surface" : ""}`}>
            <CardContent className="p-0 space-y-6">
              <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-2xl bg-surface border border-border/10 flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined">{addr.type === 'billing' ? 'payments' : 'local_shipping'}</span>
                  </div>
                  {addr.is_default && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter bg-primary/10 text-primary border border-primary/20">
                      Primary Destination
                    </span>
                  )}
              </div>
              
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2">{addr.label || addr.full_name || "Unnamed Location"}</h3>
                <div className="text-[11px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest leading-relaxed">
                  <p>{addr.street || addr.address_line1}</p>
                  <p>{addr.city}, {addr.state} {addr.zip || addr.pincode}</p>
                  <p>{addr.country || ""}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-border/10">
                <AddressActions addressId={addr.id} isDefault={!!addr.is_default} />
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="lg:col-span-3 py-20 text-center space-y-4 opacity-30">
            <span className="material-symbols-outlined text-6xl">map</span>
            <p className="text-[10px] font-black uppercase tracking-widest">No logistics endpoints registered in your system</p>
          </div>
        )}
      </div>
    </div>
  );
}

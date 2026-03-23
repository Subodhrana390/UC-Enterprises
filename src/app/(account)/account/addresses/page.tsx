import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AddressActions } from "@/components/account/AddressActions";
import { AddressForm } from "@/components/account/AddressForm"; // Import the form for the Add button

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
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Saved Addresses</h1>
          <p className="text-sm text-gray-500">Manage your shipping and billing addresses for faster checkout.</p>
        </div>
        {/* CORRECTED: Use AddressForm here for the 'Add New' functionality */}
        <AddressForm mode="add" />
      </header>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses && addresses.length > 0 ? (
          addresses.map((addr) => (
            <Card 
              key={addr.id} 
              className={`rounded-xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col ${
                addr.is_default 
                  ? "border-black ring-1 ring-black" 
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Header: Icon & Badges */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    addr.is_default ? "bg-black text-white" : "bg-gray-50 text-gray-400"
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {addr.type === 'billing' ? 'receipt_long' : 'home_pin'}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {addr.is_default && (
                      <span className="text-[10px] px-2 py-1 rounded bg-black text-white font-bold uppercase tracking-wider">
                        Default
                      </span>
                    )}
                    {addr.label && (
                      <span className="text-[10px] px-2 py-1 rounded bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
                        {addr.label}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Address Details */}
                <div className="flex-grow space-y-1">
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-900 uppercase text-xs tracking-tight mb-2">
                       {addr.full_name}
                    </p>
                    
                    <p className="text-gray-900 font-medium">{addr.address_line1}</p>
                    {addr.address_line2 && <p>{addr.address_line2}</p>}
                    <p>{addr.city}, {addr.state} - <span className="font-semibold text-gray-900">{addr.pincode}</span></p>
                    
                    <p className="mt-4 flex items-center gap-2 text-[13px] text-gray-900 font-medium bg-gray-50 p-2 rounded-md border border-gray-100">
                      <span className="material-symbols-outlined text-sm text-gray-400">call</span>
                      {addr.phone_number || "No phone provided"}
                    </p>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex gap-4 pt-6 mt-6 border-t border-gray-50">
                  {/* CORRECTED: Pass the full 'addr' object so the edit form can populate */}
                  <AddressActions address={addr} isDefault={!!addr.is_default} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-300 text-3xl">map</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900">No addresses found</h3>
            <p className="text-xs text-gray-500 mt-1">Add an address to make your next checkout even faster.</p>
          </div>
        )}
      </div>
    </div>
  );
}
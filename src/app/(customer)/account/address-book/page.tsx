"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Edit2, Trash2, Home, Building2, CheckCircle2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<any>({
    type: "Home",
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    is_default: false
  });
  const supabase = createClient();

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error: any) {
      toast.error(error.message || "Error fetching addresses");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("addresses")
        .upsert({
          ...currentAddress,
          user_id: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success(currentAddress.id ? "Address updated" : "Address added");
      setIsEditing(false);
      setCurrentAddress({
        type: "Home",
        full_name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        is_default: false
      });
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Error saving address");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Error deleting address");
    }
  };

  const setAsDefault = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Unset previous default
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      // Set new default
      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Error setting default");
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
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Address Book</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Manage your delivery addresses for orders</p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => {
              setCurrentAddress({
                type: "Home",
                full_name: "",
                address_line1: "",
                address_line2: "",
                city: "",
                state: "",
                postal_code: "",
                country: "India",
                is_default: false
              });
              setIsEditing(true);
            }}
            className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-none shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Address
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white border-2 border-zinc-950 shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter italic">{currentAddress.id ? "Edit Address" : "Add New Address"}</h2>
            <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-950"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentAddress({...currentAddress, type: "Home"})}
                  className={`flex items-center gap-3 px-8 py-4 border-2 transition-all ${
                    currentAddress.type === "Home" 
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-lg" 
                      : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">Home</p>
                    <p className="text-[8px] font-bold opacity-60 uppercase">Home delivery</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentAddress({...currentAddress, type: "Work"})}
                  className={`flex items-center gap-3 px-8 py-4 border-2 transition-all ${
                    currentAddress.type === "Work" 
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-lg" 
                      : "border-zinc-100 bg-zinc-50 text-zinc-400 hover:border-zinc-300"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">Work</p>
                    <p className="text-[8px] font-bold opacity-60 uppercase">Office delivery</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
              <input 
                type="text" 
                value={currentAddress.full_name}
                onChange={(e) => setCurrentAddress({...currentAddress, full_name: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Line 1</label>
              <input 
                type="text" 
                value={currentAddress.address_line1}
                onChange={(e) => setCurrentAddress({...currentAddress, address_line1: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Line 2</label>
              <input 
                type="text" 
                value={currentAddress.address_line2}
                onChange={(e) => setCurrentAddress({...currentAddress, address_line2: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">City</label>
              <input 
                type="text" 
                value={currentAddress.city}
                onChange={(e) => setCurrentAddress({...currentAddress, city: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">State</label>
              <input 
                type="text" 
                value={currentAddress.state}
                onChange={(e) => setCurrentAddress({...currentAddress, state: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PIN Code</label>
              <input 
                type="text" 
                value={currentAddress.postal_code}
                onChange={(e) => setCurrentAddress({...currentAddress, postal_code: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Country</label>
              <input 
                type="text" 
                value={currentAddress.country}
                onChange={(e) => setCurrentAddress({...currentAddress, country: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary rounded-none" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <Button 
              onClick={handleSave}
              className="h-14 bg-zinc-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] px-12 rounded-none flex-1 md:flex-none shadow-xl"
            >
              <Save className="w-4 h-4 mr-2" /> Save Address
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="h-14 border-2 border-zinc-950 font-black uppercase tracking-widest text-[10px] px-12 rounded-none"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {addresses.map((addr) => (
          <div key={addr.id} className={`group bg-white border ${addr.is_default ? "border-primary shadow-primary/5" : "border-zinc-100"} shadow-xl p-8 relative transition-all hover:border-primary/50`}>
            {addr.is_default && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1 flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-3 h-3" /> Default Address
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center border ${addr.is_default ? "bg-primary text-white border-primary" : "bg-zinc-50 text-zinc-400 border-zinc-100"}`}>
                  {addr.type === "Work" ? <Building2 className="w-6 h-6" /> : <Home className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">{addr.type}</h3>
                  <p className="text-lg font-black tracking-tight mt-1">{addr.full_name}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
              <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-primary" /> {addr.address_line1}, {addr.city}</p>
              {addr.address_line2 && <p className="pl-5">{addr.address_line2}</p>}
              <p className="pl-5">{addr.state}, {addr.postal_code}</p>
              <p className="pl-5">{addr.country}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center gap-4">
              <button 
                onClick={() => {
                  setCurrentAddress(addr);
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(addr.id)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
              {!addr.is_default && (
                <button 
                  onClick={() => setAsDefault(addr.id)}
                  className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
        {addresses.length === 0 && !isEditing && (
          <div className="lg:col-span-2 bg-white border border-dashed border-zinc-300 p-20 text-center space-y-4">
            <MapPin className="w-12 h-12 text-zinc-200 mx-auto" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">No saved addresses found.</p>
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline" 
              className="rounded-none font-black uppercase tracking-widest text-[10px] h-10 px-6"
            >
              Add Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

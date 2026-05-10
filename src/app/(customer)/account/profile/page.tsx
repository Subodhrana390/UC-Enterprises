"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { User, Mail, Phone, Building2, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    email: "",
    phone: "",
    address: ""
  });
  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (error && error.code !== "PGRST116") throw error;
          
          if (data) {
            setProfile(data);
          } else {
            // Default if no profile exists yet
            setProfile({
              full_name: user.user_metadata?.full_name || "",
              email: user.email || "",
              phone: "",
              address: ""
            });
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [supabase]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
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
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">My Account Details</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Manage your profile, mobile number and business details</p>
        </div>
        <Button 
          onClick={handleUpdate}
          disabled={saving}
          className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] px-8 rounded-none shadow-lg"
        >
          {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-zinc-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <User className="w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Basic Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all rounded-none" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="email" 
                    value={profile.email} 
                    disabled
                    className="w-full bg-zinc-100 border border-zinc-100 px-12 py-4 text-sm font-bold opacity-70 cursor-not-allowed rounded-none" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="text" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-zinc-50 border border-zinc-100 px-12 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all rounded-none" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input 
                    type="text" 
                    value={profile.organization || profile.company_name || "Not added yet"} 
                    disabled
                    className="w-full bg-zinc-100 border border-zinc-100 px-12 py-4 text-sm font-bold opacity-70 cursor-not-allowed rounded-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-100 shadow-xl p-10 space-y-8">
            <div className="flex items-center gap-4 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-widest">Password Update</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all rounded-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Verify Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-zinc-50 border border-zinc-100 px-6 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all rounded-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-950 text-white p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Account Type</span>
                <span className="text-[10px] font-black uppercase">{profile.role === 'admin' ? 'Admin' : 'Customer'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Account Status</span>
                <span className="text-[10px] font-black uppercase text-emerald-400">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-zinc-400">Member Since</span>
                <span className="text-[10px] font-black uppercase text-zinc-400">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase() : 'APR 2024'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-8 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Helpful Note</h3>
            <p className="text-xs font-medium text-zinc-600 leading-relaxed">
              Keep your mobile number and address updated so order confirmation, invoice support, and delivery updates reach you on time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

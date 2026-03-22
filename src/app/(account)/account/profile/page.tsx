import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-8 space-y-10">
      <header>
        <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Engineering Identity</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">Manage your professional credentials and enterprise authorization levels</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="p-8 border-b border-border/10">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Personal Credentials</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Given Name</Label>
                    <Input defaultValue={profile?.first_name || ""} className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Family Name</Label>
                    <Input defaultValue={profile?.last_name || ""} className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Standardized Email Address</Label>
                <Input defaultValue={user.email} disabled className="h-14 rounded-xl bg-surface-container-low border-border/10 font-bold opacity-60 cursor-not-allowed" />
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Enterprise/Company Identity</Label>
                <Input defaultValue={profile?.company_name || "Independent Engineer"} className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
            </div>

            <Button className="h-14 px-10 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
                Update Security Manifest
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-border/40 bg-slate-900 text-white shadow-2xl p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
                <span className="material-symbols-outlined text-[120px]">verified_user</span>
            </div>
            <div className="relative z-10 space-y-8">
                <div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500 font-black uppercase tracking-tighter mb-4 inline-block">Authenticity verified</span>
                    <h3 className="text-2xl font-black font-headline uppercase leading-none">Authorization Level 2</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-400">check_circle</span>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-relaxed">Access to strategic component reserves enabled</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-blue-400">check_circle</span>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-relaxed">Volume procurement pricing active</p>
                    </div>
                    <div className="flex items-start gap-4 opacity-30">
                        <span className="material-symbols-outlined">radio_button_unchecked</span>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Custom fabrication priority pending (Level 3 Required)</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">MFA Registry</p>
                    <p className="text-[10px] opacity-60 leading-loose uppercase">YOUR ACCOUNT IS PROTECTED BY ENTERPRISE-GRADE MULTI-FACTOR AUTHENTICATION VIA DEVICE BINDING.</p>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}

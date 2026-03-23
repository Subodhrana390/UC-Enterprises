import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import Link from "next/link";

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

  // Helper to handle name splitting
  const fullName = profile?.full_name || "";
  const firstName = profile?.first_name || fullName.split(" ")[0] || "";
  const lastName = profile?.last_name || fullName.split(" ").slice(1).join(" ") || "";
  const companyName = profile?.company_name || "";

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">Account Settings</h1>
        <p className="text-sm text-gray-500">Update your personal details and manage your account security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Profile Form */}
        <Card className="lg:col-span-2 rounded-xl border-gray-100 bg-white shadow-sm">
          <CardHeader className="p-6 border-b border-gray-50">
            <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</Label>
              <Input 
                defaultValue={user.email} 
                disabled 
                className="h-11 rounded-lg bg-gray-50 border-gray-200 font-medium text-gray-500 cursor-not-allowed" 
              />
              <p className="text-[11px] text-gray-400 italic">Email cannot be changed. Contact support for assistance.</p>
            </div>
            
            <ProfileForm 
              defaultFirstName={firstName} 
              defaultLastName={lastName} 
              defaultCompanyName={companyName} 
            />
          </CardContent>
        </Card>

        {/* Right Side: Account Perks/Status */}
        <div className="space-y-6">
          <Card className="rounded-xl border-none bg-black text-white p-8 shadow-lg relative overflow-hidden">
            {/* Subtle background icon */}
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10">
              verified
            </span>

            <div className="relative z-10 space-y-6">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 font-bold uppercase tracking-wider mb-3 inline-block">
                  Verified Member
                </span>
                <h3 className="text-xl font-semibold leading-tight">Privilege Account</h3>
                <p className="text-xs text-gray-400 mt-1">Member since {new Date(user.created_at).getFullYear()}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-xl">check_circle</span>
                  <p className="text-xs font-medium text-gray-200">Exclusive bulk pricing active</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-400 text-xl">check_circle</span>
                  <p className="text-xs font-medium text-gray-200">GST billing enabled</p>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <span className="material-symbols-outlined text-xl">lock</span>
                  <p className="text-xs font-medium">Priority support (Pro only)</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Account Security</p>
                <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wide">
                  Your account is secured with Two-Factor Authentication.
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Support Link */}
          <div className="p-6 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Need help?</p>
              <p className="text-xs text-gray-500">Chat with our team</p>
            </div>
            <Link href="/support">
              <span className="material-symbols-outlined text-gray-400 hover:text-black transition-colors cursor-pointer">
                arrow_forward_ios
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
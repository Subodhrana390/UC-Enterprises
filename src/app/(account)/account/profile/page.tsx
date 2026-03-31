import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { Badge } from "@/components/ui/badge";
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

  const fullName = profile?.full_name || "";

  return (
    <div className=" min-h-screen max-w-6xl mx-auto p-4 md:p-10 space-y-8">

      {/* BREADCRUMB - Standard for Indian UX */}
      <nav className="flex items-center gap-2 text-[12px] text-gray-500">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link href="/account" className="hover:text-blue-600">My Account</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Profile Details</span>
      </nav>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1c1d]">Profile Details</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your personal information and GST details</p>
        </div>
        <Badge variant="outline" className="w-fit bg-white border-green-200 text-green-700 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          Active Account
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-2">

          {/* EDITABLE FORM */}
          <ProfileForm
            userId={user.id}
            defaultFullName={fullName}
            email={user.email}
            defaultPhone={profile?.phone_number || ""}
            defaultAvatar={profile?.avatar_url || ""}
          />

          {profile?.role === "business" && (
            /* GST & BUSINESS SECTION - High value for Indian Users */
            <Card className="rounded-xl border-[#ebebeb] bg-white shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-[#f1f1f1]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#1a1c1d]">
                    GST & Tax Information
                  </CardTitle>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    OPTIONAL
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Informational Banner */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100 mb-6">
                  <span className="material-symbols-outlined text-blue-600">
                    business_center
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Buying for work?</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Add your GSTIN to claim Input Tax Credit on your eligible purchases.
                      Ensure the Business Name matches your GST certificate.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-[#1a1c1d]">
                      GST Identification Number (GSTIN)
                    </Label>
                    <Input
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      className="uppercase h-10 border-[#d2d2d2] focus:border-[#005bd3] transition-all"
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-[#1a1c1d]">
                      Business Name
                    </Label>
                    <Input
                      placeholder="As per GST certificate"
                      className="h-10 border-[#d2d2d2] focus:border-[#005bd3] transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* SIDEBAR: LOYALTY & SECURITY */}
        <div className="space-y-6">
          <Link href="/account/settings" className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50 text-red-700 hover:bg-red-100 transition-all">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-xl">settings</span>
              <span className="text-xs font-bold uppercase tracking-wide">Settings</span>
            </div>
            <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
          </Link>
        </div>
      </div >
    </div>
  );
}
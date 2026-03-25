import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSettingsForm, ChangePasswordForm } from "@/components/admin";
import { Badge } from "@/components/ui/badge";

export default async function AdminSettingPage() {
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

    if (profile?.role !== "admin") {
        redirect("/account");
    }

    return (
        <div className="min-h-screen max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1a1c1d]">Admin Settings</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your admin profile and preferences</p>
                </div>
                <Badge variant="outline" className="w-fit bg-purple-50 border-purple-200 text-purple-700 px-3 py-1">
                    <span className="material-symbols-outlined text-sm mr-1">admin_panel_settings</span>
                    Administrator
                </Badge>
            </header>

            {/* Account Information */}
            <Card className="rounded-xl border-[#ebebed] bg-white shadow-sm">
                <CardHeader className="p-6 border-b border-[#f1f1f1]">
                    <CardTitle className="text-lg font-semibold text-[#1a1c1d]">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {/* Read-only Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="material-symbols-outlined text-lg">mail</span>
                            {user.email}
                            <Badge className="ml-auto bg-green-50 text-green-600 hover:bg-green-50 border-none text-[10px]">VERIFIED</Badge>
                        </div>
                    </div>

                    {/* Editable Form */}
                    <AdminSettingsForm
                        userId={user.id}
                        defaultFullName={profile?.full_name || ""}
                        defaultPhone={profile?.phone_number || ""}
                        defaultAvatar={profile?.avatar_url || ""}
                    />
                </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="rounded-xl border-[#ebebed] bg-white shadow-sm">
                <CardHeader className="p-6 border-b border-[#f1f1f1]">
                    <CardTitle className="text-lg font-semibold text-[#1a1c1d]">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </div>
    );
}

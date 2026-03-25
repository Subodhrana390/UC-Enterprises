import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAdminUserForm } from "@/components/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreateAdminUserPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/account");
    }

    return (
        <div className="min-h-screen max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1a1c1d]">Create Admin User</h1>
                    <p className="text-sm text-gray-600 mt-1">Add a new administrator to the system</p>
                </div>
                <Link href="/admin/users">
                    <Button variant="outline" size="sm">
                        <span className="material-symbols-outlined text-sm mr-1">arrow_back</span>
                        Back
                    </Button>
                </Link>
            </header>

            {/* Form Card */}
            <Card className="rounded-xl border-[#ebebed] bg-white shadow-sm">
                <CardHeader className="p-6 border-b border-[#f1f1f1]">
                    <CardTitle className="text-lg font-semibold text-[#1a1c1d]">Admin Account Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <CreateAdminUserForm />
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="rounded-xl border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-yellow-600">info</span>
                        <div className="text-sm text-yellow-800">
                            <p className="font-semibold mb-1">Important</p>
                            <p>The new admin will have full access to the admin panel. Make sure to share the login credentials securely.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

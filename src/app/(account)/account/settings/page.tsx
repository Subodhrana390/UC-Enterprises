import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { PasswordForm, DeactivationButton } from "@/components/account/SettingsForms";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1c1d]">Settings</h1>
        </header>

        {/* 1. Account Details Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold text-[#1a1c1d]">Security</h2>
            <p className="text-sm text-[#616161] mt-1">Manage your password and account access.</p>
          </div>
          <Card className="md:col-span-2 shadow-sm border-[#ebebeb] rounded-xl bg-white">
            <CardContent className="p-6">
              <PasswordForm />
            </CardContent>
          </Card>
        </section>

        <hr className="border-[#d2d2d2]" />

        {/* 2. Notification Governance */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold text-[#1a1c1d]">Notifications</h2>
            <p className="text-sm text-[#616161] mt-1">Control how you receive updates about orders and stock.</p>
          </div>
          <Card className="md:col-span-2 shadow-sm border-[#ebebeb] rounded-xl bg-white">
            <CardContent className="p-0">
              {[
                { label: "Order updates", desc: "Real-time tracking notifications", icon: "local_shipping" },
                { label: "Price alerts", desc: "Notify when prices change", icon: "trending_down" },
                { label: "Newsletter", desc: "Weekly engineering insights", icon: "mail" },
              ].map((item, idx, arr) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${idx !== arr.length - 1 ? 'border-b border-[#f1f1f1]' : ''}`}
                >
                  <div>
                    <p className="text-sm font-medium text-[#1a1c1d]">{item.label}</p>
                    <p className="text-sm text-[#616161]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-[#e3e3e3] rounded-full peer peer-checked:bg-[#008060] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <hr className="border-[#d2d2d2]" />

        {/* 3. Regional Settings */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold text-[#1a1c1d]">Regional preferences</h2>
            <p className="text-sm text-[#616161] mt-1">Set your preferred language and currency.</p>
          </div>
          <Card className="md:col-span-2 shadow-sm border-[#ebebeb] rounded-xl bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#616161]">Currency</Label>
                  <select className="w-full h-10 rounded-lg border-[#d2d2d2] bg-white px-3 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none">
                    <option>INR - Indian Rupee</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#616161]">Language</Label>
                  <select className="w-full h-10 rounded-lg border-[#d2d2d2] bg-white px-3 text-sm focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none">
                    <option>English (India)</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* <hr className="border-[#d2d2d2]" /> */}

        {/* 4. Danger Zone (The Shopify 'Archive' Look) */}
        {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold text-[#d72c0d]">Danger zone</h2>
            <p className="text-sm text-[#616161] mt-1">Permanently remove your data from UC Enterprises.</p>
          </div>
          <Card className="md:col-span-2 shadow-sm border-[#f9d3d3] rounded-xl bg-white">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="max-w-[70%]">
                  <p className="text-sm font-medium text-[#1a1c1d]">Deactivate account</p>
                  <p className="text-sm text-[#616161]">Temporarily disable access. Active orders will be fulfilled.</p>
                </div>
                <DeactivationButton />
              </div>
              <div className="pt-6 border-t border-[#f1f1f1] flex items-start justify-between">
                <div className="max-w-[70%]">
                  <p className="text-sm font-medium text-[#1a1c1d]">Delete account</p>
                  <p className="text-sm text-[#616161]">Permanently remove all data and order history. This cannot be undone.</p>
                </div>
                <Button variant="outline" className="text-[#d72c0d] border-[#d2d2d2] hover:bg-red-50 hover:text-[#d72c0d]">
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </section> */}
      </div>
    </div>
  );
}
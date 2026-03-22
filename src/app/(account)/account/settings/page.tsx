import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-8 space-y-10">
      <header>
        <h1 className="text-4xl font-black font-headline tracking-tighter uppercase mb-2">Account Settings</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant opacity-40">System preferences, notification governance, and security protocols</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Notification Preferences */}
        <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="p-8 border-b border-border/10">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">notifications</span>
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {[
              { label: "Order Status Updates", desc: "Receive real-time tracking notifications", icon: "local_shipping" },
              { label: "Price Alerts", desc: "Get notified when watched components change price", icon: "trending_down" },
              { label: "Stock Alerts", desc: "Alert when low-stock components are replenished", icon: "inventory" },
              { label: "Newsletter", desc: "Weekly engineering insights and product launches", icon: "mail" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-surface border border-border/10">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-black text-xs uppercase tracking-widest">{item.label}</p>
                    <p className="text-[10px] text-on-surface-variant opacity-60">{item.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="p-8 border-b border-border/10">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">security</span>
              Security Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Current Password</Label>
              <Input type="password" placeholder="••••••••" className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">New Password</Label>
              <Input type="password" placeholder="Minimum 8 characters" className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Confirm New Password</Label>
              <Input type="password" placeholder="Re-enter new password" className="h-14 rounded-xl bg-surface border-border/10 font-bold" />
            </div>
            <Button className="h-14 px-10 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
              Update Security Credentials
            </Button>
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card className="rounded-[32px] border-border/40 bg-white/50 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <CardHeader className="p-8 border-b border-border/10">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">palette</span>
              Display Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Currency</Label>
              <select className="w-full h-14 rounded-xl bg-surface border border-border/10 px-5 font-bold text-sm">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>INR - Indian Rupee</option>
                <option>GBP - British Pound</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">Language</Label>
              <select className="w-full h-14 rounded-xl bg-surface border border-border/10 px-5 font-bold text-sm">
                <option>English (US)</option>
                <option>Hindi</option>
                <option>German</option>
                <option>Japanese</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-[32px] border-rose-200/40 bg-rose-50/30 backdrop-blur-xl shadow-2xl shadow-rose-500/5">
          <CardHeader className="p-8 border-b border-rose-200/20">
            <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-rose-700">
              <span className="material-symbols-outlined text-rose-500">warning</span>
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="p-6 rounded-2xl border border-rose-200/40 bg-white/50">
              <h4 className="font-black text-sm uppercase tracking-tight text-rose-800 mb-2">Deactivate Account</h4>
              <p className="text-[10px] text-rose-600 opacity-70 mb-4 leading-relaxed">This will disable your access to all UCEnterprises services. Active orders will still be fulfilled.</p>
              <Button variant="outline" className="h-10 rounded-lg border-rose-300 text-rose-600 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50">
                Request Deactivation
              </Button>
            </div>
            <div className="p-6 rounded-2xl border border-rose-300/40 bg-white/50">
              <h4 className="font-black text-sm uppercase tracking-tight text-rose-800 mb-2">Delete Account Permanently</h4>
              <p className="text-[10px] text-rose-600 opacity-70 mb-4 leading-relaxed">This action is irreversible. All data, order history, and account settings will be permanently removed.</p>
              <Button className="h-10 rounded-lg bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700">
                Permanently Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

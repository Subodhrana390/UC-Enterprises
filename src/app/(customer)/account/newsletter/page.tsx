"use client";

import { useEffect, useState } from "react";
import { Mail, Bell, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function NewsletterPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topics, setTopics] = useState([
    { id: "inv", title: "Back in Stock Alerts", desc: "GET NOTIFIED WHEN OUT-OF-STOCK PRODUCTS ARE AVAILABLE AGAIN.", active: true },
    { id: "tech", title: "New Product Updates", desc: "KNOW ABOUT NEW ARRIVALS IN WELDING, ELECTRONICS, LAB CHEMICALS AND GENERAL SUPPLIES.", active: true },
    { id: "prom", title: "Offers and Bulk Deals", desc: "RECEIVE SPECIAL PRICES, FESTIVE OFFERS AND BULK ORDER UPDATES.", active: false },
    { id: "patch", title: "Order and Service Updates", desc: "GET IMPORTANT EMAILS RELATED TO SUPPORT, DOCUMENTS AND ORDER COMMUNICATION.", active: true },
  ]);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("phone, newsletter_settings")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          setPhone(profile.phone || "");
          if (profile.newsletter_settings) {
            const settings = profile.newsletter_settings as Record<string, boolean>;
            setTopics(prev => prev.map(topic => ({
              ...topic,
              active: settings[topic.id] ?? topic.active
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [supabase]);

  const toggleTopic = (id: string) => {
    setTopics(prev => prev.map(topic => 
      topic.id === id ? { ...topic, active: !topic.active } : topic
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const settings = topics.reduce((acc, topic) => ({
        ...acc,
        [topic.id]: topic.active
      }), {});

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          newsletter_settings: settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success("Email preferences updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b-2 border-zinc-950 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Email Updates</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Choose which product, stock and offer emails you want to receive</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white border border-zinc-100 shadow-xl p-10 space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center text-white shrink-0">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">Store Email Preferences</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Receive updates about stock, offers, order support and useful product information.</p>
            </div>
          </div>

          <div className="space-y-6">
            {topics.map((topic) => (
              <div 
                key={topic.id} 
                onClick={() => toggleTopic(topic.id)}
                className={`flex items-start justify-between p-6 border transition-all cursor-pointer ${
                  topic.active 
                    ? "bg-zinc-50 border-emerald-100" 
                    : "bg-white border-zinc-100 hover:border-zinc-200"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {topic.active ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-zinc-300" />}
                    <h4 className="text-xs font-black uppercase tracking-widest">{topic.title}</h4>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest max-w-md">{topic.desc}</p>
                </div>
                <div className={`relative inline-flex h-6 w-12 items-center rounded-none border-2 transition-colors ${
                  topic.active ? "bg-primary border-primary" : "bg-zinc-200 border-zinc-200"
                }`}>
                  <span className={`inline-block h-4 w-4 transform transition-transform ${topic.active ? "translate-x-6 bg-white" : "translate-x-1 bg-white shadow-sm"}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[9px] font-black text-zinc-300 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Your email preferences are securely stored
            </div>
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="h-12 bg-zinc-950 hover:bg-primary text-white font-black uppercase tracking-widest text-[10px] px-10 rounded-none shadow-lg"
            >
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>

        <div className="bg-primary text-white p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Bell className="w-64 h-64" />
          </div>
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-black tracking-tighter uppercase italic">SMS Alerts</h3>
            <p className="text-xs font-black uppercase tracking-widest opacity-80">
              {phone ? `Active on ${phone}` : "Use mobile alerts for urgent order or delivery related communication."}
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = "/account/profile"}
            className="relative z-10 h-14 bg-white text-primary hover:bg-zinc-100 font-black uppercase tracking-widest text-xs px-12 rounded-none shadow-2xl"
          >
            {phone ? "Change Number" : "Add Mobile Number"}
          </Button>
        </div>
      </div>
    </div>
  );
}

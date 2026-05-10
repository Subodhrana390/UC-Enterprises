"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { User, Phone, Mail, Building, Hash, MessageSquare, MapPin, Send } from "lucide-react";

type Props = {
  product?: {
    id?: string;
    name?: string;
  };
};

export default function QuoteRequestForm({ product }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    company_name: "",
    city: "",
    quantity: "1",
    message: product?.name ? `Need best price for ${product.name}` : "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function prefill() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, company_name, phone, city")
        .eq("id", user.id)
        .maybeSingle();

      setForm((prev) => ({
        ...prev,
        customer_name: profile?.full_name || user.user_metadata?.full_name || prev.customer_name,
        email: user.email || prev.email,
        phone: profile?.phone || user.user_metadata?.phone_number || prev.phone,
        company_name: profile?.company_name || user.user_metadata?.company_name || prev.company_name,
        city: profile?.city || "",
      }));
    }

    prefill();
  }, [supabase]);

  async function submitQuote() {
    if (!form.customer_name || !form.phone || !form.message) {
      toast.error("Please fill name, phone and requirement");
      return;
    }

    setSubmitting(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("quote_requests").insert([
      {
        product_id: product?.id || null,
        user_id: user?.id || null,
        product_name: product?.name || null,
        customer_name: form.customer_name,
        email: form.email || null,
        phone: form.phone,
        company_name: form.company_name || null,
        quantity: Number(form.quantity) || 1,
        message: `${form.message}\n\nCity: ${form.city}`,
        status: "New",
      },
    ]);

    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Unable to send quote request");
      return;
    }

    toast.success("Quote request sent successfully");
    setForm((prev) => ({ ...prev, quantity: "1", message: product?.name ? `Need best price for ${product.name}` : "" }));
  }

  return (
    <div className="border-4 border-orange-100 bg-white p-8 rounded-3xl shadow-2xl shadow-orange-100/50">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white rotate-3">
          <Send className="h-6 w-6 -rotate-12" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">Bulk Enquiry / Get Quote</h2>
          <p className="text-sm text-zinc-500 font-medium">Connect with our sales team for best prices.</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Your name *" 
            className="pl-11 h-14 bg-zinc-50 border-zinc-100 rounded-xl focus:border-primary transition-all" 
            value={form.customer_name} 
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })} 
          />
        </div>
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Mobile number *" 
            className="pl-11 h-14 bg-zinc-50 border-zinc-100 rounded-xl focus:border-primary transition-all" 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
          />
        </div>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Email address" 
            className="pl-11 h-14 bg-zinc-50 border-zinc-100 rounded-xl focus:border-primary transition-all" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
        </div>
        <div className="relative group">
          <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Company name" 
            className="pl-11 h-14 bg-zinc-50 border-zinc-100 rounded-xl focus:border-primary transition-all" 
            value={form.company_name} 
            onChange={(e) => setForm({ ...form, company_name: e.target.value })} 
          />
        </div>
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Delivery city" 
            className="pl-11 h-14 bg-zinc-50 border-zinc-100 rounded-xl focus:border-primary transition-all" 
            value={form.city} 
            onChange={(e) => setForm({ ...form, city: e.target.value })} 
          />
        </div>
        <div className="relative group">
          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Required quantity" 
            className="pl-11 h-14 bg-zinc-50 border-zinc-100 rounded-xl focus:border-primary transition-all" 
            value={form.quantity} 
            onChange={(e) => setForm({ ...form, quantity: e.target.value })} 
          />
        </div>
      </div>

      <div className="mt-5 relative group">
        <MessageSquare className="absolute left-4 top-6 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
        <Textarea 
          rows={4} 
          placeholder="Write your requirement, delivery city, GST need, brand preference, etc." 
          className="pl-11 pt-5 bg-zinc-50 border-zinc-100 rounded-2xl focus:border-primary transition-all min-h-[120px]" 
          value={form.message} 
          onChange={(e) => setForm({ ...form, message: e.target.value })} 
        />
      </div>

      <Button 
        className="mt-8 w-full h-16 bg-zinc-950 hover:bg-primary text-lg font-black rounded-2xl transition-all shadow-xl shadow-zinc-900/10 hover:shadow-primary/20 active:scale-[0.98]" 
        onClick={submitQuote} 
        disabled={submitting}
      >
        {submitting ? "SUBMITTING..." : "SEND ENQUIRY NOW"}
      </Button>

      <p className="mt-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        Reliable Industrial Sourcing &bull; Expert Consultation &bull; Best Market Price
      </p>
    </div>
  );
}

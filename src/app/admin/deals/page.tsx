"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, BadgePercent, X, Save, Loader2, Eye, EyeOff, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function getDealStatus(deal: any): { label: string; color: string } {
  if (!deal.is_active) return { label: "Inactive", color: "bg-zinc-100 text-zinc-500" };
  const now = new Date();
  if (deal.start_date && new Date(deal.start_date) > now) return { label: "Upcoming", color: "bg-blue-50 text-blue-600 border-blue-100" };
  if (deal.end_date && new Date(deal.end_date) < now) return { label: "Expired", color: "bg-red-50 text-red-600 border-red-100" };
  return { label: "Live", color: "bg-emerald-50 text-emerald-600 border-emerald-100" };
}

export default function DealsAdminPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", description: "", badge_text: "", image_url: "", link_url: "", discount_percentage: "", start_date: "", end_date: "", position: 0, is_active: true });
  const supabase = createClient();

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase.from("deals").select("*").order("position", { ascending: true });
      if (error) throw error;
      setDeals(data || []);
    } catch (error) { console.error("Error fetching deals:", error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDeals(); }, [supabase]);

  const handleOpenDrawer = (deal?: any) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({ title: deal.title, description: deal.description || "", badge_text: deal.badge_text || "", image_url: deal.image_url || "", link_url: deal.link_url || "", discount_percentage: deal.discount_percentage?.toString() || "", start_date: deal.start_date ? new Date(deal.start_date).toISOString().slice(0, 16) : "", end_date: deal.end_date ? new Date(deal.end_date).toISOString().slice(0, 16) : "", position: deal.position, is_active: deal.is_active });
    } else {
      setEditingDeal(null);
      setFormData({ title: "", description: "", badge_text: "", image_url: "", link_url: "", discount_percentage: "", start_date: "", end_date: "", position: deals.length, is_active: true });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) { toast.error("Deal title is required"); return; }
    setSaving(true);
    try {
      const payload = { title: formData.title, description: formData.description || null, badge_text: formData.badge_text || null, image_url: formData.image_url || null, link_url: formData.link_url || null, discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null, start_date: formData.start_date || null, end_date: formData.end_date || null, position: formData.position, is_active: formData.is_active };
      if (editingDeal) {
        const { error } = await supabase.from("deals").update(payload).eq("id", editingDeal.id);
        if (error) throw error;
        toast.success("Deal updated successfully");
      } else {
        const { error } = await supabase.from("deals").insert([payload]);
        if (error) throw error;
        toast.success("Deal created successfully");
      }
      setIsDrawerOpen(false);
      fetchDeals();
    } catch (error: any) { toast.error(error.message || "Something went wrong"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
      const { error } = await supabase.from("deals").delete().eq("id", id);
      if (error) throw error;
      setDeals(deals.filter((d) => d.id !== id));
      toast.success("Deal deleted");
    } catch (error: any) { toast.error(error.message || "Failed to delete"); }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from("deals").update({ is_active: !current }).eq("id", id);
      if (error) throw error;
      setDeals(deals.map((d) => (d.id === id ? { ...d, is_active: !current } : d)));
      toast.success(current ? "Deal deactivated" : "Deal activated");
    } catch (error: any) { toast.error(error.message || "Failed to toggle"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals Management</h1>
          <p className="text-muted-foreground">Manage promotional deals and offers for your storefront.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => handleOpenDrawer()}><Plus className="w-4 h-4" />Add Deal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm h-fit bg-white/50 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-lg">Quick Insight</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-xl"><BadgePercent className="w-4 h-4 text-primary" /></div><span className="text-sm font-bold text-zinc-600">Total</span></div>
              <span className="font-black text-xl">{deals.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 rounded-xl"><Eye className="w-4 h-4 text-emerald-600" /></div><span className="text-sm font-bold text-zinc-600">Live</span></div>
              <span className="font-black text-xl text-emerald-600">{deals.filter((d) => getDealStatus(d).label === "Live").length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3"><div className="p-2 bg-red-50 rounded-xl"><Calendar className="w-4 h-4 text-red-600" /></div><span className="text-sm font-bold text-zinc-600">Expired</span></div>
              <span className="font-black text-xl text-red-600">{deals.filter((d) => getDealStatus(d).label === "Expired").length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-3"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search deals..." className="pl-12 bg-zinc-50 border-none h-12 rounded-2xl" /></div></CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-zinc-50/50">
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Title</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Badge</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Discount</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Date Range</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="h-14 px-6 text-right font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-zinc-100">
                  {deals.map((deal) => { const status = getDealStatus(deal); return (
                    <tr key={deal.id} className="group transition-colors hover:bg-zinc-50/50">
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center">
                            {deal.image_url ? <img src={deal.image_url} alt="" className="w-full h-full object-cover" /> : <BadgePercent className="w-5 h-5 text-primary" />}
                          </div>
                          <div><p className="font-bold text-zinc-900">{deal.title}</p>{deal.description && <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 max-w-[200px]">{deal.description}</p>}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">{deal.badge_text ? <Badge className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border-orange-100">{deal.badge_text}</Badge> : <span className="text-xs text-zinc-300">—</span>}</td>
                      <td className="px-6 py-4 align-middle">{deal.discount_percentage ? <span className="font-black text-lg text-primary">{deal.discount_percentage}%</span> : <span className="text-xs text-zinc-300">—</span>}</td>
                      <td className="px-6 py-4 align-middle"><div className="text-xs text-zinc-500">{deal.start_date ? new Date(deal.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"} → {deal.end_date ? new Date(deal.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</div></td>
                      <td className="px-6 py-4 align-middle"><Badge className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest", status.color)}>{status.label}</Badge></td>
                      <td className="px-6 py-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100"><MoreHorizontal className="w-4 h-4 text-zinc-400" /></Button>} />
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl shadow-xl border-zinc-100">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Manage</DropdownMenuLabel>
                              <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer" onClick={() => handleOpenDrawer(deal)}><Edit className="w-4 h-4" /> Edit Deal</DropdownMenuItem>
                              <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer" onClick={() => handleToggleActive(deal.id, deal.is_active)}>{deal.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{deal.is_active ? "Deactivate" : "Activate"}</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(deal.id)}><Trash2 className="w-4 h-4" /> Delete Deal</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ); })}
                </tbody>
              </table>
              {deals.length === 0 && <div className="p-20 text-center text-zinc-400 space-y-3"><BadgePercent className="w-12 h-12 mx-auto opacity-20" /><p className="font-bold">No deals yet.</p><p className="text-xs">Create your first promotional deal.</p></div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRUD Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (<>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col">
            <div className="p-8 border-b flex items-center justify-between">
              <div><h2 className="text-2xl font-black tracking-tight">{editingDeal ? "Edit Deal" : "New Deal"}</h2><p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Deal Details</p></div>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="rounded-2xl"><X className="w-5 h-5" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 space-y-5 overflow-y-auto">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deal Title *</label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Summer Welding Sale" className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 font-bold" required /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the deal..." className="min-h-[80px] rounded-2xl bg-zinc-50 border-zinc-100 resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Badge Text</label><Input value={formData.badge_text} onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })} placeholder="HOT DEAL" className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Discount %</label><Input type="number" value={formData.discount_percentage} onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })} placeholder="20" className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" /></div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deal Image</label>
                <div className="w-full h-32 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 overflow-hidden flex items-center justify-center">
                  {formData.image_url ? <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-zinc-300" />}
                </div>
                <Input type="file" accept="image/*" className="h-10 rounded-xl bg-zinc-50 border-zinc-100" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  setSaving(true);
                  try { const fileName = `${Date.now()}-${file.name}`; const { error } = await supabase.storage.from("deals").upload(fileName, file); if (error) throw error; const { data: { publicUrl } } = supabase.storage.from("deals").getPublicUrl(fileName); setFormData((prev) => ({ ...prev, image_url: publicUrl })); toast.success("Image uploaded!"); } catch (err: any) { toast.error(err.message || "Upload failed"); } finally { setSaving(false); }
                }} />
                <div className="flex gap-2"><Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste image URL..." className="h-10 rounded-xl bg-zinc-50 border-zinc-100 text-xs" />{formData.image_url && <Button type="button" variant="ghost" size="icon" className="rounded-xl text-red-500 hover:bg-red-50" onClick={() => setFormData({ ...formData, image_url: "" })}><Trash2 className="w-4 h-4" /></Button>}</div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Link URL</label><Input value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })} placeholder="/products?deal=summer" className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Start Date</label><Input type="datetime-local" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 text-sm" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">End Date</label><Input type="datetime-local" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Position</label><Input type="number" value={formData.position} onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })} className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</label>
                  <div className="flex gap-2">{[true, false].map((val) => (<button key={String(val)} type="button" onClick={() => setFormData({ ...formData, is_active: val })} className={cn("flex-1 h-12 rounded-2xl font-bold text-sm transition-all border", formData.is_active === val ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-zinc-50 text-zinc-500 border-zinc-100")}>{val ? "Active" : "Inactive"}</button>))}</div>
                </div>
              </div>
              <div className="mt-auto pt-6"><Button className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20" disabled={saving}>{saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}{editingDeal ? "Update Deal" : "Save Deal"}</Button></div>
            </form>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}

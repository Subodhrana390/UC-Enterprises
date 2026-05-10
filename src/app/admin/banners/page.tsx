"use client";

import { useEffect, useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Image as ImageIcon, X, Save, Loader2, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink } from "lucide-react";
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

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", subtitle: "", image_url: "", link_url: "", link_text: "", position: 0, is_active: true });
  const supabase = createClient();

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.from("banners").select("*").order("position", { ascending: true });
      if (error) throw error;
      setBanners(data || []);
    } catch (error) { console.error("Error fetching banners:", error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, [supabase]);

  const handleOpenDrawer = (banner?: any) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({ title: banner.title, subtitle: banner.subtitle || "", image_url: banner.image_url || "", link_url: banner.link_url || "", link_text: banner.link_text || "", position: banner.position, is_active: banner.is_active });
    } else {
      setEditingBanner(null);
      setFormData({ title: "", subtitle: "", image_url: "", link_url: "", link_text: "", position: banners.length, is_active: true });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) { toast.error("Banner title is required"); return; }
    setSaving(true);
    try {
      if (editingBanner) {
        const { error } = await supabase.from("banners").update(formData).eq("id", editingBanner.id);
        if (error) throw error;
        toast.success("Banner updated successfully");
      } else {
        const { error } = await supabase.from("banners").insert([formData]);
        if (error) throw error;
        toast.success("Banner created successfully");
      }
      setIsDrawerOpen(false);
      fetchBanners();
    } catch (error: any) { toast.error(error.message || "Something went wrong"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
      setBanners(banners.filter((b) => b.id !== id));
      toast.success("Banner deleted");
    } catch (error: any) { toast.error(error.message || "Failed to delete"); }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from("banners").update({ is_active: !current }).eq("id", id);
      if (error) throw error;
      setBanners(banners.map((b) => (b.id === id ? { ...b, is_active: !current } : b)));
      toast.success(current ? "Banner deactivated" : "Banner activated");
    } catch (error: any) { toast.error(error.message || "Failed to toggle status"); }
  };

  const handleMovePosition = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === banners.length - 1)) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    try {
      await Promise.all([
        supabase.from("banners").update({ position: banners[swapIdx].position }).eq("id", banners[idx].id),
        supabase.from("banners").update({ position: banners[idx].position }).eq("id", banners[swapIdx].id),
      ]);
      fetchBanners();
    } catch { toast.error("Failed to reorder"); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Management</h1>
          <p className="text-muted-foreground">Manage homepage hero banners and promotional slides.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => handleOpenDrawer()}><Plus className="w-4 h-4" />Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm h-fit bg-white/50 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-lg">Quick Insight</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-xl"><ImageIcon className="w-4 h-4 text-primary" /></div><span className="text-sm font-bold text-zinc-600">Total</span></div>
              <span className="font-black text-xl">{banners.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 rounded-xl"><Eye className="w-4 h-4 text-emerald-600" /></div><span className="text-sm font-bold text-zinc-600">Active</span></div>
              <span className="font-black text-xl text-emerald-600">{banners.filter((b) => b.is_active).length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search banners..." className="pl-12 bg-zinc-50 border-none h-12 rounded-2xl" /></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-zinc-50/50">
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Order</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Preview</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Title</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Link</th>
                  <th className="h-14 px-6 text-left font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="h-14 px-6 text-right font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-zinc-100">
                  {banners.map((banner, index) => (
                    <tr key={banner.id} className="group transition-colors hover:bg-zinc-50/50">
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col gap-1 items-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => handleMovePosition(banner.id, "up")} disabled={index === 0}><ArrowUp className="w-3 h-3" /></Button>
                          <span className="text-xs font-black text-zinc-400">{banner.position}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg" onClick={() => handleMovePosition(banner.id, "down")} disabled={index === banners.length - 1}><ArrowDown className="w-3 h-3" /></Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="w-24 h-14 rounded-xl bg-zinc-100 border overflow-hidden flex items-center justify-center">
                          {banner.image_url ? <img src={banner.image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-zinc-300" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle"><p className="font-bold text-zinc-900">{banner.title}</p>{banner.subtitle && <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{banner.subtitle}</p>}</td>
                      <td className="px-6 py-4 align-middle">{banner.link_url ? <div className="flex items-center gap-1 text-xs text-blue-600"><ExternalLink className="w-3 h-3" /><span className="font-mono truncate max-w-[120px]">{banner.link_url}</span></div> : <span className="text-xs text-zinc-300">—</span>}</td>
                      <td className="px-6 py-4 align-middle"><Badge className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest cursor-pointer", banner.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-100 text-zinc-500")} onClick={() => handleToggleActive(banner.id, banner.is_active)}>{banner.is_active ? "Active" : "Hidden"}</Badge></td>
                      <td className="px-6 py-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100"><MoreHorizontal className="w-4 h-4 text-zinc-400" /></Button>} />
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl shadow-xl border-zinc-100">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Manage</DropdownMenuLabel>
                              <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer" onClick={() => handleOpenDrawer(banner)}><Edit className="w-4 h-4" /> Edit Banner</DropdownMenuItem>
                              <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer" onClick={() => handleToggleActive(banner.id, banner.is_active)}>{banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{banner.is_active ? "Hide" : "Show"}</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" onClick={() => handleDelete(banner.id)}><Trash2 className="w-4 h-4" /> Delete Banner</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {banners.length === 0 && <div className="p-20 text-center text-zinc-400 space-y-3"><ImageIcon className="w-12 h-12 mx-auto opacity-20" /><p className="font-bold">No banners yet.</p><p className="text-xs">Create your first banner to display on the homepage.</p></div>}
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
              <div><h2 className="text-2xl font-black tracking-tight">{editingBanner ? "Edit Banner" : "New Banner"}</h2><p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Banner Details</p></div>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="rounded-2xl"><X className="w-5 h-5" /></Button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Banner Title *</label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter banner headline..." className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 font-bold" required /></div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Subtitle / Description</label><Textarea value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Short supporting text..." className="min-h-[80px] rounded-2xl bg-zinc-50 border-zinc-100 resize-none" /></div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Banner Image</label>
                <div className="w-full h-36 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 overflow-hidden flex items-center justify-center">
                  {formData.image_url ? <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" /> : <div className="text-center space-y-2"><ImageIcon className="w-8 h-8 text-zinc-300 mx-auto" /><p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">1200×400px recommended</p></div>}
                </div>
                <Input type="file" accept="image/*" className="h-10 rounded-xl bg-zinc-50 border-zinc-100" onChange={async (e) => {
                  const file = e.target.files?.[0]; if (!file) return;
                  setSaving(true);
                  try { const fileName = `${Date.now()}-${file.name}`; const { error } = await supabase.storage.from("banners").upload(fileName, file); if (error) throw error; const { data: { publicUrl } } = supabase.storage.from("banners").getPublicUrl(fileName); setFormData((prev) => ({ ...prev, image_url: publicUrl })); toast.success("Image uploaded!"); } catch (err: any) { toast.error(err.message || "Upload failed"); } finally { setSaving(false); }
                }} />
                <div className="flex gap-2"><Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="Or paste image URL..." className="h-10 rounded-xl bg-zinc-50 border-zinc-100 text-xs" />{formData.image_url && <Button type="button" variant="ghost" size="icon" className="rounded-xl text-red-500 hover:bg-red-50" onClick={() => setFormData({ ...formData, image_url: "" })}><Trash2 className="w-4 h-4" /></Button>}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Link URL</label><Input value={formData.link_url} onChange={(e) => setFormData({ ...formData, link_url: e.target.value })} placeholder="/products" className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 text-sm" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Button Text</label><Input value={formData.link_text} onChange={(e) => setFormData({ ...formData, link_text: e.target.value })} placeholder="Shop Now" className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Position</label><Input type="number" value={formData.position} onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })} className="h-12 rounded-2xl bg-zinc-50 border-zinc-100" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</label>
                  <div className="flex gap-2">{[true, false].map((val) => (<button key={String(val)} type="button" onClick={() => setFormData({ ...formData, is_active: val })} className={cn("flex-1 h-12 rounded-2xl font-bold text-sm transition-all border", formData.is_active === val ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-zinc-50 text-zinc-500 border-zinc-100")}>{val ? "Active" : "Hidden"}</button>))}</div>
                </div>
              </div>
              <div className="mt-auto pt-8"><Button className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20" disabled={saving}>{saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}{editingBanner ? "Update Banner" : "Save Banner"}</Button></div>
            </form>
          </motion.div>
        </>)}
      </AnimatePresence>
    </div>
  );
}

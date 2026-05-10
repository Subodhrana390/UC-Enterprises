"use client";

import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FolderTree,
  ChevronRight,
  X,
  Save,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Active",
    image_url: "",
  });

  const supabase = createClient();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [supabase]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleOpenDrawer = (category?: any) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        status: category.status || "Active",
        image_url: category.image_url || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        status: "Active",
        image_url: "",
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", editingCategory.id);
        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([formData]);
        if (error) throw error;
        toast.success("Category created successfully");
      }
      setIsDrawerOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Products in this category will become uncategorized.")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shreni Prabandhan (Categories)</h1>
          <p className="text-muted-foreground">Manage your product hierarchy and taxonomy.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20" onClick={() => handleOpenDrawer()}>
          <Plus className="w-4 h-4" />
          Nayi Shreni (Add)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm h-fit bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Insight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FolderTree className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-zinc-600">Total</span>
              </div>
              <span className="font-black text-xl">{categories.length}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-zinc-600">Active</span>
              </div>
              <span className="font-black text-xl text-emerald-600">
                {categories.filter(c => c.status === "Active").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search categories..." className="pl-12 bg-zinc-50 border-none h-12 rounded-2xl" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50/50">
                    <th className="h-14 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Name</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Slug</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                    <th className="h-14 px-6 text-right align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {categories.map((category) => (
                    <tr key={category.id} className="group transition-colors hover:bg-zinc-50/50">
                      <td className="px-6 py-4 align-middle font-bold text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center">
                            {category.image_url ? (
                              <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FolderTree className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle text-zinc-400 font-mono text-xs">{category.slug}</td>
                      <td className="px-6 py-4 align-middle">
                        <Badge className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                          category.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-100 text-zinc-600"
                        )}>
                          {category.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100">
                              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl shadow-xl border-zinc-100">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">Manage</DropdownMenuLabel>
                              <DropdownMenuItem className="gap-3 p-3 rounded-xl font-bold text-sm cursor-pointer" onClick={() => handleOpenDrawer(category)}>
                                <Edit className="w-4 h-4" /> Edit Details
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="my-1" />
                            <DropdownMenuItem 
                              className="gap-3 p-3 rounded-xl font-bold text-sm text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="w-4 h-4" /> Remove Shreni
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
                <div className="p-20 text-center text-zinc-400 space-y-3">
                   <FolderTree className="w-12 h-12 mx-auto opacity-20" />
                   <p className="font-bold">No categories found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRUD Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{editingCategory ? "Edit Shreni" : "Nayi Shreni"}</h2>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Category Details</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)} className="rounded-2xl">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Shreni Ka Naam (Name)</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter category name..."
                    className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Slug (Auto-generated)</label>
                  <Input 
                    value={formData.slug}
                    readOnly
                    className="h-12 rounded-2xl bg-zinc-100 border-transparent text-zinc-400 font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description..."
                    className="min-h-[120px] rounded-2xl bg-zinc-50 border-zinc-100 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</label>
                  <div className="flex gap-4">
                    {["Active", "Draft"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, status: s})}
                        className={cn(
                          "flex-1 h-12 rounded-2xl font-bold text-sm transition-all border",
                          formData.status === s 
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                            : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:border-zinc-200"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Category Icon / Image</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 overflow-hidden flex items-center justify-center">
                        {formData.image_url ? (
                          <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-zinc-300" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="h-10 rounded-xl bg-zinc-50 border-zinc-100"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            setSaving(true);
                            try {
                              const fileName = `${Date.now()}-${file.name}`;
                              const { data, error } = await supabase.storage
                                .from('category-icons')
                                .upload(fileName, file);
                              
                              if (error) throw error;
                              
                              const { data: { publicUrl } } = supabase.storage
                                .from('category-icons')
                                .getPublicUrl(fileName);
                                
                              setFormData(prev => ({ ...prev, image_url: publicUrl }));
                              toast.success("Icon uploaded successfully!");
                            } catch (err: any) {
                              toast.error(err.message || "Upload failed");
                            } finally {
                              setSaving(false);
                            }
                          }}
                        />
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Recommended: 128x128px PNG or SVG</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        value={formData.image_url}
                        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                        placeholder="Or paste icon URL here..."
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-100 text-xs"
                      />
                      {formData.image_url && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl text-red-500 hover:bg-red-50"
                          onClick={() => setFormData({...formData, image_url: ""})}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <Button 
                    className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl shadow-primary/20"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editingCategory ? "Update Shreni" : "Jodein (Save Category)"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

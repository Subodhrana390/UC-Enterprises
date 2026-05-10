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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [drawerMode, setDrawerMode] = useState<'main' | 'sub'>('main');
  const [activeTab, setActiveTab] = useState<'main' | 'sub' | 'all'>('main');
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: "Active",
    image_url: "",
    parent_id: null as string | null,
    tax_rate: 0,
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

  const handleOpenDrawer = (mode: 'main' | 'sub', category?: any) => {
    setDrawerMode(mode);
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        status: category.status || "Active",
        image_url: category.image_url || "",
        parent_id: category.parent_id || null,
        tax_rate: category.tax_rate || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        status: "Active",
        image_url: "",
        parent_id: null,
        tax_rate: 0,
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
    if (drawerMode === 'sub' && (!formData.parent_id || formData.parent_id === "none")) {
      toast.error("Please select a parent category for the subcategory");
      return;
    }

    const payload = { ...formData };
    if (drawerMode === 'main') {
      payload.parent_id = null;
    }

    setSaving(true);
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
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
          <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
          <p className="text-muted-foreground">Manage your product hierarchy and taxonomy with tax rates.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-2xl w-fit">
        {[
          { id: 'all', label: 'All View' },
          { id: 'main', label: 'Main Categories' },
          { id: 'sub', label: 'Subcategories' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-2.5 text-sm font-bold rounded-xl transition-all", 
              activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-950"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {(activeTab === 'all' || activeTab === 'main') && (
          <Section 
            title="Main Categories" 
            description="Top-level product groupings"
            icon={<FolderTree className="w-5 h-5 text-primary" />}
            categories={categories.filter(c => !c.parent_id)}
            onAdd={() => handleOpenDrawer('main')}
            onEdit={(cat: any) => handleOpenDrawer('main', cat)}
            onDelete={handleDelete}
            allCategories={categories}
            addButtonLabel="Add Main Category"
          />
        )}

        {(activeTab === 'all' || activeTab === 'sub') && (
          <Section 
            title="Subcategories" 
            description="Detailed product subgroups"
            icon={<ChevronRight className="w-5 h-5 text-emerald-600" />}
            categories={categories.filter(c => c.parent_id !== null)}
            onAdd={() => handleOpenDrawer('sub')}
            onEdit={(cat: any) => handleOpenDrawer('sub', cat)}
            onDelete={handleDelete}
            allCategories={categories}
            addButtonLabel="Add Subcategory"
          />
        )}
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-end"
          >
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold">{editingCategory ? "Edit" : "Add"} {drawerMode === 'main' ? 'Category' : 'Subcategory'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}><X className="w-5 h-5" /></Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Name</label>
                  <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Slug</label>
                  <Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                </div>
                {drawerMode === 'sub' && (
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500">Parent Category</label>
                    <Select value={formData.parent_id || ""} onValueChange={(val) => setFormData({...formData, parent_id: val})}>
                      <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => !c.parent_id).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Tax Rate (%)</label>
                  <Input type="number" value={formData.tax_rate} onChange={(e) => setFormData({...formData, tax_rate: parseFloat(e.target.value)})} />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>{saving ? <Loader2 className="animate-spin" /> : "Save Category"}</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, description, icon, categories, onAdd, onEdit, onDelete, allCategories, addButtonLabel }: any) {
  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-xl border border-zinc-100 shadow-sm">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl font-black">{title}</CardTitle>
            <CardDescription className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{description}</CardDescription>
          </div>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20 rounded-xl px-6" onClick={onAdd}>
          <Plus className="w-4 h-4" />
          {addButtonLabel}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-zinc-50/50">
                <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Name</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Slug</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Tax Rate</th>
                <th className="h-12 px-6 text-left align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                <th className="h-12 px-6 text-right align-middle font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((category: any) => (
                <tr key={category.id} className="group transition-colors hover:bg-zinc-50/50">
                  <td className="px-6 py-4 align-middle font-bold text-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 overflow-hidden flex items-center justify-center shrink-0">
                        {category.image_url ? (
                          <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span>{category.name}</span>
                        {category.parent_id && (
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            Under {allCategories.find((c: any) => c.id === category.parent_id)?.name || "Unknown"}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-zinc-400 font-mono text-xs">{category.slug}</td>
                  <td className="px-6 py-4 align-middle font-bold text-zinc-900">{category.tax_rate}%</td>
                  <td className="px-6 py-4 align-middle">
                    <Badge className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                      category.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {category.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 text-zinc-400 hover:text-primary transition-all"
                        onClick={() => onEdit(category)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:bg-red-50 shadow-sm border border-transparent hover:border-red-100 text-zinc-400 hover:text-red-600 transition-all"
                        onClick={() => onDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-400">
                    <p className="font-bold">No categories found in this section.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}


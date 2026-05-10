"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-zinc-50 animate-pulse rounded-md border" />
});

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    stock_quantity: "0",
    short_description: "",
    long_description: "",
    description: "",
    specification: "",
    manufacturing_info: "",
    warranty_info: "",
    image_url: "",
    images: [] as string[],
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [supabase]);

  const handleEditorChange = (field: string, content: string) => {
    setFormData((prev) => ({ ...prev, [field]: content }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(formData.name);
      const { error } = await supabase.from("products").insert([
        {
          name: formData.name,
          slug,
          price: parseFloat(formData.price),
          category_id: formData.category_id,
          stock_quantity: parseInt(formData.stock_quantity),
          short_description: formData.short_description,
          long_description: formData.long_description,
          description: formData.short_description, // For backward compatibility
          specification: formData.specification,
          manufacturing_info: formData.manufacturing_info,
          warranty_info: formData.warranty_info,
          image_url: formData.images[0] || null,
          images: formData.images,
          status: "Active",
        },
      ]);

      if (error) throw error;

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product listing for your store.</p>
          </div>
        </div>
        <Button onClick={handleSubmit} className="gap-2" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Premium Wireless Headphones" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Input 
                  id="short_description" 
                  placeholder="e.g. A brief overview of the product for quick reading." 
                  value={formData.short_description}
                  onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Content</CardTitle>
              <CardDescription>Detailed information about the product.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specification">Specification</TabsTrigger>
                  <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
                  <TabsTrigger value="warranty">Warranty</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <RichTextEditor 
                    label="Product Long Description"
                    value={formData.long_description}
                    onChange={(content) => handleEditorChange("long_description", content)}
                  />
                </TabsContent>
                <TabsContent value="specification" className="mt-6">
                  <RichTextEditor 
                    label="Product Specification"
                    value={formData.specification}
                    onChange={(content) => handleEditorChange("specification", content)}
                  />
                </TabsContent>
                <TabsContent value="manufacturing" className="mt-6">
                  <RichTextEditor 
                    label="Manufacturing Information"
                    value={formData.manufacturing_info}
                    onChange={(content) => handleEditorChange("manufacturing_info", content)}
                  />
                </TabsContent>
                <TabsContent value="warranty" className="mt-6">
                  <RichTextEditor 
                    label="Warranty Information"
                    value={formData.warranty_info}
                    onChange={(content) => handleEditorChange("warranty_info", content)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload main image for your product.</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiImageUpload 
                images={formData.images} 
                onChange={(images) => setFormData(prev => ({ ...prev, images }))} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="status">Product Status</Label>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                This product will be visible to all customers on the storefront.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

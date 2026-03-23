import { getCategories, getBrands } from "@/lib/actions/products";
import { createProduct } from "@/lib/actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NewProductPage() {
    const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

    return (
        <form action={createProduct} className="space-y-8 pb-20">
            {/* Top Navigation / Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-1 hover:bg-zinc-200 rounded-md transition-colors">
                        <span className="material-symbols-outlined text-zinc-600">arrow_back</span>
                    </Link>
                    <h1 className="text-xl font-semibold text-[#1a1c1d]">Add product</h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="bg-white border-[#d2d2d2] h-9 text-xs font-medium px-4 shadow-sm">
                        Discard
                    </Button>
                    <Button type="submit" className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]">
                        Save
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Core Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl">
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">Title</label>
                                <input
                                    name="name"
                                    placeholder="Short sleeve t-shirt"
                                    className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">Description</label>
                                <textarea
                                    name="description"
                                    rows={6}
                                    className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl">
                        <CardHeader className="px-6 py-4 border-b border-[#f1f1f1]">
                            <CardTitle className="text-sm font-semibold">Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">Price ($)</label>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">SKU (Stock Keeping Unit)</label>
                                <input
                                    name="sku"
                                    className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">Quantity Available</label>
                                <input
                                    name="inventory"
                                    type="number"
                                    defaultValue="0"
                                    className="w-full px-3 py-2 border border-[#d2d2d2] rounded-md text-sm focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Organization */}
                <div className="space-y-6">
                    <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl">
                        <CardHeader className="px-6 py-4 border-b border-[#f1f1f1]">
                            <CardTitle className="text-sm font-semibold">Product Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <select
                                name="status"
                                className="w-full px-3 py-2 border border-[#d2d2d2] bg-white rounded-md text-sm outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                            <p className="mt-3 text-[11px] text-[#616161]">Active products will be visible to customers immediately.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl">
                        <CardHeader className="px-6 py-4 border-b border-[#f1f1f1]">
                            <CardTitle className="text-sm font-semibold">Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">Category</label>
                                <select name="category_id" className="w-full px-3 py-2 border border-[#d2d2d2] bg-white rounded-md text-sm outline-none">
                                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#1a1c1d] mb-1.5 block">Brand / Vendor</label>
                                <select name="brand_id" className="w-full px-3 py-2 border border-[#d2d2d2] bg-white rounded-md text-sm outline-none">
                                    {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
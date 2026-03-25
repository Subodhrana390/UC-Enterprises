"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./CategoryForm";
import { deleteCategoryForm } from "@/lib/actions/admin";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function CollectionsTable({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleEdit = (cat: any) => {
    setSelectedCategory(cat);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={handleCreate}
          className="bg-[#1a1c1d] text-white h-9 text-xs font-medium px-4 hover:bg-[#303030]"
        >
          Create collection
        </Button>
      </div>

      <Card className="bg-white border-[#ebebeb] shadow-sm rounded-xl overflow-hidden">
        
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#f1f1f1] text-[11px] font-semibold text-[#616161] uppercase tracking-wider">
                <th className="px-6 py-3 w-10"><input type="checkbox" className="rounded border-[#d2d2d2]" /></th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Parent Category</th>
                <th className="px-4 py-3">Icon</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f1f1]">
              {initialCategories.map((category) => {
                const productCount = category.products?.[0]?.count ?? 0;
                const parentCategory = category.parent_id 
                  ? initialCategories.find(c => c.id === category.parent_id)
                  : null;

                return (
                  <tr key={category.id} className="group hover:bg-[#fafafa] transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-[#d2d2d2]" /></td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold text-[#1a1c1d]">
                        {category.parent_id ? '↳ ' : ''}{category.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {parentCategory ? (
                        <span className="text-xs text-[#616161]">{parentCategory.name}</span>
                      ) : (
                        <span className="text-xs text-[#9e9e9e] italic">Top Level</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative h-9 w-9 rounded-md overflow-hidden border border-[#ebebeb] bg-[#f5f5f5]">
                        {category.icon ? (
                          <Image 
                            src={category.icon} 
                            alt={category.name} 
                            fill 
                            className="object-cover"
                            sizes="36px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[#616161] text-[10px]">N/A</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-[#616161]">
                      {productCount} {productCount === 1 ? 'product' : 'products'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 p-0 h-auto"
                        >
                          Edit
                        </Button>
                        <form 
                          action={async (formData) => {
                            if (confirm("Are you sure you want to delete this collection?")) {
                              const result = await deleteCategoryForm(formData);
                              if (result?.error) {
                                alert(result.error);
                                return;
                              }
                              router.refresh();
                            }
                          }}
                        >
                          <input type="hidden" name="categoryId" value={category.id} />
                          <button type="submit" className="text-xs font-medium text-rose-600 hover:text-rose-700 p-0 h-auto bg-transparent border-none cursor-pointer">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={handleClose}
        isEdit={!!selectedCategory}
        category={selectedCategory}
        allCategories={initialCategories}
      />
    </>
  );
}
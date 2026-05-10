import Link from "next/link";
import { FolderTree } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import {
  getDepartmentFromCategoryName,
  getDepartmentMeta,
  storeDepartments,
  type StoreDepartment,
} from "@/lib/storefront";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const params = await searchParams;
  const activeSegment = (params.segment as StoreDepartment | undefined) || undefined;

  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, status, image_url")
    .order("name", { ascending: true });

  const groupedCategories = storeDepartments.map((department) => ({
    ...department,
    categories: (categories || []).filter(
      (category) => getDepartmentFromCategoryName(category.name) === department.id
    ),
  }));

  const visibleGroups = activeSegment
    ? groupedCategories.filter((group) => group.id === activeSegment)
    : groupedCategories;

  const activeMeta = activeSegment ? getDepartmentMeta(activeSegment) : null;

  return (
    <div className="bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]">
      <section className="container mx-auto px-4 py-14">
        <div className="mb-10 space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Categories</p>
          <h1 className="text-4xl font-black tracking-tight text-zinc-950">
            {activeMeta ? activeMeta.label : "Browse by department"}
          </h1>
          <p className="max-w-2xl text-sm text-zinc-600">
            {activeMeta
              ? activeMeta.description
              : "Our categories are grouped into hardware welding, electronic goods, lab chemicals and powders, and general order supply."}
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {storeDepartments.map((segment) => {
            const isActive = segment.id === activeSegment;

            return (
              <Link
                key={segment.id}
                href={`/categories?segment=${segment.id}`}
                className={`border p-5 transition ${
                  isActive
                    ? "border-primary bg-primary text-white shadow-lg"
                    : "border-orange-100 bg-orange-50 hover:border-primary hover:bg-white"
                }`}
              >
                <p className="text-sm font-black uppercase tracking-widest">{segment.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="space-y-10">
          {visibleGroups.map((group) => (
            <div key={group.id} className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-zinc-950">{group.label}</h2>
                  <p className="text-sm text-zinc-600">{group.description}</p>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                  {group.categories.length} categories
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {group.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group flex items-center gap-4 border border-orange-100 bg-white p-6 shadow-sm transition hover:border-primary hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-primary overflow-hidden">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
                      ) : (
                        <FolderTree className="h-6 w-6" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-zinc-950 transition group-hover:text-primary">{category.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{category.status || "Active"}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {!group.categories.length && (
                <div className="border border-dashed border-orange-200 bg-white p-6 text-sm font-semibold text-zinc-600">
                  No categories are mapped to this department yet.
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

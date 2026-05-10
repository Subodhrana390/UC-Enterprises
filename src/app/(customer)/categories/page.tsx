import Link from "next/link";
import { FolderTree } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import {
  getDepartmentFromCategoryName,
  getDepartmentMeta,
} from "@/lib/storefront";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string }>;
}) {
  const params = await searchParams;
  const activeSegment = (params.segment as string | undefined) || undefined;

  const supabase = await createClient();
  const { data: allCategories } = await supabase
    .from("categories")
    .select("id, name, slug, status, image_url, parent_id")
    .order("name", { ascending: true });

  const mainCategories = (allCategories || []).filter(c => !c.parent_id);
  const subCategories = (allCategories || []).filter(c => c.parent_id);

  const groupedCategories = mainCategories.map((main) => ({
    id: main.id,
    label: main.name,
    slug: main.slug,
    description: `Browse our specialized ${main.name.toLowerCase()} catalog and related industrial supplies.`,
    categories: subCategories.filter(sub => sub.parent_id === main.id),
  }));

  const visibleGroups = activeSegment
    ? groupedCategories.filter((group) => group.slug === activeSegment)
    : groupedCategories;

  const activeMeta = activeSegment ? groupedCategories.find(g => g.slug === activeSegment) : null;

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
              : "Our categories are grouped into chemicals, glassware, tools, safety equipment, and industrial goods."}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/categories"
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border ${
              !activeSegment
                ? "border-primary bg-primary text-white shadow-xl shadow-orange-200"
                : "border-orange-100 bg-white text-zinc-600 hover:border-primary hover:text-primary"
            }`}
          >
            All Departments
          </Link>
          {mainCategories.map((segment) => {
            const isActive = segment.slug === activeSegment;

            return (
              <Link
                key={segment.id}
                href={`/categories?segment=${segment.slug}`}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border ${
                  isActive
                    ? "border-primary bg-primary text-white shadow-xl shadow-orange-200"
                    : "border-orange-100 bg-white text-zinc-600 hover:border-primary hover:text-primary"
                }`}
              >
                {segment.name}
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

import Link from "next/link";

interface CategorySidebarProps {
  categories: any[];
  activeSlug?: string;
}

export function CategorySidebar({ categories, activeSlug }: CategorySidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-80px)] fixed left-0 top-20 bg-slate-50 border-r border-slate-200 z-40 overflow-y-auto">
      <div className="px-6 py-8">
        <h2 className="text-lg font-black text-slate-900 font-headline tracking-tight">Product Categories</h2>
        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">Technical Specifications</p>
      </div>
      <nav className="flex flex-col divide-y divide-slate-100">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className={`flex items-center px-6 py-4 transition-all duration-300 group ${
              activeSlug === cat.slug 
                ? "bg-blue-50 text-blue-700 font-bold border-r-4 border-blue-600" 
                : "text-slate-600 hover:bg-white hover:pl-8"
            }`}
          >
            <span className={`material-symbols-outlined mr-3 text-lg ${activeSlug === cat.slug ? "text-blue-700" : "text-on-surface-variant opacity-60 group-hover:opacity-100"}`}>
              {cat.slug === 'microcontrollers' ? 'developer_board' : 'memory'}
            </span>
            <span className="text-sm font-medium">{cat.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

import Link from "next/link";
import { getCategories } from "@/lib/actions/products";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-20 pb-32 px-8 max-w-[1920px] mx-auto">
        <header className="mb-20 text-center space-y-4 max-w-4xl mx-auto">
          <nav className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant mb-6 opacity-40">
            <Link href="/">Home</Link>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary">Manifest Encyclopedia</span>
          </nav>
          <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter uppercase leading-none mb-6">Component Taxonomy</h1>
          <p className="text-base md:text-xl text-on-surface-variant font-medium leading-relaxed max-w-2xl mx-auto">
            Explore the world's most comprehensive catalog of high-performance electronic components, semiconductors, and industrial hardware.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat: any) => (
            <Link 
              key={cat.id} 
              href={`/categories/${cat.slug}`}
              className="group relative h-[320px] rounded-[48px] overflow-hidden bg-white border border-border/40 hover:shadow-2xl transition-all hover:-translate-y-2 duration-500"
            >
              <div className="absolute inset-x-0 bottom-0 p-10 z-20 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                   <span className="material-symbols-outlined text-3xl">{cat.slug === 'microcontrollers' ? 'developer_board' : 'memory'}</span>
                </div>
                <h3 className="text-2xl font-black font-headline uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Explore Line Card</p>
              </div>
              
              {/* Decorative side badge */}
              <div className="absolute top-8 right-8 writing-mode-vertical text-[9px] font-black uppercase tracking-widest opacity-10 group-hover:opacity-40 transition-opacity">
                Manifest: {cat.slug.slice(0, 3)}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

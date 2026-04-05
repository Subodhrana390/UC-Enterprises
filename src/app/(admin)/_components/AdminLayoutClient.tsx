"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-cyan-100">

            <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 border-r border-slate-200 bg-white z-40">
                <AdminSidebar />
            </aside>

            {/* --- MAIN INTERFACE STACK --- */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">

                <header className="h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">

                        {/* Mobile Menu Trigger (Sheet) */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden text-slate-600 hover:bg-slate-100 rounded-xl shrink-0"
                                    aria-label="Open menu"
                                >
                                    <span className="material-symbols-outlined text-2xl font-light">menu_open</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-72 border-r-0">
                                <VisuallyHidden.Root>
                                    <SheetTitle>Admin Navigation</SheetTitle>
                                </VisuallyHidden.Root>
                                <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                            </SheetContent>
                        </Sheet>

                        {/* Branding Context */}
                        <div className="flex flex-col min-w-0">
                            <h1 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-widest italic leading-none truncate">
                                UC <span className="text-cyan-600">Enterprises</span>
                            </h1>

                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Industrial Status - Hidden on small mobile */}
                        <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-700 uppercase whitespace-nowrap">System Live</span>
                        </div>

                        {/* Storefront Link */}
                        <Link href="/" target="_blank">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 sm:h-9 border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white rounded-lg sm:rounded-xl font-black text-[9px] uppercase tracking-widest transition-all"
                            >
                                <span className="material-symbols-outlined text-sm sm:mr-2">visibility</span>
                                <span className="hidden sm:inline">Launch Store</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* --- MAIN SCROLLABLE CANVAS --- */}
                <main className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="w-full max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
                            {/* Content Wrapper */}
                            <div className="min-h-[calc(100vh-8rem)]">
                                {children}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
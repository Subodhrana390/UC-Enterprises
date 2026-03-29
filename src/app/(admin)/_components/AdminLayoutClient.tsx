"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "./AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#f1f1f1] overflow-hidden font-sans">

            {/* Desktop Sidebar - Hidden on Mobile */}
            <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
                <AdminSidebar />
            </aside>

            {/* Main Content Stack */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* Top Bar */}
                <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 flex-shrink-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1">
                        {/* Mobile Menu Toggle using Sheet */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden"
                                    aria-label="Open menu"
                                >
                                    <span className="material-symbols-outlined text-xl">menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 sm:w-72">
                                <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                            </SheetContent>
                        </Sheet>

                        <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                            Admin Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Storefront Shortcut */}
                        <Link href="/" target="_blank">
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-xs sm:text-sm"
                            >
                                <span className="material-symbols-outlined text-sm sm:text-base mr-1">open_in_new</span>
                                <span className="hidden xs:inline">View Store</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Main Scrollable Canvas */}
                <main className="flex-1 overflow-y-auto bg-[#f1f1f1] p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 scroll-smooth">
                    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AccountSidebar } from "./AccountSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

export default function AccountLayoutClient({
    children,
    user,
    role,
    categories,
    cartCount,
    wishlistCount,
}: any) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar
                categories={categories}
                user={user}
                userRole={role}
                cartCount={cartCount}
                wishlistCount={wishlistCount}
            />

            {/* FIXED MOBILE BAR - Stays at top while scrolling */}
            <div className="lg:hidden fixed top-[64px] left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Account Menu
                </span>
                
                <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                    <SheetTrigger className="p-2 -mr-2 text-gray-900 transition-opacity active:opacity-50">
                        <span className="material-symbols-outlined text-[22px] block">
                            {isMobileSidebarOpen ? 'close' : 'menu'}
                        </span>
                    </SheetTrigger>
                    
                    <SheetContent side="left" className="p-0 w-[280px] border-none">
                        <SheetTitle className="sr-only">Account Navigation</SheetTitle>
                        <AccountSidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col lg:flex-row flex-1">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-100 bg-white">
                    <div className="sticky top-0 h-screen">
                        <AccountSidebar />
                    </div>
                </aside>

                <main className="flex-1 bg-gray-50/50 pt-[52px] lg:pt-0">
                    <div className="p-6 md:p-10 lg:p-16">
                        <div className="max-w-4xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
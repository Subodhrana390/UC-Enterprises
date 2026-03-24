"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f1f1f1] overflow-hidden font-sans">

      {/* 1. Sidebar - Fixed on Desktop, Overlay on Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <AdminSidebar />
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. Main Content Stack */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Shopify Universal Top Bar */}
        <header className="h-12 flex items-center justify-between px-3 md:px-4 flex-shrink-0 z-30">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Storefront Shortcut */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[12px] font-bold text-zinc-300 hover:text-white px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              View Store
            </Link>

          </div>
        </header>

        {/* 3. Main Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#f1f1f1] p-4 md:p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
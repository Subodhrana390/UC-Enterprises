"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 px-8 md:px-12 py-16 w-full max-w-7xl mx-auto font-body text-sm leading-relaxed">
        <div className="col-span-2">
          <span className="text-xl font-black text-slate-900 dark:text-slate-50 font-headline tracking-tighter mb-4 block">
            UCEnterprises
          </span>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6">
            Empowering innovation through global supply chain excellence. Over 500k components in stock.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">public</span>
            </Link>
            <Link
              href="#"
              className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Shopping</h4>
          <Link href="/categories" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Categories
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Line Cards
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            New Products
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Offers
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Services</h4>
          <Link href="/fabrication" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Fabrication Services
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            BOM Tool
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            API Access
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Custom Quotes
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Legal</h4>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Compliances
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-on-surface mb-2">Support</h4>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Contact Support
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Global Distribution
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            Help Center
          </Link>
          <Link href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
            FAQs
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-8 px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2024 UCEnterprises. Engineering Precision.</p>
        <p className="mt-4 md:mt-0">Headquarters: San Jose, CA | ISO 9001:2015 Certified</p>
      </div>
    </footer>
  );
}

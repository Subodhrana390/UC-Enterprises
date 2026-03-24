"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        {/* Main Grid: 4 Columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: About / Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.jpg"
                alt="UC Enterprises logo"
                width={180}
                height={54}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50">
              UC ENTERPRISES
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Leading industrial supplier of high-quality electronics and fabrication services.
              </p>
              <div className="pt-2">
                <p className="font-semibold text-slate-900 dark:text-slate-200">GSTIN</p>
                <p>03DYEPD4654N1ZB</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-200">UDYAM</p>
                <p>PB-18-0013501</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {["Search Products", "Browse Categories", "Fabrication Services", "Latest Arrivals", "Featured Products"].map((link) => (
                <li key={link}>
                  <Link 
                    href={`/${link.toLowerCase().replace(/ /g, "-")}`} 
                    className="text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50">
              Contact
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-6">
                Hadhbast No-44, Ambala Delhi Highway,<br />
                Bisanpur, Zirakpur, Punjab,<br />
                140603, India
              </p>
              <div className="flex flex-col gap-2">
                <Link href="tel:9888863377" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">call</span>
                  +91 98888 63377
                </Link>
                <Link href="mailto:ucenterprises1@gmail.com" className="hover:text-blue-600 transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">mail</span>
                  ucenterprises1@gmail.com
                </Link>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter (The Shopify Signature) */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50">
              Subscribe
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get updates on new inventory and industry news.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest py-3 rounded-md hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
              © 2026 UC ENTERPRISES • Zirakpur
            </p>
            <p className="text-[10px] text-slate-400">
              All rights reserved. Secure B2B platform.
            </p>
          </div>
          
          {/* Generic Payment Icons Placeholder */}
          <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all cursor-default">
            <span className="material-symbols-outlined text-2xl">payments</span>
            <span className="material-symbols-outlined text-2xl">account_balance</span>
            <span className="material-symbols-outlined text-2xl">credit_card</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
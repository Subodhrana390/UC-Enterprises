"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/actions/support";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await subscribeNewsletter(email);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Thank you for subscribing!" });
        setEmail("");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const quickLinks = [
    { title: "Search Products", href: "/search" },
    { title: "Browse Categories", href: "/categories" },
    { title: "Fabrication Services", href: "/fabrication" },
    { title: "Request Quote", href: "/quotation" },
    { title: "My Orders", href: "/account/orders" },
    { title: "Support", href: "/support" }
  ];

  return (
    <footer className="w-full border-t border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: About / Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src="/logo.jpg"
                alt="UC Enterprises"
                width={180}
                height={54}
                className="h-10 w-auto object-contain dark:brightness-110"
              />
            </Link>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
              UC ENTERPRISES
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed italic">
                Precision electronics and industrial fabrication solutions.
              </p>
              <div className="pt-4 space-y-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GSTIN</span>
                  <span className="font-mono text-slate-900 dark:text-cyan-400">03DYEPD4654N1ZB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UDYAM</span>
                  <span className="font-mono text-slate-900 dark:text-cyan-400">PB-18-0013501</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-50">
              Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-cyan-400 mr-0 group-hover:mr-2 transition-all opacity-0 group-hover:opacity-100" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-50">
              Contact Detail
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-6 font-medium">
                Hadhbast No-44, Ambala Delhi Highway,<br />
                Bisanpur, Zirakpur, Punjab,<br />
                140603, India
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <Link href="tel:9888863377" className="hover:text-cyan-500 transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-cyan-500">call</span>
                  +91 98888 63377
                </Link>
                <Link href="mailto:ucenterprises1@gmail.com" className="hover:text-cyan-500 transition-colors flex items-center gap-3">
                  <span className="material-symbols-outlined text-lg text-cyan-500">mail</span>
                  ucenterprises1@gmail.com
                </Link>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-50">
              Newsletter
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Direct updates on inventory and technical industry news.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="Engineer's Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-cyan-500 h-11 text-white"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 dark:bg-cyan-600 text-white dark:text-white text-[10px] font-bold uppercase tracking-widest h-11 hover:bg-cyan-500 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Join Network"}
              </Button>
              {message && (
                <p className={`text-[11px] font-bold ${message.type === "success" ? "text-emerald-500" : "text-rose-500"}`}>
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500">
              © 2026 UC ENTERPRISES • ZIRAKPUR
            </p>
          </div>

          <div className="flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <span className="material-symbols-outlined text-2xl text-white">payments</span>
            <span className="material-symbols-outlined text-2xl text-white">account_balance</span>
            <span className="material-symbols-outlined text-2xl text-white">credit_card</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
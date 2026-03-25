"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

interface ResponsiveMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

export function ResponsiveMenu({ trigger, children, align = "right" }: ResponsiveMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="md:hidden">{trigger}</div>

      <div className="hidden md:block relative">{children}</div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl p-4 ${
              align === "right" ? "" : ""
            }`}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

interface MobileNavProps {
  children: React.ReactNode;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export function MobileNav({ children, logo, actions }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#ebebeb]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="p-2 -ml-2">
            <Menu className="w-6 h-6" />
          </button>
          {logo}
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Menu</span>
              <button onClick={() => setOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-1">{children}</nav>
          </div>
        </div>
      )}
    </header>
  );
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}

export function DropdownMenu({ trigger, children, align = "right" }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-full mt-1 min-w-48 bg-white border border-[#ebebeb] rounded-lg shadow-lg z-50 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <div className="py-1">{children}</div>
          </div>
        </>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({ children, onClick, className = "" }: DropdownItemProps) {
  return (
    <button
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#f5f5f5] ${className}`}
    >
      {children}
    </button>
  );
}

function setOpen(value: boolean) {
  // This will be handled by the parent component
}
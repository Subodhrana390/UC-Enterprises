"use client";

import { ReactNode } from "react";

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function ResponsiveTable({ children, className = "", scrollable = true }: ResponsiveTableProps) {
  if (scrollable) {
    return (
      <div className={`overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 ${className}`}>
        <div className="min-w-full inline-block align-middle">
          {children}
        </div>
      </div>
    );
  }
  return <div className={className}>{children}</div>;
}

interface TableCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableCard({ children, className = "", onClick }: TableCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#ebebeb] rounded-lg p-4 ${onClick ? "cursor-pointer hover:bg-[#fafafa]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

interface MobileTableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileTableRow({ children, className = "", onClick }: MobileTableRowProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border-b border-[#f1f1f1] p-4 ${onClick ? "cursor-pointer active:bg-[#f5f5f5]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

interface MobileTableCellProps {
  children: ReactNode;
  label?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export function MobileTableCell({ children, label, className = "", align = "left" }: MobileTableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  if (label) {
    return (
      <div className={`flex justify-between items-center py-1 ${className}`}>
        <span className="text-xs text-[#616161]">{label}</span>
        <span className={`text-sm font-medium ${alignClass}`}>{children}</span>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
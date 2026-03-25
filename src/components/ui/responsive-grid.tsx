"use client";

import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  gap?: {
    default?: string;
    sm?: string;
    md?: string;
    lg?: string;
  };
}

export function ResponsiveGrid({
  children,
  className = "",
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = { default: "1rem", md: "1.5rem" },
}: ResponsiveGridProps) {
  const gridCols = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols["2xl"] && `2xl:grid-cols-${cols["2xl"]}`,
  ]
    .filter(Boolean)
    .join(" ");

  const gridGap = [
    gap.default && `gap-${gap.default.replace("rem", "")}`,
    gap.sm && `sm:gap-${gap.sm.replace("rem", "")}`,
    gap.md && `md:gap-${gap.md.replace("rem", "")}`,
    gap.lg && `lg:gap-${gap.lg.replace("rem", "")}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`grid ${gridCols} ${gridGap} ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
}

export function ResponsiveContainer({
  children,
  className = "",
  maxWidth = "xl",
  padding = true,
}: ResponsiveContainerProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  }[maxWidth];

  const paddingClass = padding ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div className={`mx-auto ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}

interface MobileStackProps {
  children: ReactNode;
  className?: string;
  gap?: string;
}

export function MobileStack({ children, className = "", gap = "4" }: MobileStackProps) {
  return (
    <div className={`flex flex-col ${gap > "4" ? `gap-${gap}` : "gap-4"} ${className}`}>
      {children}
    </div>
  );
}

interface DesktopRowProps {
  children: ReactNode;
  className?: string;
  gap?: string;
  align?: "start" | "center" | "end" | "stretch";
}

export function DesktopRow({
  children,
  className = "",
  gap = "4",
  align = "stretch",
}: DesktopRowProps) {
  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }[align];

  return (
    <div className={`hidden md:flex flex-row ${gap > "4" ? `gap-${gap}` : "gap-4"} ${alignClass} ${className}`}>
      {children}
    </div>
  );
}

interface HideOnMobileProps {
  children: ReactNode;
  className?: string;
}

export function HideOnMobile({ children, className = "" }: HideOnMobileProps) {
  return <div className={`hidden md:block ${className}`}>{children}</div>;
}

interface HideOnDesktopProps {
  children: ReactNode;
  className?: string;
}

export function HideOnDesktop({ children, className = "" }: HideOnDesktopProps) {
  return <div className={`md:hidden ${className}`}>{children}</div>;
}
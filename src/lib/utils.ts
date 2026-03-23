import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Indian English: format currency with ₹ symbol and Indian number system (lakh/crore) */
export function formatPriceINR(amount: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) {
  return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  })}`
}

/** Indian English: format number with Indian number system (1,00,000 for lakh) */
export function formatNumberINR(num: number) {
  return num.toLocaleString("en-IN")
}

/** Indian English: format date as DD/MM/YYYY */
export function formatDateINR(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

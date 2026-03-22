import type { ReactNode } from "react";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <div className="bg-surface min-h-screen">{children}</div>;
}

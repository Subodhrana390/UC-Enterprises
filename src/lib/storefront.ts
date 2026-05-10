export const supportPhone = "+91 98888 63377";
export const supportPhoneHref = "tel:+919888863377";
export const supportEmail = "ucenterprises1@gmail.com";
export const supportEmailHref = "mailto:ucenterprises1@gmail.com";

export type StoreDepartment =
  | "hardware-welding"
  | "electronic-goods"
  | "lab-chemicals-powders"
  | "general-order-supply";

export const storeDepartments: Array<{
  id: StoreDepartment;
  label: string;
  description: string;
}> = [
  {
    id: "hardware-welding",
    label: "Hardware Welding",
    description: "Welding tools, metal hardware, fabrication support items, and workshop materials.",
  },
  {
    id: "electronic-goods",
    label: "Electronic Goods",
    description: "Business electronics, accessories, office devices, and project equipment supply.",
  },
  {
    id: "lab-chemicals-powders",
    label: "Lab Chemicals & Powders",
    description: "Chemicals, powders, lab-use consumables, and institutional procurement support.",
  },
  {
    id: "general-order-supply",
    label: "General Order Supply",
    description: "Mixed-category sourcing for daily business, office, and recurring supply needs.",
  },
];

const departmentKeywordMap: Record<StoreDepartment, string[]> = {
  "hardware-welding": [
    "weld",
    "welding",
    "hardware",
    "industrial",
    "metal",
    "tool",
    "fastener",
    "safety",
  ],
  "electronic-goods": [
    "electronic",
    "electronics",
    "computer",
    "laptop",
    "printer",
    "network",
    "cctv",
    "monitor",
    "mobile",
    "ups",
    "server",
  ],
  "lab-chemicals-powders": [
    "lab",
    "chemical",
    "chemicals",
    "powder",
    "powders",
    "reagent",
    "solvent",
  ],
  "general-order-supply": [
    "general",
    "office",
    "supply",
    "supplies",
    "stationery",
    "housekeeping",
    "packing",
  ],
};

export function getDepartmentFromCategoryName(name: string | null | undefined): StoreDepartment {
  const value = (name || "").toLowerCase();

  for (const [department, keywords] of Object.entries(departmentKeywordMap) as Array<
    [StoreDepartment, string[]]
  >) {
    if (keywords.some((keyword) => value.includes(keyword))) {
      return department;
    }
  }

  return "general-order-supply";
}

export function getDepartmentMeta(department: StoreDepartment) {
  return storeDepartments.find((item) => item.id === department) || storeDepartments[3];
}

export const primaryNavLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals" },
  { href: "/track-order", label: "Track Order" },
  { href: "/bulk-inquiry", label: "Bulk Inquiry" },
];

export const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/bulk-inquiry", label: "Bulk Inquiry" },
    { href: "/track-order", label: "Track Order" },
  ],
  policies: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
  ],
};

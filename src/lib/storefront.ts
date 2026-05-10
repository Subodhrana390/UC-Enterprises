export const supportPhone = "+91 98888 63377";
export const supportPhoneHref = "tel:+919888863377";
export const supportEmail = "ucenterprises1@gmail.com";
export const supportEmailHref = "mailto:ucenterprises1@gmail.com";
export const companyAddress = "Shop No. 1, Khairabad Village, Near Bus Stand, Bela Road, Khairabad, Ropar, Punjab - 140001, India.";
export const companyTagline = "Complete solutions for laboratory, industrial & safety requirements.";
export const companyCoreValues = "Quality is our Promise, Safety is our Priority.";
export const companyWebsite = "www.ucenterprises.in";

export type StoreDepartment =
  | "chemicals-reagents"
  | "glassware-plasticware"
  | "tools-hardware"
  | "safety-equipment-ppe"
  | "industrial-electrical";

export const storeDepartments: Array<{
  id: StoreDepartment;
  label: string;
  description: string;
}> = [
  {
    id: "chemicals-reagents",
    label: "Chemicals & Reagents",
    description: "Laboratory chemicals, analytical reagents, solvents, powders, and specialty chemicals.",
  },
  {
    id: "glassware-plasticware",
    label: "Glassware & Plasticware",
    description: "Beakers, flasks, test tubes, measuring cylinders, pipettes, and lab consumables.",
  },
  {
    id: "tools-hardware",
    label: "Tools & Hardware",
    description: "Power tools, hand tools, measuring tools, cutting tools, and hardware fasteners.",
  },
  {
    id: "safety-equipment-ppe",
    label: "Safety Equipment & PPE",
    description: "Personal protective equipment, first aid, hazard signage, fire safety, and fall protection.",
  },
  {
    id: "industrial-electrical",
    label: "Industrial & Electrical",
    description: "Electrical accessories, electronic equipment, wires, detectors, and lockout/tagout devices.",
  },
];

const departmentKeywordMap: Record<StoreDepartment, string[]> = {
  "chemicals-reagents": [
    "chemical",
    "reagent",
    "solvent",
    "powder",
    "buffer",
    "indicator",
  ],
  "glassware-plasticware": [
    "glassware",
    "plasticware",
    "beaker",
    "flask",
    "tube",
    "cylinder",
    "pipette",
    "bottle",
  ],
  "tools-hardware": [
    "tool",
    "hardware",
    "power",
    "hand",
    "measure",
    "cut",
    "fastener",
  ],
  "safety-equipment-ppe": [
    "safety",
    "ppe",
    "protective",
    "first aid",
    "hazard",
    "fire",
    "mask",
    "goggle",
  ],
  "industrial-electrical": [
    "industrial",
    "electrical",
    "electronic",
    "wire",
    "detector",
    "lockout",
    "tagout",
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

  return "industrial-electrical";
}

export function getDepartmentMeta(department: StoreDepartment) {
  return storeDepartments.find((item) => item.id === department) || storeDepartments[4];
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

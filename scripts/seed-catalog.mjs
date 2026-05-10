import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add both env vars before running the seed."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const categories = [
  { name: "Welding Electrodes", slug: "welding-electrodes", status: "Active" },
  { name: "Welding Machines", slug: "welding-machines", status: "Active" },
  { name: "Industrial Safety Hardware", slug: "industrial-safety-hardware", status: "Active" },
  { name: "Electronic Goods", slug: "electronic-goods", status: "Active" },
  { name: "CCTV and Security Systems", slug: "cctv-security-systems", status: "Active" },
  { name: "Laboratory Chemicals", slug: "laboratory-chemicals", status: "Active" },
  { name: "Industrial Powders", slug: "industrial-powders", status: "Active" },
  { name: "General Office and Supply Items", slug: "general-office-supply-items", status: "Active" },
];

const products = [
  {
    name: "ARC Welding Electrode E6013 3.15mm",
    slug: "arc-welding-electrode-e6013-315mm",
    price: 1450,
    category_slug: "welding-electrodes",
    stock_quantity: 120,
    image_url: "/images/prod_main.png",
    status: "Active",
    description:
      "<p>Reliable E6013 welding electrodes suitable for fabrication shops, repair work, and general welding applications.</p>",
    specification:
      "<ul><li>Size: 3.15 mm</li><li>Use: Mild steel welding</li><li>Pack type: Bulk carton supply</li></ul>",
    manufacturing_info:
      "<p>Quality-checked supply for workshop and industrial purchase requirements.</p>",
    warranty_info:
      "<p>Replacement support available for transit damage or verified supply issue.</p>",
  },
  {
    name: "IGBT Inverter Welding Machine 250A",
    slug: "igbt-inverter-welding-machine-250a",
    price: 18500,
    category_slug: "welding-machines",
    stock_quantity: 18,
    image_url: "/images/prod_side.png",
    status: "Active",
    description:
      "<p>Heavy-duty inverter welding machine for industrial fabrication, maintenance work, and contractor usage.</p>",
    specification:
      "<ul><li>Output: 250A</li><li>Technology: IGBT inverter</li><li>Application: Workshop and site work</li></ul>",
    manufacturing_info:
      "<p>Designed for dependable welding performance and commercial workload usage.</p>",
    warranty_info:
      "<p>Standard seller warranty with service support as per brand policy.</p>",
  },
  {
    name: "Industrial Safety Hand Gloves Pack",
    slug: "industrial-safety-hand-gloves-pack",
    price: 650,
    category_slug: "industrial-safety-hardware",
    stock_quantity: 75,
    image_url: "/images/hot1.png",
    status: "Active",
    description:
      "<p>Safety gloves for industrial handling, workshop use, and daily site operations.</p>",
    specification:
      "<ul><li>Pack: 12 pairs</li><li>Use: Workshop, hardware, fabrication</li></ul>",
    manufacturing_info:
      "<p>Commercial-use safety supply item for general industrial procurement.</p>",
    warranty_info:
      "<p>No warranty on consumable wear items. Transit issue support available.</p>",
  },
  {
    name: "HP Laser Printer for Office Use",
    slug: "hp-laser-printer-for-office-use",
    price: 22499,
    category_slug: "electronic-goods",
    stock_quantity: 14,
    image_url: "/images/prod_switch.png",
    status: "Active",
    description:
      "<p>Business-ready office laser printer suitable for billing, documents, and daily commercial printing.</p>",
    specification:
      "<ul><li>Function: Print</li><li>Use: Office and billing counter</li><li>Connectivity: USB and network</li></ul>",
    manufacturing_info:
      "<p>Sourced for office, school, and institutional purchase needs.</p>",
    warranty_info:
      "<p>Brand warranty applicable. Installation guidance available on request.</p>",
  },
  {
    name: "8 Channel CCTV Security Kit",
    slug: "8-channel-cctv-security-kit",
    price: 32999,
    category_slug: "cctv-security-systems",
    stock_quantity: 9,
    image_url: "/images/offer1.png",
    status: "Active",
    description:
      "<p>Complete CCTV setup for shop, office, warehouse, and factory security monitoring.</p>",
    specification:
      "<ul><li>Channels: 8</li><li>Use: Office, retail, industrial site</li><li>Package: DVR, cameras, power accessories</li></ul>",
    manufacturing_info:
      "<p>Commercial-grade security solution for Indian business installations.</p>",
    warranty_info:
      "<p>Warranty support available as per manufacturer coverage.</p>",
  },
  {
    name: "Laboratory Grade Isopropyl Alcohol",
    slug: "laboratory-grade-isopropyl-alcohol",
    price: 950,
    category_slug: "laboratory-chemicals",
    stock_quantity: 40,
    image_url: "/images/offer2.png",
    status: "Active",
    description:
      "<p>Lab-use cleaning and chemical handling supply suitable for institutions, workshops, and testing setups.</p>",
    specification:
      "<ul><li>Grade: Laboratory use</li><li>Pack: 1 litre</li><li>Use: Cleaning and process support</li></ul>",
    manufacturing_info:
      "<p>Handle and store as per safety guidance and chemical usage norms.</p>",
    warranty_info:
      "<p>Chemical supplies are non-returnable after opening unless damaged in transit.</p>",
  },
  {
    name: "Aluminium Oxide Powder Fine Grade",
    slug: "aluminium-oxide-powder-fine-grade",
    price: 2800,
    category_slug: "industrial-powders",
    stock_quantity: 28,
    image_url: "/images/hot2.png",
    status: "Active",
    description:
      "<p>Fine-grade industrial powder for laboratory, finishing, and specialized process applications.</p>",
    specification:
      "<ul><li>Grade: Fine</li><li>Use: Industrial and lab process work</li><li>Pack: Bulk supply available</li></ul>",
    manufacturing_info:
      "<p>Supplied for B2B and institutional purchase with handling guidance where required.</p>",
    warranty_info:
      "<p>Replacement only for damaged or incorrect supply on delivery.</p>",
  },
  {
    name: "A4 Copier Paper 75 GSM Box",
    slug: "a4-copier-paper-75-gsm-box",
    price: 1525,
    category_slug: "general-office-supply-items",
    stock_quantity: 90,
    image_url: "/images/combo.png",
    status: "Active",
    description:
      "<p>Daily office-use copier paper for invoices, documentation, and bulk printing requirements.</p>",
    specification:
      "<ul><li>Size: A4</li><li>GSM: 75</li><li>Supply: Box quantity</li></ul>",
    manufacturing_info:
      "<p>General office supply item for recurring business procurement.</p>",
    warranty_info:
      "<p>Transit damage support available on sealed supply packs.</p>",
  },
];

async function seedCategories() {
  const { error } = await supabase.from("categories").upsert(categories, {
    onConflict: "slug",
  });

  if (error) {
    throw error;
  }
}

async function seedProducts() {
  const { data: categoryRows, error: categoryError } = await supabase
    .from("categories")
    .select("id, slug");

  if (categoryError) {
    throw categoryError;
  }

  const categoryMap = new Map(categoryRows.map((row) => [row.slug, row.id]));

  const productRows = products.map((product) => {
    const categoryId = categoryMap.get(product.category_slug);

    if (!categoryId) {
      throw new Error(`Missing category for slug: ${product.category_slug}`);
    }

    return {
      name: product.name,
      slug: product.slug,
      price: product.price,
      category_id: categoryId,
      stock_quantity: product.stock_quantity,
      description: product.description,
      specification: product.specification,
      manufacturing_info: product.manufacturing_info,
      warranty_info: product.warranty_info,
      image_url: product.image_url,
      status: product.status,
    };
  });

  const { error } = await supabase.from("products").upsert(productRows, {
    onConflict: "slug",
  });

  if (error) {
    throw error;
  }
}

async function main() {
  await seedCategories();
  await seedProducts();
  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main().catch((error) => {
  console.error("Catalog seed failed:", error.message);
  process.exit(1);
});

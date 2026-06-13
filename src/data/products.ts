import type { Product } from "@/lib/types";

const tee = (i: number) =>
  [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=900&q=80",
  ][i % 3]!;

const sizeVariants = (prefix: string) =>
  ["S", "M", "L", "XL"].map((s) => ({
    id: `${prefix}-size-${s}`,
    name: "Size",
    value: s,
    inStock: true,
  }));

const colorVariants = (prefix: string) =>
  [
    { value: "Lavender", hex: "#b9a4e3" },
    { value: "Black", hex: "#111111" },
    { value: "Cream", hex: "#f3ead7" },
  ].map((c) => ({
    id: `${prefix}-color-${c.value}`,
    name: "Color",
    value: c.value,
    hex: c.hex,
    inStock: true,
  }));

/**
 * Mock catalogue. In production this is replaced by a Supabase/Prisma query —
 * the shape mirrors the `Product` Prisma model 1:1.
 */
export const products: Product[] = [
  {
    id: "p-001",
    name: "Central Perk Logo Oversized Tee",
    slug: "central-perk-logo-oversized-tee",
    sku: "FM-TEE-001",
    category: "t-shirts",
    tags: ["central perk", "coffee", "unisex"],
    images: [
      { url: tee(0), alt: "Central Perk oversized tee front" },
      { url: tee(1), alt: "Central Perk oversized tee back" },
    ],
    price: 1290,
    comparePrice: 1690,
    stock: 42,
    rating: 4.8,
    reviewCount: 214,
    description:
      "Heavyweight 240 GSM combed cotton with a relaxed oversized fit and a screen-printed Central Perk crest. The one you'll never want to take off.",
    attributes: { Fabric: "240 GSM Cotton", Fit: "Oversized", Origin: "Bangladesh" },
    variants: [...sizeVariants("p-001"), ...colorVariants("p-001")],
    badges: ["bestseller", "sale"],
    isFeatured: true,
  },
  {
    id: "p-002",
    name: "How You Doin'? Embroidered Hoodie",
    slug: "how-you-doin-embroidered-hoodie",
    sku: "FM-HOOD-002",
    category: "hoodies",
    tags: ["joey", "quote", "embroidered"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
        alt: "Embroidered hoodie",
      },
    ],
    price: 2490,
    comparePrice: 2990,
    stock: 18,
    rating: 4.9,
    reviewCount: 132,
    description:
      "Brushed-back fleece hoodie with Joey's signature line embroidered on the chest. Could it BE any cosier?",
    attributes: { Fabric: "320 GSM Fleece", Fit: "Regular" },
    variants: sizeVariants("p-002"),
    badges: ["new", "sale"],
    isFeatured: true,
  },
  {
    id: "p-003",
    name: "Central Perk Ceramic Mug",
    slug: "central-perk-ceramic-mug",
    sku: "FM-MUG-003",
    category: "mugs",
    tags: ["coffee", "central perk", "gift"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
        alt: "Central Perk mug",
      },
    ],
    price: 690,
    stock: 120,
    rating: 4.7,
    reviewCount: 389,
    description:
      "350ml glossy ceramic mug printed with the Central Perk logo. Dishwasher and microwave safe.",
    attributes: { Capacity: "350 ml", Material: "Ceramic" },
    badges: ["bestseller"],
    isFeatured: true,
  },
  {
    id: "p-004",
    name: "The One With The Frame Keychain",
    slug: "the-one-with-the-frame-keychain",
    sku: "FM-KEY-004",
    category: "keychains",
    tags: ["frame", "gift", "metal"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80",
        alt: "Frame keychain",
      },
    ],
    price: 290,
    comparePrice: 390,
    stock: 200,
    rating: 4.6,
    reviewCount: 96,
    description:
      "Enamel keychain shaped like the iconic yellow frame on Monica's peephole.",
    badges: ["sale"],
    isFeatured: true,
  },
  {
    id: "p-005",
    name: "Pivot! Graphic Tee",
    slug: "pivot-graphic-tee",
    sku: "FM-TEE-005",
    category: "t-shirts",
    tags: ["ross", "quote", "unisex"],
    images: [{ url: tee(2), alt: "Pivot graphic tee" }],
    price: 1190,
    stock: 64,
    rating: 4.8,
    reviewCount: 158,
    description:
      "Soft bio-washed tee featuring Ross's most quotable moment. PIVOT!",
    variants: [...sizeVariants("p-005"), ...colorVariants("p-005")],
    badges: ["new"],
    isFeatured: true,
  },
  {
    id: "p-006",
    name: "We Were on a Break Cap",
    slug: "we-were-on-a-break-cap",
    sku: "FM-CAP-006",
    category: "caps",
    tags: ["ross", "quote", "adjustable"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80",
        alt: "Embroidered cap",
      },
    ],
    price: 890,
    stock: 33,
    rating: 4.5,
    reviewCount: 71,
    description:
      "Structured 6-panel cap with tonal embroidery and an adjustable strap.",
    badges: ["bestseller"],
    isFeatured: true,
  },
  {
    id: "p-007",
    name: "Friends Logo Bifold Wallet",
    slug: "friends-logo-bifold-wallet",
    sku: "FM-WAL-007",
    category: "wallets",
    tags: ["logo", "gift", "vegan leather"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
        alt: "Bifold wallet",
      },
    ],
    price: 1490,
    comparePrice: 1990,
    stock: 27,
    rating: 4.7,
    reviewCount: 54,
    description:
      "Vegan-leather bifold with embossed Friends logo, 6 card slots and a coin pocket.",
    badges: ["limited", "sale"],
    isFeatured: true,
  },
  {
    id: "p-008",
    name: "Could I BE Any More Sticker Pack",
    slug: "could-i-be-any-more-sticker-pack",
    sku: "FM-STK-008",
    category: "stickers",
    tags: ["chandler", "pack", "vinyl"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1535868463898-067a40e6a8d9?auto=format&fit=crop&w=900&q=80",
        alt: "Sticker pack",
      },
    ],
    price: 350,
    stock: 300,
    rating: 4.9,
    reviewCount: 245,
    description:
      "12 waterproof die-cut vinyl stickers packed with quotable Chandler sarcasm.",
    badges: ["bestseller"],
    isFeatured: true,
  },
];

export const featuredProducts = products.filter((p) => p.isFeatured);

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

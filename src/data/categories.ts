import type { Category } from "@/lib/types";

/** Trending collections shown on the homepage and /categories. */
export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirts",
    description: "Soft, premium cotton tees with iconic quotes.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    productCount: 48,
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    description: "Cosy fleece for the perfect Central Perk afternoon.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80",
    productCount: 26,
  },
  {
    slug: "mugs",
    name: "Mugs",
    description: "Your coffee deserves a Central Perk cup.",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
    productCount: 31,
  },
  {
    slug: "wallets",
    name: "Wallets",
    description: "Carry a little nostalgia everywhere you go.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    productCount: 14,
  },
  {
    slug: "caps",
    name: "Caps",
    description: "Top off your look, the one with the cap.",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
    productCount: 19,
  },
  {
    slug: "keychains",
    name: "Keychains",
    description: "Little reminders of your favourite friends.",
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=80",
    productCount: 37,
  },
  {
    slug: "masks",
    name: "Masks",
    description: "Stay safe, stay iconic.",
    image:
      "https://images.unsplash.com/photo-1605845328644-d6b083ef0a8f?auto=format&fit=crop&w=1200&q=80",
    productCount: 12,
  },
  {
    slug: "stickers",
    name: "Stickers",
    description: "Deck out your laptop with quotable moments.",
    image:
      "https://images.unsplash.com/photo-1535868463898-067a40e6a8d9?auto=format&fit=crop&w=1200&q=80",
    productCount: 54,
  },
  {
    slug: "phone-cases",
    name: "Phone Cases",
    description: "Protect your phone the FRIENDS way.",
    image:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80",
    productCount: 22,
  },
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));

/** Domain types shared across UI, mock data, and the future API layer. */

export type ID = string;

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: ID;
  /** e.g. "Size", "Color" */
  name: string;
  /** e.g. "M", "Lavender" */
  value: string;
  /** optional hex for color swatches */
  hex?: string;
  inStock: boolean;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  sku: string;
  /** Category slug — one of the seeded `CategorySlug`s or an admin-created one. */
  category: string;
  tags: string[];
  images: ProductImage[];
  price: number;
  /** original price for discount display */
  comparePrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  attributes?: Record<string, string>;
  variants?: ProductVariant[];
  badges?: ("new" | "bestseller" | "limited" | "sale")[];
  isFeatured?: boolean;
}

/** The slugs seeded by default. Admins can add more at runtime. */
export type CategorySlug =
  | "t-shirts"
  | "hoodies"
  | "mugs"
  | "wallets"
  | "caps"
  | "keychains"
  | "masks"
  | "stickers"
  | "phone-cases";

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Mood {
  slug: string;
  title: string;
  subtitle: string;
  emoji: string;
  gradient: string;
}

export interface Review {
  id: ID;
  author: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  body: string;
  productName?: string;
}

export interface CartItem {
  product: Product;
  variantId?: ID;
  quantity: number;
}

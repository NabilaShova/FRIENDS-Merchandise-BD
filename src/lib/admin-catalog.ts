import { products as seedProducts } from "@/data/products";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

/**
 * Admin-editable catalogue. Seeded from the mock data and persisted to
 * localStorage for the demo; maps 1:1 onto the Prisma `Product` model so the
 * admin UI can be pointed at `/api/admin/products` later with no UI changes.
 */
const STORAGE_KEY = "fmbd.adminProducts.v1";

export function loadAdminProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : seedProducts;
  } catch {
    return seedProducts;
  }
}

export function saveAdminProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export interface ProductFormValues {
  name: string;
  sku: string;
  category: string;
  price: number;
  comparePrice?: number;
  stock: number;
  description: string;
  images: string[];
  sizes: string;
  colors: string;
  isFeatured: boolean;
}

export function blankProductForm(): ProductFormValues {
  return {
    name: "",
    sku: "",
    category: "t-shirts",
    price: 0,
    comparePrice: undefined,
    stock: 0,
    description: "",
    images: [],
    sizes: "",
    colors: "",
    isFeatured: false,
  };
}

export function toFormValues(p: Product): ProductFormValues {
  const sizes = (p.variants ?? [])
    .filter((v) => v.name === "Size")
    .map((v) => v.value)
    .join(", ");
  const colors = (p.variants ?? [])
    .filter((v) => v.name === "Color")
    .map((v) => (v.hex ? `${v.value}:${v.hex}` : v.value))
    .join(", ");
  return {
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price,
    comparePrice: p.comparePrice,
    stock: p.stock,
    description: p.description,
    images: p.images.map((i) => i.url),
    sizes,
    colors,
    isFeatured: Boolean(p.isFeatured),
  };
}

function parseVariants(values: ProductFormValues): Product["variants"] {
  const slug = slugify(values.name);
  const sizes = values.sizes
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((value) => ({
      id: `${slug}-size-${slugify(value)}`,
      name: "Size",
      value,
      inStock: true,
    }));
  const colors = values.colors
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const [label, hex] = entry.split(":").map((s) => s.trim());
      return {
        id: `${slug}-color-${slugify(label ?? entry)}`,
        name: "Color",
        value: label ?? entry,
        ...(hex ? { hex } : {}),
        inStock: true,
      };
    });
  const variants = [...sizes, ...colors];
  return variants.length ? variants : undefined;
}

/** Merge form values into an existing product or create a new one. */
export function applyForm(values: ProductFormValues, existing?: Product): Product {
  const base: Product =
    existing ??
    ({
      id: `p-${Math.random().toString(36).slice(2, 8)}`,
      slug: slugify(values.name),
      images: [],
      tags: [],
      rating: 0,
      reviewCount: 0,
    } as unknown as Product);

  return {
    ...base,
    name: values.name,
    slug: existing ? base.slug : slugify(values.name),
    sku: values.sku,
    category: values.category,
    tags: base.tags?.length ? base.tags : [values.category],
    price: values.price,
    comparePrice: values.comparePrice || undefined,
    stock: values.stock,
    description: values.description,
    isFeatured: values.isFeatured,
    variants: parseVariants(values),
    images: values.images.map((url) => ({ url, alt: values.name })),
  };
}

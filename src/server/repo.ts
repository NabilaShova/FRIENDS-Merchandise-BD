import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { products as seedProducts } from "@/data/products";
import { categories as seedCategories } from "@/data/categories";
import { DEFAULT_COUPONS, couponDiscountFor, type Coupon } from "@/lib/coupons";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { getPrisma, isDbConfigured } from "@/lib/prisma";
import type { Category, Product } from "@/lib/types";
import type { CustomerInfo, OrderLine, PaymentMethod, PlacedOrder } from "@/lib/orders";

/**
 * Single source of truth for the whole app. Admin writes and storefront reads
 * hit the same data, so changes are shared across all visitors.
 *
 * Two interchangeable backends behind one async API:
 *   • Postgres via Prisma — used automatically when DATABASE_URL is set.
 *   • In-memory store (optionally persisted to JSON via DATA_DIR) — the
 *     zero-setup fallback for local dev and demos.
 */

const db = () => getPrisma();

// ─── Mappers: Prisma row → app domain type ─────────────────────────────────
interface PrismaProduct {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  tags: string[];
  attributes: unknown;
  categorySlug: string;
  images: { url: string; alt: string; position: number }[];
  variants: { id: string; name: string; value: string; hex: string | null; inStock: boolean }[];
}

function toProduct(p: PrismaProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice ?? undefined,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    isFeatured: p.isFeatured,
    tags: p.tags,
    attributes: (p.attributes as unknown as Record<string, string> | null) ?? undefined,
    category: p.categorySlug,
    images: [...p.images]
      .sort((a, b) => a.position - b.position)
      .map((i) => ({ url: i.url, alt: i.alt })),
    variants: p.variants.length
      ? p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          value: v.value,
          hex: v.hex ?? undefined,
          inStock: v.inStock,
        }))
      : undefined,
  };
}

function toCategory(c: {
  slug: string;
  name: string;
  description: string;
  image: string;
  _count?: { products: number };
}): Category {
  return {
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    productCount: c._count?.products ?? 0,
  };
}

function toOrder(o: {
  number: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  giftWrap: boolean;
  customer: unknown;
  items: unknown;
  bkash: unknown;
  createdAt: Date;
}): PlacedOrder {
  return {
    number: o.number,
    createdAt: o.createdAt.toISOString(),
    status: o.status as PlacedOrder["status"],
    paymentMethod: o.paymentMethod as PaymentMethod,
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    coupon: o.couponCode ?? undefined,
    giftWrap: o.giftWrap,
    customer: o.customer as CustomerInfo,
    items: o.items as OrderLine[],
    bkash: (o.bkash as PlacedOrder["bkash"]) ?? undefined,
  };
}

const productInclude = { images: true, variants: true } as const;

function variantCreate(p: Product) {
  return (p.variants ?? []).map((v) => ({
    name: v.name,
    value: v.value,
    hex: v.hex ?? null,
    inStock: v.inStock,
  }));
}

function imageCreate(p: Product) {
  return p.images.map((im, i) => ({ url: im.url, alt: im.alt, position: i }));
}

// ─── In-memory / JSON-file fallback store ──────────────────────────────────
interface StoreData {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: PlacedOrder[];
  settings: Settings;
}

const DATA_DIR = process.env.DATA_DIR;
const DATA_FILE = DATA_DIR ? join(DATA_DIR, "store.json") : null;
const globalForStore = globalThis as unknown as { __fmbdStore?: StoreData };

function seed(): StoreData {
  return {
    products: structuredClone(seedProducts),
    categories: structuredClone(seedCategories),
    coupons: structuredClone(DEFAULT_COUPONS),
    orders: [],
    settings: structuredClone(DEFAULT_SETTINGS),
  };
}

function load(): StoreData {
  if (DATA_FILE && existsSync(DATA_FILE)) {
    try {
      const parsed = JSON.parse(readFileSync(DATA_FILE, "utf8")) as Partial<StoreData>;
      return { ...seed(), ...parsed } as StoreData;
    } catch {
      /* fall through to seed */
    }
  }
  return seed();
}

function mem(): StoreData {
  if (!globalForStore.__fmbdStore) globalForStore.__fmbdStore = load();
  return globalForStore.__fmbdStore;
}

function persist() {
  if (!DATA_FILE || !DATA_DIR) return;
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(mem()), "utf8");
  } catch {
    /* best-effort */
  }
}

// ─── Products ──────────────────────────────────────────────────────────────
export async function listProducts(): Promise<Product[]> {
  if (isDbConfigured()) {
    const rows = await db().product.findMany({
      include: productInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => toProduct(r as PrismaProduct));
  }
  return mem().products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (isDbConfigured()) {
    const row = await db().product.findUnique({ where: { slug }, include: productInclude });
    return row ? toProduct(row as PrismaProduct) : undefined;
  }
  return mem().products.find((p) => p.slug === slug);
}

export async function createProduct(product: Product): Promise<Product> {
  const slug = product.slug || slugify(product.name);
  if (isDbConfigured()) {
    const row = await db().product.create({
      data: {
        slug,
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        stock: product.stock,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isFeatured: product.isFeatured ?? false,
        tags: product.tags,
        attributes: product.attributes as unknown as Prisma.InputJsonValue,
        category: {
          connectOrCreate: {
            where: { slug: product.category },
            create: { slug: product.category, name: product.category },
          },
        },
        images: { create: imageCreate(product) },
        variants: { create: variantCreate(product) },
      },
      include: productInclude,
    });
    return toProduct(row as PrismaProduct);
  }
  const s = mem();
  const created = { ...product, slug, id: product.id || `p-${Date.now().toString(36)}` };
  s.products = [created, ...s.products.filter((p) => p.id !== created.id)];
  persist();
  return created;
}

export async function updateProduct(id: string, product: Product): Promise<Product | undefined> {
  if (isDbConfigured()) {
    try {
      const row = await db().product.update({
        where: { id },
        data: {
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice ?? null,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          isFeatured: product.isFeatured ?? false,
          tags: product.tags,
          attributes: product.attributes as unknown as Prisma.InputJsonValue,
          category: {
            connectOrCreate: {
              where: { slug: product.category },
              create: { slug: product.category, name: product.category },
            },
          },
          images: { deleteMany: {}, create: imageCreate(product) },
          variants: { deleteMany: {}, create: variantCreate(product) },
        },
        include: productInclude,
      });
      return toProduct(row as PrismaProduct);
    } catch {
      return undefined;
    }
  }
  const s = mem();
  let updated: Product | undefined;
  s.products = s.products.map((p) => {
    if (p.id !== id) return p;
    updated = { ...product, id, slug: p.slug };
    return updated;
  });
  persist();
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isDbConfigured()) {
    try {
      await db().product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
  const s = mem();
  const before = s.products.length;
  s.products = s.products.filter((p) => p.id !== id);
  persist();
  return s.products.length < before;
}

// ─── Categories ──────────────────────────────────────────────────────────
export async function listCategories(): Promise<Category[]> {
  if (isDbConfigured()) {
    const rows = await db().category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return rows.map(toCategory);
  }
  return mem().categories;
}

export async function createCategory(category: Category): Promise<Category> {
  const slug = category.slug || slugify(category.name);
  if (isDbConfigured()) {
    const existing = await db().category.findUnique({ where: { slug } });
    if (existing) return toCategory({ ...existing });
    const row = await db().category.create({
      data: {
        slug,
        name: category.name,
        description: category.description ?? "",
        image: category.image ?? "",
      },
    });
    return toCategory({ ...row });
  }
  const s = mem();
  const created = { ...category, slug };
  if (s.categories.some((c) => c.slug === slug)) return created;
  s.categories = [...s.categories, created];
  persist();
  return created;
}

export async function updateCategory(
  slug: string,
  category: Category,
): Promise<Category | undefined> {
  if (isDbConfigured()) {
    try {
      await db().category.update({
        where: { slug },
        data: {
          name: category.name,
          description: category.description ?? "",
          image: category.image ?? "",
        },
      });
      const row = await db().category.findUnique({
        where: { slug },
        include: { _count: { select: { products: true } } },
      });
      return row ? toCategory(row) : undefined;
    } catch {
      return undefined;
    }
  }
  const s = mem();
  let updated: Category | undefined;
  s.categories = s.categories.map((c) => {
    if (c.slug !== slug) return c;
    updated = { ...category, slug };
    return updated;
  });
  persist();
  return updated;
}

export async function deleteCategory(slug: string): Promise<boolean> {
  if (isDbConfigured()) {
    try {
      await db().category.delete({ where: { slug } });
      return true;
    } catch {
      return false;
    }
  }
  const s = mem();
  const before = s.categories.length;
  s.categories = s.categories.filter((c) => c.slug !== slug);
  persist();
  return s.categories.length < before;
}

// ─── Coupons ─────────────────────────────────────────────────────────────
export async function listCoupons(): Promise<Coupon[]> {
  if (isDbConfigured()) {
    const rows = await db().coupon.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((c) => ({
      code: c.code,
      kind: c.kind as Coupon["kind"],
      value: c.value,
      minSpend: c.minSpend,
      active: c.active,
    }));
  }
  return mem().coupons;
}

export async function createCoupon(coupon: Coupon): Promise<Coupon> {
  const code = coupon.code.trim().toUpperCase();
  const normalized = { ...coupon, code };
  if (isDbConfigured()) {
    const existing = await db().coupon.findUnique({ where: { code } });
    if (existing) return normalized;
    await db().coupon.create({
      data: {
        code,
        kind: coupon.kind,
        value: coupon.value,
        minSpend: coupon.minSpend,
        active: coupon.active,
      },
    });
    return normalized;
  }
  const s = mem();
  if (s.coupons.some((c) => c.code === code)) return normalized;
  s.coupons = [normalized, ...s.coupons];
  persist();
  return normalized;
}

export async function updateCoupon(code: string, coupon: Coupon): Promise<Coupon | undefined> {
  const normalized = { ...coupon, code };
  if (isDbConfigured()) {
    try {
      await db().coupon.update({
        where: { code },
        data: {
          kind: coupon.kind,
          value: coupon.value,
          minSpend: coupon.minSpend,
          active: coupon.active,
        },
      });
      return normalized;
    } catch {
      return undefined;
    }
  }
  const s = mem();
  let updated: Coupon | undefined;
  s.coupons = s.coupons.map((c) => {
    if (c.code !== code) return c;
    updated = normalized;
    return updated;
  });
  persist();
  return updated;
}

export async function deleteCoupon(code: string): Promise<boolean> {
  if (isDbConfigured()) {
    try {
      await db().coupon.delete({ where: { code } });
      return true;
    } catch {
      return false;
    }
  }
  const s = mem();
  const before = s.coupons.length;
  s.coupons = s.coupons.filter((c) => c.code !== code);
  persist();
  return s.coupons.length < before;
}

export async function validateCoupon(code: string, subtotal: number) {
  const normalized = code.trim().toUpperCase();
  let found: Coupon | undefined;
  if (isDbConfigured()) {
    const row = await db().coupon.findUnique({ where: { code: normalized } });
    if (row && row.active)
      found = {
        code: row.code,
        kind: row.kind as Coupon["kind"],
        value: row.value,
        minSpend: row.minSpend,
        active: row.active,
      };
  } else {
    found = mem().coupons.find((c) => c.code === normalized && c.active);
  }

  if (!found) return { ok: false as const, message: "That code isn't valid." };
  if (subtotal < found.minSpend) {
    return {
      ok: false as const,
      message: `Spend ৳${found.minSpend} to use ${normalized}.`,
    };
  }
  return {
    ok: true as const,
    coupon: { code: found.code, kind: found.kind, value: found.value },
    discount: couponDiscountFor(found, subtotal),
    message:
      found.kind === "percent"
        ? `${found.code} applied — ${found.value}% off!`
        : `${found.code} applied — ৳${found.value} off!`,
  };
}

// ─── Orders ──────────────────────────────────────────────────────────────
export async function listOrders(): Promise<PlacedOrder[]> {
  if (isDbConfigured()) {
    const rows = await db().order.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toOrder);
  }
  return mem().orders;
}

export async function getOrder(orderNumber: string): Promise<PlacedOrder | undefined> {
  if (isDbConfigured()) {
    const row = await db().order.findUnique({ where: { number: orderNumber } });
    return row ? toOrder(row) : undefined;
  }
  return mem().orders.find((o) => o.number === orderNumber);
}

export async function createOrder(order: PlacedOrder): Promise<PlacedOrder> {
  if (isDbConfigured()) {
    const row = await db().order.create({
      data: {
        number: order.number,
        status: order.status,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        couponCode: order.coupon ?? null,
        giftWrap: order.giftWrap,
        customer: order.customer as unknown as Prisma.InputJsonValue,
        items: order.items as unknown as Prisma.InputJsonValue,
        bkash: order.bkash as unknown as Prisma.InputJsonValue,
        createdAt: new Date(order.createdAt),
      },
    });
    return toOrder(row);
  }
  const s = mem();
  s.orders = [order, ...s.orders];
  persist();
  return order;
}

export async function setOrderStatus(
  orderNumber: string,
  status: PlacedOrder["status"],
): Promise<PlacedOrder | undefined> {
  if (isDbConfigured()) {
    try {
      const row = await db().order.update({
        where: { number: orderNumber },
        data: { status },
      });
      return toOrder(row);
    } catch {
      return undefined;
    }
  }
  const s = mem();
  let updated: PlacedOrder | undefined;
  s.orders = s.orders.map((o) => {
    if (o.number !== orderNumber) return o;
    updated = { ...o, status };
    return updated;
  });
  persist();
  return updated;
}

// ─── Settings ────────────────────────────────────────────────────────────
export async function getSettings(): Promise<Settings> {
  if (isDbConfigured()) {
    const row = await db().setting.findUnique({ where: { id: "singleton" } });
    if (!row) return DEFAULT_SETTINGS;
    const data = row.data as unknown as Partial<Settings>;
    return {
      codEnabled: data.codEnabled ?? DEFAULT_SETTINGS.codEnabled,
      bkash: { ...DEFAULT_SETTINGS.bkash, ...data.bkash },
    };
  }
  return mem().settings;
}

export async function updateSettings(next: Settings): Promise<Settings> {
  if (isDbConfigured()) {
    await db().setting.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", data: next as unknown as Prisma.InputJsonValue },
      update: { data: next as unknown as Prisma.InputJsonValue },
    });
    return next;
  }
  const s = mem();
  s.settings = next;
  persist();
  return s.settings;
}

/** Client-side API helpers — all data now flows through the shared server. */
import type { Product, Category } from "@/lib/types";
import type { Coupon } from "@/lib/coupons";
import type { PlacedOrder } from "@/lib/orders";
import type { Settings } from "@/lib/settings";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error || res.statusText);
  }
  return res.json() as Promise<T>;
}

const POST = (body: unknown) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
const PUT = (body: unknown) => ({ ...POST(body), method: "PUT" });
const PATCH = (body: unknown) => ({ ...POST(body), method: "PATCH" });

export const api = {
  products: {
    list: () => fetch("/api/products").then((r) => json<{ products: Product[] }>(r)).then((d) => d.products),
    create: (p: Product) => fetch("/api/admin/products", POST(p)).then((r) => json<{ product: Product }>(r)),
    update: (id: string, p: Product) => fetch(`/api/admin/products/${id}`, PUT(p)).then((r) => json<{ product: Product }>(r)),
    remove: (id: string) => fetch(`/api/admin/products/${id}`, { method: "DELETE" }).then((r) => json(r)),
  },
  categories: {
    list: () => fetch("/api/categories").then((r) => json<{ categories: Category[] }>(r)).then((d) => d.categories),
    create: (c: Category) => fetch("/api/admin/categories", POST(c)).then((r) => json<{ category: Category }>(r)),
    update: (slug: string, c: Category) => fetch(`/api/admin/categories/${slug}`, PUT(c)).then((r) => json<{ category: Category }>(r)),
    remove: (slug: string) => fetch(`/api/admin/categories/${slug}`, { method: "DELETE" }).then((r) => json(r)),
  },
  coupons: {
    list: () => fetch("/api/coupons").then((r) => json<{ coupons: Coupon[] }>(r)).then((d) => d.coupons),
    validate: (code: string, subtotal: number) =>
      fetch("/api/coupons/validate", POST({ code, subtotal })).then((r) =>
        json<{ ok: boolean; message: string; coupon?: { code: string; kind: Coupon["kind"]; value: number } }>(r),
      ),
    create: (c: Coupon) => fetch("/api/admin/coupons", POST(c)).then((r) => json<{ coupon: Coupon }>(r)),
    update: (code: string, c: Coupon) => fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, PUT(c)).then((r) => json<{ coupon: Coupon }>(r)),
    remove: (code: string) => fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, { method: "DELETE" }).then((r) => json(r)),
  },
  orders: {
    get: (number: string) => fetch(`/api/orders/${encodeURIComponent(number)}`).then((r) => json<{ order: PlacedOrder }>(r)).then((d) => d.order),
    listAdmin: () => fetch("/api/orders").then((r) => json<{ orders: PlacedOrder[] }>(r)).then((d) => d.orders),
    create: (order: PlacedOrder) => fetch("/api/orders", POST(order)).then((r) => json<{ order: PlacedOrder }>(r)),
    setStatus: (number: string, status: PlacedOrder["status"]) =>
      fetch(`/api/admin/orders/${encodeURIComponent(number)}`, PATCH({ status })).then((r) => json<{ order: PlacedOrder }>(r)),
  },
  settings: {
    get: () => fetch("/api/settings").then((r) => json<{ settings: Settings }>(r)).then((d) => d.settings),
    update: (s: Settings) => fetch("/api/admin/settings", PUT(s)).then((r) => json<{ settings: Settings }>(r)).then((d) => d.settings),
  },
};

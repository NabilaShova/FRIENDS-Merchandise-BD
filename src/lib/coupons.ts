/**
 * Coupon engine shared by the storefront cart and the admin Coupons screen.
 * Coupons live in the shared server repository and are validated via
 * `/api/coupons/validate`.
 */

export type CouponKind = "percent" | "fixed";

export interface Coupon {
  code: string;
  kind: CouponKind;
  /** percent (0-100) or fixed amount in BDT */
  value: number;
  minSpend: number;
  active: boolean;
}

export const DEFAULT_COUPONS: Coupon[] = [
  { code: "FRIENDS10", kind: "percent", value: 10, minSpend: 0, active: true },
  { code: "CENTRALPERK", kind: "percent", value: 15, minSpend: 1500, active: true },
  { code: "PIVOT", kind: "percent", value: 20, minSpend: 2500, active: true },
  { code: "FLAT200", kind: "fixed", value: 200, minSpend: 1000, active: true },
];

/** Compute the discount amount a coupon yields for a given subtotal. */
export function couponDiscountFor(coupon: Pick<Coupon, "kind" | "value">, subtotal: number) {
  return coupon.kind === "percent"
    ? Math.round((subtotal * coupon.value) / 100)
    : Math.min(coupon.value, subtotal);
}

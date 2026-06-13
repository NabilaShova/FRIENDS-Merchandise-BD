"use client";

import * as React from "react";
import type { CartItem, Product } from "@/lib/types";
import { couponDiscountFor, type CouponKind } from "@/lib/coupons";
import { api } from "@/lib/api";

const STORAGE_KEY = "fmbd.cart.v1";
const GIFT_WRAP_FEE = 60;
const FREE_SHIPPING_THRESHOLD = 2000;
const FLAT_SHIPPING = 80;

interface AppliedCoupon {
  code: string;
  kind: CouponKind;
  value: number;
}

interface CartState {
  items: CartItem[];
  giftWrap: boolean;
  coupon: AppliedCoupon | null;
}

interface CartContextValue extends CartState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, opts?: { variantId?: string; quantity?: number }) => void;
  remove: (productId: string, variantId?: string) => void;
  setQuantity: (productId: string, quantity: number, variantId?: string) => void;
  setGiftWrap: (value: boolean) => void;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  clearCoupon: () => void;
  /** Empty the cart (e.g. after a successful order). */
  clear: () => void;
  count: number;
  subtotal: number;
  couponDiscount: number;
  shipping: number;
  total: number;
}

const CartContext = React.createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId?: string) {
  return `${productId}::${variantId ?? "default"}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [giftWrap, setGiftWrapState] = React.useState(false);
  const [coupon, setCoupon] = React.useState<CartState["coupon"]>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // Load persisted cart on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        setItems(parsed.items ?? []);
        setGiftWrapState(parsed.giftWrap ?? false);
        setCoupon(parsed.coupon ?? null);
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration to avoid clobbering).
  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, giftWrap, coupon }),
    );
  }, [items, giftWrap, coupon, hydrated]);

  const add: CartContextValue["add"] = React.useCallback(
    (product, opts) => {
      const variantId = opts?.variantId;
      const quantity = opts?.quantity ?? 1;
      setItems((prev) => {
        const key = lineKey(product.id, variantId);
        const existing = prev.find(
          (i) => lineKey(i.product.id, i.variantId) === key,
        );
        if (existing) {
          return prev.map((i) =>
            lineKey(i.product.id, i.variantId) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { product, variantId, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const remove: CartContextValue["remove"] = React.useCallback(
    (productId, variantId) => {
      const key = lineKey(productId, variantId);
      setItems((prev) =>
        prev.filter((i) => lineKey(i.product.id, i.variantId) !== key),
      );
    },
    [],
  );

  const setQuantity: CartContextValue["setQuantity"] = React.useCallback(
    (productId, quantity, variantId) => {
      const key = lineKey(productId, variantId);
      setItems((prev) =>
        prev
          .map((i) =>
            lineKey(i.product.id, i.variantId) === key
              ? { ...i, quantity: Math.max(0, quantity) }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const subtotalRaw = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  const applyCoupon: CartContextValue["applyCoupon"] = async (code) => {
    try {
      const res = await api.coupons.validate(code, subtotalRaw);
      if (res.ok && res.coupon) setCoupon(res.coupon);
      return { ok: res.ok, message: res.message };
    } catch {
      return { ok: false, message: "Couldn't validate that code. Try again." };
    }
  };

  const couponDiscount = coupon
    ? couponDiscountFor(coupon, subtotalRaw)
    : 0;
  const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0;
  const subtotal = subtotalRaw - couponDiscount + giftWrapFee;
  const shipping =
    subtotalRaw === 0 || subtotalRaw >= FREE_SHIPPING_THRESHOLD
      ? 0
      : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    items,
    giftWrap,
    coupon,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    remove,
    setQuantity,
    setGiftWrap: setGiftWrapState,
    applyCoupon,
    clearCoupon: () => setCoupon(null),
    clear: () => {
      setItems([]);
      setCoupon(null);
      setGiftWrapState(false);
    },
    count,
    subtotal,
    couponDiscount,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export const cartConfig = {
  FREE_SHIPPING_THRESHOLD,
  GIFT_WRAP_FEE,
  FLAT_SHIPPING,
};

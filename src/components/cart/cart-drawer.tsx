"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart, cartConfig } from "@/components/cart/cart-store";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

/** Estimated delivery window: 2–4 days from now, formatted nicely. */
function deliveryWindow() {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const from = new Date();
  from.setDate(from.getDate() + 2);
  const to = new Date();
  to.setDate(to.getDate() + 4);
  return `${fmt(from)} – ${fmt(to)}`;
}

export function CartDrawer() {
  const cart = useCart();
  const {
    items,
    isOpen,
    close,
    subtotal,
    shipping,
    total,
    count,
    giftWrap,
    setGiftWrap,
    coupon,
    couponDiscount,
  } = cart;

  // Lock body scroll while open.
  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remaining = cartConfig.FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(
    100,
    (subtotal / cartConfig.FREE_SHIPPING_THRESHOLD) * 100,
  );

  const [catalogue, setCatalogue] = React.useState<Product[]>([]);
  React.useEffect(() => {
    api.products.list().then(setCatalogue).catch(() => setCatalogue([]));
  }, []);

  const crossSell = catalogue
    .filter((p) => p.isFeatured)
    .filter((p) => !items.some((i) => i.product.id === p.id))
    .slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-background shadow-lift"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <ShoppingBag className="h-5 w-5 text-brand" />
                Your Cart
                {count > 0 ? (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-brand-foreground">
                    {count}
                  </span>
                ) : null}
              </h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <EmptyState onClose={close} />
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b border-border px-5 py-3">
                  <p className="mb-2 flex items-center gap-1.5 text-sm">
                    <Truck className="h-4 w-4 text-brand" />
                    {remaining > 0 ? (
                      <span>
                        Add{" "}
                        <strong className="text-brand">
                          {formatPrice(remaining)}
                        </strong>{" "}
                        for free shipping
                      </span>
                    ) : (
                      <span className="font-medium text-brand">
                        You&apos;ve unlocked free shipping! 🎉
                      </span>
                    )}
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-brand"
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", stiffness: 120 }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <CartLine
                        key={`${item.product.id}-${item.variantId ?? "d"}`}
                        item={item}
                      />
                    ))}
                  </ul>

                  {/* Gift wrap */}
                  <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={giftWrap}
                      onChange={(e) => setGiftWrap(e.target.checked)}
                      className="h-4 w-4 accent-brand"
                    />
                    <Gift className="h-4 w-4 text-brand" />
                    <span className="flex-1">
                      Add gift wrap
                      <span className="text-muted-foreground">
                        {" "}
                        (+{formatPrice(cartConfig.GIFT_WRAP_FEE)})
                      </span>
                    </span>
                  </label>

                  <CouponField />

                  {crossSell.length > 0 ? (
                    <div className="mt-6">
                      <h3 className="mb-3 text-sm font-semibold">
                        You might also like
                      </h3>
                      <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {crossSell.map((p) => (
                          <CrossSellCard key={p.id} product={p} />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Footer / summary */}
                <div className="border-t border-border bg-muted/40 px-5 py-4">
                  <dl className="flex flex-col gap-1.5 text-sm">
                    {coupon ? (
                      <div className="flex justify-between text-brand">
                        <dt>Coupon ({coupon.code})</dt>
                        <dd>-{formatPrice(couponDiscount)}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Shipping</dt>
                      <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <Truck className="h-3.5 w-3.5" /> Est. delivery
                      </dt>
                      <dd>{deliveryWindow()}</dd>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between border-t border-border pt-2 text-base font-bold">
                      <dt>Total</dt>
                      <dd>{formatPrice(total)}</dd>
                    </div>
                  </dl>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}
                  >
                    Checkout · {formatPrice(total)}
                  </Link>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-2 w-full text-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function CartLine({ item }: { item: ReturnType<typeof useCart>["items"][number] }) {
  const { setQuantity, remove } = useCart();
  const { product, variantId, quantity } = item;
  const variant = product.variants?.find((v) => v.id === variantId);
  const cover = product.images[0];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-3"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted"
      >
        {cover ? (
          <Image src={cover.url} alt={cover.alt} fill sizes="80px" className="object-cover" />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-2 text-sm font-medium hover:text-brand"
          >
            {product.name}
          </Link>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => remove(product.id, variantId)}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        {variant ? (
          <p className="text-xs text-muted-foreground">
            {variant.name}: {variant.value}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity(product.id, quantity - 1, variantId)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity(product.id, quantity + 1, variantId)}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-semibold">
            {formatPrice(product.price * quantity)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

function CouponField() {
  const { applyCoupon, coupon, clearCoupon } = useCart();
  const [code, setCode] = React.useState("");
  const [feedback, setFeedback] = React.useState<{ ok: boolean; message: string } | null>(
    null,
  );

  if (coupon) {
    return (
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-brand/30 bg-brand/5 p-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-brand">
          <Tag className="h-4 w-4" /> {coupon.code} applied
        </span>
        <button
          type="button"
          onClick={() => {
            clearCoupon();
            setFeedback(null);
          }}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code (try FRIENDS10)"
          aria-label="Coupon code"
          className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="button"
          variant="outline"
          onClick={async () => setFeedback(await applyCoupon(code))}
        >
          Apply
        </Button>
      </div>
      {feedback ? (
        <p
          className={cn(
            "mt-1.5 text-xs",
            feedback.ok ? "text-brand" : "text-destructive",
          )}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}

function CrossSellCard({ product }: { product: Product }) {
  const { add } = useCart();
  const cover = product.images[0];
  return (
    <div className="w-28 shrink-0">
      <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-muted">
        {cover ? (
          <Image src={cover.url} alt={cover.alt} fill sizes="112px" className="object-cover" />
        ) : null}
        <button
          type="button"
          aria-label={`Add ${product.name}`}
          onClick={() => add(product)}
          className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-soft transition-transform hover:scale-110"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 line-clamp-1 text-xs font-medium">{product.name}</p>
      <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="h-9 w-9 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
      </div>
      <Link
        href="/shop"
        onClick={onClose}
        className={buttonVariants()}
      >
        Start shopping
      </Link>
    </div>
  );
}

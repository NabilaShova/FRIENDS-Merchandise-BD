"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Heart,
  Minus,
  Plus,
  RotateCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-store";
import { useWishlist } from "@/components/wishlist/wishlist-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";

type Tab = "description" | "specifications" | "shipping" | "reviews";

/** Right-hand info column + tabs. Handles variant selection and add-to-cart. */
export function ProductDetail({ product }: { product: Product }) {
  const { add, open } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const discount = discountPercent(product.price, product.comparePrice);

  // Group variants by name (Size / Color) for the selectors.
  const groups = React.useMemo(() => {
    const map = new Map<string, ProductVariant[]>();
    for (const v of product.variants ?? []) {
      map.set(v.name, [...(map.get(v.name) ?? []), v]);
    }
    return map;
  }, [product.variants]);

  const [selected, setSelected] = React.useState<Record<string, string>>({});
  const [quantity, setQuantity] = React.useState(1);
  const [added, setAdded] = React.useState(false);
  const [tab, setTab] = React.useState<Tab>("description");

  const requiredGroups = [...groups.keys()];
  const allSelected = requiredGroups.every((g) => selected[g]);

  const handleAdd = () => {
    if (!allSelected) return;
    const variantId = product.variants?.find(
      (v) => selected[v.name] === v.value,
    )?.id;
    add(product, { variantId, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="muted">{product.category.replace("-", " ")}</Badge>
          {product.badges?.includes("bestseller") ? (
            <Badge variant="accent">Bestseller</Badge>
          ) : null}
          {product.badges?.includes("limited") ? (
            <Badge>Limited Edition</Badge>
          ) : null}
        </div>
        <h1 className="heading-display text-3xl md:text-4xl">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <Rating value={product.rating} count={product.reviewCount} />
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm font-medium text-muted-foreground">
            SKU {product.sku}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.comparePrice ? (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
            <Badge variant="sale">Save {discount}%</Badge>
          </>
        ) : null}
      </div>

      <p className="text-muted-foreground">{product.description}</p>

      {/* Variant selectors */}
      {[...groups.entries()].map(([name, variants]) => (
        <div key={name}>
          <p className="mb-2 text-sm font-semibold">
            {name}:{" "}
            <span className="text-muted-foreground">
              {selected[name] ?? "Select"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isActive = selected[name] === v.value;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={!v.inStock}
                  onClick={() =>
                    setSelected((s) => ({ ...s, [name]: v.value }))
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40",
                    isActive
                      ? "border-brand bg-brand text-brand-foreground"
                      : "border-border hover:border-brand/50",
                  )}
                >
                  {v.hex ? (
                    <span
                      className="h-4 w-4 rounded-full border border-black/10"
                      style={{ backgroundColor: v.hex }}
                    />
                  ) : null}
                  {v.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quantity + stock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              product.stock > 0 ? "bg-green-500" : "bg-destructive",
            )}
          />
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAdd}
          disabled={!allSelected || product.stock === 0}
        >
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Added to cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                {allSelected ? "Add to Cart" : "Select options"}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={() => {
            handleAdd();
            open();
          }}
          disabled={!allSelected || product.stock === 0}
        >
          Buy Now
        </Button>
        <Button
          size="icon"
          variant={wished ? "default" : "outline"}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => toggle(product)}
        >
          <Heart className={cn("h-5 w-5", wished && "fill-current")} />
        </Button>
        <Button size="icon" variant="outline" aria-label="Share">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border p-4 text-center text-xs">
        <Trust icon={Truck} label="Fast delivery" />
        <Trust icon={ShieldCheck} label="Secure payment" />
        <Trust icon={RotateCw} label="Easy returns" />
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 overflow-x-auto border-b border-border">
          {(
            [
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["shipping", "Shipping"],
              ["reviews", `Reviews (${product.reviewCount})`],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                tab === key ? "text-brand" : "text-muted-foreground",
              )}
            >
              {label}
              {tab === key ? (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand"
                />
              ) : null}
            </button>
          ))}
        </div>
        <div className="py-5 text-sm leading-relaxed text-muted-foreground">
          {tab === "description" ? <p>{product.description}</p> : null}
          {tab === "specifications" ? (
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(product.attributes ?? { Detail: "—" }).map(
                ([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between rounded-xl bg-muted/50 px-4 py-2"
                  >
                    <dt className="font-medium text-foreground">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ),
              )}
            </dl>
          ) : null}
          {tab === "shipping" ? (
            <ul className="flex flex-col gap-2">
              <li>· Dispatch within 24–72 hours across Bangladesh.</li>
              <li>· Free shipping on orders over {formatPrice(2000)}.</li>
              <li>· Cash on delivery available nationwide.</li>
              <li>· 7-day easy returns on unworn items.</li>
            </ul>
          ) : null}
          {tab === "reviews" ? (
            <p>
              {product.reviewCount} fans rated this {product.rating}/5. Full
              review threads land with the reviews API.
            </p>
          ) : null}
        </div>
      </div>

      {/* Mobile sticky add-to-cart */}
      <div className="fixed inset-x-0 bottom-[4.75rem] z-30 mx-3 flex items-center gap-3 rounded-2xl border border-border bg-background/95 p-3 shadow-lift backdrop-blur lg:hidden">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{product.name}</p>
          <p className="font-bold">{formatPrice(product.price)}</p>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!allSelected || product.stock === 0}
        >
          {allSelected ? "Add to Cart" : "Select options"}
        </Button>
      </div>
    </div>
  );
}

function Trust({
  icon: Icon,
  label,
}: {
  icon: typeof Truck;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="h-5 w-5 text-brand" />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

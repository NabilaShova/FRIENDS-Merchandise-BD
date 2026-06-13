"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { fadeInUp } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { useCart } from "@/components/cart/cart-store";
import { useWishlist } from "@/components/wishlist/wishlist-store";

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

/**
 * Premium product card: image-zoom on hover, card lift, quick actions
 * (wishlist / quick view / quick add) revealed with a soft slide-up.
 */
export function ProductCard({ product, className, priority }: ProductCardProps) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const discount = discountPercent(product.price, product.comparePrice);
  const cover = product.images[0];
  const hover = product.images[1] ?? product.images[0];

  return (
    <motion.article
      variants={fadeInUp}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-3xl"
      >
        {/* base + hover image cross-fade */}
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-0"
          />
        ) : null}
        {hover ? (
          <Image
            src={hover.url}
            alt={hover.alt}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
          />
        ) : null}

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 ? <Badge variant="sale">-{discount}%</Badge> : null}
          {product.badges?.includes("new") ? (
            <Badge variant="new">New</Badge>
          ) : null}
          {product.badges?.includes("limited") ? (
            <Badge variant="accent">Limited</Badge>
          ) : null}
        </div>

        {/* quick actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            onClick={(e) => {
              e.preventDefault();
              toggle(product);
            }}
            className={cn(
              "glass flex h-9 w-9 translate-x-3 items-center justify-center rounded-full opacity-0 shadow-soft transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
              wished
                ? "translate-x-0 bg-brand text-brand-foreground opacity-100"
                : "text-foreground hover:bg-brand hover:text-brand-foreground",
            )}
          >
            <Heart className={cn("h-4 w-4", wished && "fill-current")} />
          </button>
          <QuickAction label="Quick view" delay={60}>
            <Eye className="h-4 w-4" />
          </QuickAction>
        </div>

        {/* quick add bar */}
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              add(product);
            }}
            className="glass flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-brand hover:text-brand-foreground"
          >
            <ShoppingBag className="h-4 w-4" /> Quick Add
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category.replace("-", " ")}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-1 font-semibold transition-colors group-hover:text-brand"
        >
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

function QuickAction({
  children,
  label,
  delay,
}: {
  children: React.ReactNode;
  label: string;
  delay: number;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      style={{ transitionDelay: `${delay}ms` }}
      className="glass flex h-9 w-9 translate-x-3 items-center justify-center rounded-full text-foreground opacity-0 shadow-soft transition-all duration-300 hover:bg-brand hover:text-brand-foreground group-hover:translate-x-0 group-hover:opacity-100"
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

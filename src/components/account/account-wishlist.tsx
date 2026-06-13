"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-store";
import { useCart } from "@/components/cart/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

export function AccountWishlist() {
  const { items, remove } = useWishlist();
  const { add } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-card py-20 text-center shadow-soft">
        <Heart className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-semibold">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground">
            Tap the heart on any product to save it for later.
          </p>
        </div>
        <Link href="/shop" className={buttonVariants()}>
          Explore products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((product) => {
        const cover = product.images[0];
        return (
          <motion.div
            layout
            key={product.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft"
          >
            <Link
              href={`/product/${product.slug}`}
              className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
            >
              {cover ? (
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/product/${product.slug}`}
                  className="font-semibold leading-tight hover:text-brand"
                >
                  {product.name}
                </Link>
                <button
                  type="button"
                  aria-label="Remove from wishlist"
                  onClick={() => remove(product.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-lg font-bold">
                {formatPrice(product.price)}
              </p>
              <div className="mt-auto pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    add(product);
                    remove(product.id);
                  }}
                >
                  <ShoppingBag className="h-4 w-4" /> Move to cart
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

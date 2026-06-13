"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { staggerContainer, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/product/product-card";

/** Horizontal, snap-scrolling slider of featured products with arrow controls. */
export function FeaturedProducts({ products }: { products: Product[] }) {
  const trackRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="section bg-muted/40">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured Products"
            title="Fan favourites"
            description="Hand-picked drops the whole gang is loving right now."
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-soft transition-all hover:bg-brand hover:text-brand-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-soft transition-all hover:bg-brand hover:text-brand-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23.5%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:gap-3 hover:text-brand-600"
          >
            View all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

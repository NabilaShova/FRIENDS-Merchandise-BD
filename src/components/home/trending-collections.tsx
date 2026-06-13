"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { fadeInUp, staggerContainer, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export function TrendingCollections({ categories }: { categories: Category[] }) {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Trending Collections"
        title="Shop every category"
        description="From everyday tees to collector-grade keepsakes — find your fandom fit."
      />

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            variants={fadeInUp}
            className={i === 0 ? "md:col-span-2 md:row-span-1" : ""}
          >
            <Link
              href={`/shop?category=${cat.slug}`}
              className="group relative flex h-56 items-end overflow-hidden rounded-3xl shadow-soft transition-shadow hover:shadow-lift md:h-64"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width:768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-brand/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative z-10 flex w-full items-end justify-between p-5 text-white">
                <div>
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                  <p className="text-sm text-white/70">
                    {cat.productCount} products
                  </p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

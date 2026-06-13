"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/motion";
import { ProductCard } from "@/components/product/product-card";

type SortKey = "newest" | "price-asc" | "price-desc" | "bestselling";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "bestselling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

/**
 * Client-side shop browser: category filtering, sort, and grid/list toggle.
 * In production the filtering moves server-side (Supabase query params).
 */
export function ShopView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCats, setActiveCats] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<SortKey>("newest");
  const [view, setView] = React.useState<"grid" | "list">("grid");

  const toggleCat = (slug: string) =>
    setActiveCats((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );

  const filtered = React.useMemo(() => {
    let list = products;
    if (activeCats.length) {
      list = list.filter((p) => activeCats.includes(p.category));
    }
    return [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "bestselling":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });
  }, [products, activeCats, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-height)+1rem)] flex flex-col gap-6 rounded-3xl bg-card p-6 shadow-soft">
          <div className="flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Category
            </h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={activeCats.includes(c.slug)}
                      onChange={() => toggleCat(c.slug)}
                      className="h-4 w-4 accent-brand"
                    />
                    {c.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {c.productCount}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} results
          </p>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-full border border-border bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <div className="hidden rounded-full border border-border p-1 sm:flex">
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setView("grid")}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  view === "grid" && "bg-brand text-brand-foreground",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setView("list")}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  view === "list" && "bg-brand text-brand-foreground",
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          key={`${activeCats.join()}-${sort}-${view}`}
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-5",
            view === "grid"
              ? "grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2",
          )}
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No products match your filters.
          </p>
        ) : null}
      </div>
    </div>
  );
}

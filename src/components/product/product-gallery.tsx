"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/lib/types";

/**
 * Product image gallery with thumbnails, hover-to-zoom (magnifier on desktop),
 * and swipeable main image on touch devices.
 */
export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 50, y: 50 });

  // Fall back gracefully if a product only has one image.
  const gallery = images.length ? images : [{ url: "", alt: name }];
  const current = gallery[active]!;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const swipe = (dir: 1 | -1) =>
    setActive((i) => (i + dir + gallery.length) % gallery.length);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 md:flex-col">
        {gallery.map((img, i) => (
          <button
            key={i}
            type="button"
            aria-label={`View image ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition-all md:h-20 md:w-20",
              i === active
                ? "border-brand"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            {img.url ? (
              <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
            ) : (
              <span className="block h-full w-full bg-muted" />
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="group relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-3xl bg-muted"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={onMove}
        // basic touch swipe
        onTouchStart={(e) => {
          (e.currentTarget as HTMLElement).dataset.x = String(e.touches[0]?.clientX ?? 0);
        }}
        onTouchEnd={(e) => {
          const start = Number((e.currentTarget as HTMLElement).dataset.x ?? 0);
          const delta = (e.changedTouches[0]?.clientX ?? 0) - start;
          if (Math.abs(delta) > 40) swipe(delta < 0 ? 1 : -1);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            {current.url ? (
              <Image
                src={current.url}
                alt={current.alt}
                fill
                priority
                sizes="(max-width:768px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-transform duration-200",
                  zoom && "scale-150",
                )}
                style={
                  zoom ? { transformOrigin: `${pos.x}% ${pos.y}%` } : undefined
                }
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* dots (mobile swipe indicator) */}
        {gallery.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 md:hidden">
            {gallery.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === active ? "w-5 bg-brand" : "w-1.5 bg-foreground/30",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

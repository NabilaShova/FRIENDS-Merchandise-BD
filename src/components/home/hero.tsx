"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { easeOutExpo } from "@/lib/motion";

/** Floating product chips that drift around the hero. */
const floaters = [
  {
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    className: "left-[6%] top-[22%] h-28 w-28 md:h-36 md:w-36",
    delay: 0,
  },
  {
    src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=400&q=80",
    className: "right-[8%] top-[16%] h-24 w-24 md:h-32 md:w-32",
    delay: 1.2,
  },
  {
    src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80",
    className: "left-[12%] bottom-[14%] h-24 w-24 md:h-32 md:w-32",
    delay: 0.6,
  },
  {
    src: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80",
    className: "right-[10%] bottom-[18%] h-28 w-28 md:h-36 md:w-36",
    delay: 1.8,
  },
];

export function Hero() {
  const ref = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: content drifts up & fades as you scroll past the hero.
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-brand-radial pt-[var(--nav-height)]"
    >
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      {/* floating products */}
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: easeOutExpo }}
          className={`absolute hidden md:block ${f.className}`}
        >
          <div
            className="animate-float overflow-hidden rounded-3xl bg-card shadow-lift"
            style={{ animationDelay: `${f.delay}s` }}
          >
            <div className="relative h-full w-full">
              <Image
                src={f.src}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        style={{ y, opacity }}
        className="container relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground shadow-soft"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          Official FRIENDS merchandise · Now in Bangladesh
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.05 }}
          className="heading-display max-w-4xl text-balance text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Could this <span className="text-brand">BE</span> your new{" "}
          <span className="relative whitespace-nowrap">
            favorite store?
            <span className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-accent/70" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.15 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Official FRIENDS merchandise for every fan. Premium tees, cosy hoodies
          and collectibles — delivered across Bangladesh.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.25 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/shop" className={buttonVariants({ size: "lg" })}>
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/collections"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Explore Collection
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/40 p-1">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="h-1.5 w-1 rounded-full bg-muted-foreground/60"
          />
        </div>
      </motion.div>
    </section>
  );
}

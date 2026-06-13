"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { reviews } from "@/data/moods";
import { easeOutExpo } from "@/lib/motion";
import { Rating } from "@/components/ui/rating";
import { SectionHeading } from "@/components/ui/section-heading";

/** Animated, auto-rotating testimonial carousel on glass cards. */
export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const active = reviews[index]!;

  return (
    <section className="section bg-brand-radial">
      <div className="container">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Loved by fans nationwide"
          align="center"
        />

        <div
          className="relative mx-auto mt-12 max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={active.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.97 }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
              className="glass relative rounded-3xl p-8 text-center shadow-lift md:p-12"
            >
              <Quote className="mx-auto h-10 w-10 text-brand/30" />
              <Rating value={active.rating} className="mt-4 justify-center" />
              <blockquote className="mt-4 text-lg font-medium text-balance text-foreground md:text-xl">
                “{active.body}”
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-center gap-3">
                <Image
                  src={active.avatar}
                  alt={active.author}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="text-left">
                  <p className="font-semibold">{active.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {active.location}
                    {active.productName ? ` · ${active.productName}` : ""}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-6 flex justify-center gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                aria-label={`Show review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-brand" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

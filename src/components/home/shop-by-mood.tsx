"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { moods } from "@/data/moods";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

export function ShopByMood() {
  return (
    <section className="section container">
      <SectionHeading
        eyebrow="Shop by Mood"
        title="What's your vibe today?"
        align="center"
      />

      <motion.div
        variants={staggerContainer(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3"
      >
        {moods.map((mood) => (
          <motion.div key={mood.slug} variants={fadeInUp}>
            <Link
              href={`/collections/${mood.slug}`}
              className={cn(
                "group relative flex h-40 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift md:h-48",
                mood.gradient,
              )}
            >
              <span className="text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">
                {mood.emoji}
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {mood.title}
                </h3>
                <p className="text-sm text-foreground/70">{mood.subtitle}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

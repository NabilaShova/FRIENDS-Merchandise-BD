"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer, viewport } from "@/lib/motion";

export function Newsletter() {
  const [done, setDone] = React.useState(false);

  return (
    <section className="section container">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-center text-brand-foreground md:px-16 md:py-20"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur"
        >
          <Mail className="h-4 w-4" /> Exclusive Drops & Discounts
        </motion.span>
        <motion.h2
          variants={fadeInUp}
          className="heading-display mx-auto mt-5 max-w-2xl text-balance text-3xl md:text-4xl lg:text-5xl"
        >
          Be the first to know about new arrivals
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-4 max-w-md text-brand-foreground/80"
        >
          Join the list for early access to limited drops and a 10% welcome code.
        </motion.p>

        <motion.form
          variants={fadeInUp}
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-12 flex-1 rounded-full border-0 bg-white/95 px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button type="submit" variant="accent" size="lg" disabled={done}>
            {done ? (
              <>
                <Check className="h-4 w-4" /> Subscribed
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </motion.form>
      </motion.div>
    </section>
  );
}

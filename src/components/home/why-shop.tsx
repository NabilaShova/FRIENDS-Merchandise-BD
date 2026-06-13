"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Gem,
  ShieldCheck,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { fadeInUp, staggerContainer, viewport } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: BadgeCheck,
    title: "Official Merchandise",
    desc: "Licensed designs, never bootleg.",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    desc: "Heavyweight fabrics & lasting prints.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Nationwide, 24–72 hour dispatch.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "bKash, Nagad, cards & COD.",
  },
  {
    icon: Users,
    title: "Trusted by Thousands",
    desc: "10,000+ happy fans and counting.",
  },
];

export function WhyShop() {
  return (
    <section className="section bg-muted/40">
      <div className="container">
        <SectionHeading
          eyebrow="Why Shop With Us"
          title="The one you can trust"
          align="center"
        />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-card p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-all duration-500 group-hover:scale-110 group-hover:bg-brand group-hover:text-brand-foreground">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

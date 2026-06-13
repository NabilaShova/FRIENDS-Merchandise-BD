import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion presets so every page feels alive and consistent.
 * Keep transitions snappy (premium feel) and respect reduced motion via CSS.
 */

/** Custom cubic-bezier easing (ease-out-expo) used across page transitions. */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

/** Parent container that staggers its children on scroll-into-view. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Default `whileInView` config used across sections. */
export const viewport = { once: true, margin: "-80px" } as const;

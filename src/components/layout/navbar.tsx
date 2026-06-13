"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/components/cart/cart-store";
import { useWishlist } from "@/components/wishlist/wishlist-store";

/**
 * Sticky navbar: transparent over the hero, glassmorphism once scrolled.
 * Includes desktop nav, icon actions, and an animated mobile drawer.
 */
export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { count, open: openCart } = useCart();
  const { count: wishCount } = useWishlist();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-transparent",
      )}
    >
      <nav className="container flex h-[var(--nav-height)] items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:text-brand",
                    active ? "text-brand" : "text-foreground/80",
                  )}
                >
                  {item.label}
                  {item.badge ? (
                    <span className="absolute -right-0.5 -top-0.5 rounded-full bg-accent px-1.5 text-[9px] font-bold uppercase text-accent-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5">
          <IconLink label="Search" href="/search">
            <Search className="h-5 w-5" />
          </IconLink>
          <ThemeToggle />
          <IconLink
            label="Wishlist"
            href="/account/wishlist"
            badge={wishCount || undefined}
          >
            <Heart className="h-5 w-5" />
          </IconLink>
          <IconLink label="Account" href="/account" className="hidden sm:flex">
            <User className="h-5 w-5" />
          </IconLink>
          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </nav>

      <MobileDrawer open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </header>
  );
}

function IconLink({
  children,
  label,
  href,
  badge,
  className,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      {children}
      {badge ? (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col gap-6 bg-background p-6 shadow-lift lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors hover:bg-muted",
                      pathname === item.href && "bg-muted text-brand",
                    )}
                  >
                    {item.label}
                    {item.badge ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-auto text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

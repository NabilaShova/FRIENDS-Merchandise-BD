"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-store";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Search },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: User },
];

/** Thumb-friendly bottom navigation, mobile only. */
export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, open } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="glass mx-3 mb-3 flex items-center justify-around rounded-3xl px-2 py-2 shadow-lift">
        {items.slice(0, 2).map(({ label, href, icon: Icon }) => (
          <NavTab key={label} label={label} href={href} icon={Icon} active={pathname === href} />
        ))}

        {/* Cart opens the slide-over drawer */}
        <button
          type="button"
          onClick={open}
          className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-medium text-muted-foreground"
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-bold text-brand-foreground">
                {count}
              </span>
            ) : null}
          </span>
          Cart
        </button>

        {items.slice(2).map(({ label, href, icon: Icon }) => (
          <NavTab key={label} label={label} href={href} icon={Icon} active={pathname === href} />
        ))}
      </div>
    </nav>
  );
}

function NavTab({
  label,
  href,
  icon: Icon,
  active,
}: {
  label: string;
  href: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[10px] font-medium transition-colors",
        active ? "text-brand" : "text-muted-foreground",
      )}
    >
      <Icon className={cn("h-5 w-5", active && "fill-brand/10")} />
      {label}
    </Link>
  );
}

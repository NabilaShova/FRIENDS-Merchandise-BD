"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Gift, Heart, MapPin, Package } from "lucide-react";
import { type PlacedOrder } from "@/lib/orders";
import { api } from "@/lib/api";
import { getMyOrderNumbers } from "@/lib/my-orders";
import { useWishlist } from "@/components/wishlist/wishlist-store";
import { useAccount } from "@/components/account/account-store";
import { formatPrice } from "@/lib/utils";

export function AccountOverview() {
  const [orders, setOrders] = React.useState<PlacedOrder[]>([]);
  const { count: wishCount } = useWishlist();
  const { profile, addresses } = useAccount();

  React.useEffect(() => {
    const numbers = getMyOrderNumbers();
    Promise.all(numbers.map((n) => api.orders.get(n).catch(() => null))).then(
      (list) => setOrders(list.filter(Boolean) as PlacedOrder[]),
    );
  }, []);

  const greeting = profile.fullName ? `Hey ${profile.fullName.split(" ")[0]}!` : "Welcome back!";

  const cards = [
    { label: "Orders", value: orders.length, href: "/account/orders", icon: Package },
    { label: "Wishlist", value: wishCount, href: "/account/wishlist", icon: Heart },
    { label: "Addresses", value: addresses.length, href: "/account/addresses", icon: MapPin },
    { label: "Reward points", value: profile.rewardPoints, href: "/account/rewards", icon: Gift },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl bg-brand p-6 text-brand-foreground shadow-soft">
        <h2 className="font-display text-2xl font-bold">{greeting}</h2>
        <p className="mt-1 text-brand-foreground/80">
          Here&apos;s a snapshot of your fandom journey.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-2 rounded-2xl bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-2xl font-bold">{value}</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              {label}
              <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recent orders</h3>
          <Link href="/account/orders" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {orders.slice(0, 4).map((o) => (
              <li key={o.number} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{o.number}</span>
                <span className="uppercase text-muted-foreground">{o.paymentMethod}</span>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

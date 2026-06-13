"use client";

import * as React from "react";
import { Gift, Sparkles, Star } from "lucide-react";
import { useAccount } from "@/components/account/account-store";
import { api } from "@/lib/api";
import { getMyOrderNumbers } from "@/lib/my-orders";
import { cn } from "@/lib/utils";

const TIERS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Gold", min: 1500 },
  { name: "Collector", min: 4000 },
];

export function AccountRewards() {
  const { profile } = useAccount();
  // Points are also derived from order history (1 pt / ৳100) for the demo.
  const [earned, setEarned] = React.useState(profile.rewardPoints);

  React.useEffect(() => {
    const numbers = getMyOrderNumbers();
    Promise.all(numbers.map((n) => api.orders.get(n).catch(() => null))).then(
      (list) => {
        const fromOrders = (list.filter(Boolean) as { total: number }[]).reduce(
          (sum, o) => sum + Math.floor(o.total / 100),
          0,
        );
        setEarned(profile.rewardPoints + fromOrders);
      },
    );
  }, [profile.rewardPoints]);

  const tierIndex = TIERS.reduce(
    (acc, t, i) => (earned >= t.min ? i : acc),
    0,
  );
  const tier = TIERS[tierIndex]!;
  const next = TIERS[tierIndex + 1];
  const progress = next
    ? Math.min(100, ((earned - tier.min) / (next.min - tier.min)) * 100)
    : 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-brand p-8 text-brand-foreground shadow-soft">
        <Sparkles className="absolute -right-4 -top-4 h-28 w-28 opacity-10" />
        <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
          <Star className="h-4 w-4 fill-current" /> {tier.name} member
        </p>
        <p className="mt-3 font-display text-5xl font-extrabold">{earned}</p>
        <p className="text-brand-foreground/80">reward points</p>

        {next ? (
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-xs text-brand-foreground/80">
              <span>{tier.name}</span>
              <span>
                {next.min - earned} pts to {next.name}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-brand-foreground/80">
            You&apos;ve reached the top tier — you legend. 🎉
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <h3 className="mb-4 font-display text-lg font-bold">How it works</h3>
        <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <Gift className="h-5 w-5 shrink-0 text-brand" />
            Earn <strong className="text-foreground">&nbsp;1 point&nbsp;</strong>{" "}
            for every ৳100 you spend.
          </li>
          <li className="flex gap-3">
            <Gift className="h-5 w-5 shrink-0 text-brand" />
            Redeem points for discounts at checkout (coming soon).
          </li>
          <li className="flex gap-3">
            <Gift className="h-5 w-5 shrink-0 text-brand" />
            Unlock higher tiers for early access to limited drops.
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIERS.map((t, i) => (
          <div
            key={t.name}
            className={cn(
              "rounded-2xl border p-4 text-center",
              i === tierIndex
                ? "border-brand bg-brand/5"
                : "border-border bg-card",
            )}
          >
            <p className="font-semibold">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.min}+ pts</p>
          </div>
        ))}
      </div>
    </div>
  );
}

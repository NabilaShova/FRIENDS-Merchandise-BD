"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Package,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { type PlacedOrder } from "@/lib/orders";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";

export function AdminAnalytics() {
  const [orders, setOrders] = React.useState<PlacedOrder[]>([]);
  React.useEffect(() => {
    api.orders.listAdmin().then(setOrders).catch(() => setOrders([]));
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const itemsSold = orders.reduce(
    (s, o) => s + o.items.reduce((n, i) => n + i.quantity, 0),
    0,
  );
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;

  const payment = {
    cod: orders.filter((o) => o.paymentMethod === "cod").length,
    bkash: orders.filter((o) => o.paymentMethod === "bkash").length,
  };

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const last7 = buildLast7Days(orders);
  const maxDay = Math.max(1, ...last7.map((d) => d.revenue));
  const topProducts = buildTopProducts(orders).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading-display text-2xl md:text-3xl">Analytics</h1>
        <p className="text-muted-foreground">
          Performance overview across {orders.length} orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Wallet} label="Revenue" value={formatPrice(revenue)} tint="bg-brand/10 text-brand" />
        <Stat icon={ShoppingBag} label="Orders" value={String(orders.length)} tint="bg-blue-500/10 text-blue-600" />
        <Stat icon={TrendingUp} label="Avg. order value" value={formatPrice(aov)} tint="bg-green-500/10 text-green-600" />
        <Stat icon={Package} label="Items sold" value={String(itemsSold)} tint="bg-accent/20 text-amber-600" />
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-16 text-center shadow-soft">
          <BarChart3 className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No orders yet — place a test order on the storefront to see analytics.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-card p-6 shadow-soft lg:col-span-2">
            <h2 className="mb-5 font-display font-bold">Revenue — last 7 days</h2>
            <div className="flex h-44 items-end gap-2">
              {last7.map((d) => (
                <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.revenue / maxDay) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full min-h-[4px] rounded-t-md bg-brand/80"
                    title={formatPrice(d.revenue)}
                  />
                  <span className="text-[11px] text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-display font-bold">Payment split</h2>
              <SplitBar
                segments={[
                  { label: "bKash", value: payment.bkash, className: "bg-pink-500" },
                  { label: "COD", value: payment.cod, className: "bg-foreground/70" },
                ]}
              />
            </div>
            <div className="rounded-2xl bg-card p-6 shadow-soft">
              <h2 className="mb-4 font-display font-bold">Order status</h2>
              <ul className="flex flex-col gap-2 text-sm">
                {Object.entries(statusCounts).map(([status, n]) => (
                  <li key={status} className="flex items-center justify-between">
                    <span className="capitalize text-muted-foreground">
                      {status.replace("_", " ")}
                    </span>
                    <span className="font-semibold">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {topProducts.length > 0 ? (
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display font-bold">Top products</h2>
          <ul className="flex flex-col gap-3">
            {topProducts.map((p, i) => (
              <li key={p.name} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-medium">{p.name}</span>
                <span className="text-muted-foreground">{p.quantity} sold</span>
                <span className="w-24 text-right font-semibold">
                  {formatPrice(p.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-soft">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tint)}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function SplitBar({
  segments,
}: {
  segments: { label: string; value: number; className: string }[];
}) {
  const total = Math.max(1, segments.reduce((s, seg) => s + seg.value, 0));
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={seg.className}
            style={{ width: `${(seg.value / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className={cn("h-2.5 w-2.5 rounded-full", seg.className)} />
              {seg.label}
            </span>
            <span className="font-semibold">{seg.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildLast7Days(orders: PlacedOrder[]) {
  const days: { label: string; key: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      key: d.toDateString(),
      revenue: 0,
    });
  }
  for (const o of orders) {
    const key = new Date(o.createdAt).toDateString();
    const day = days.find((d) => d.key === key);
    if (day) day.revenue += o.total;
  }
  return days;
}

function buildTopProducts(orders: PlacedOrder[]) {
  const map = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const o of orders) {
    for (const item of o.items) {
      const entry = map.get(item.name) ?? {
        name: item.name,
        quantity: 0,
        revenue: 0,
      };
      entry.quantity += item.quantity;
      entry.revenue += item.price * item.quantity;
      map.set(item.name, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.quantity - a.quantity);
}

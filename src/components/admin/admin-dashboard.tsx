"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  Package,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { type PlacedOrder } from "@/lib/orders";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function AdminDashboard() {
  const [orders, setOrders] = React.useState<PlacedOrder[]>([]);

  React.useEffect(() => {
    api.orders.listAdmin().then(setOrders).catch(() => setOrders([]));
  }, []);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingPayments = orders.filter(
    (o) => o.status === "pending_payment",
  ).length;
  const avg = orders.length ? Math.round(revenue / orders.length) : 0;

  const stats: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Revenue", value: formatPrice(revenue), icon: Wallet },
    { label: "Orders", value: String(orders.length), icon: Package },
    {
      label: "bKash to verify",
      value: String(pendingPayments),
      icon: CreditCard,
    },
    { label: "Avg. order", value: formatPrice(avg), icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store activity.
          </p>
        </div>
        <Link href="/admin/payments" className={buttonVariants()}>
          Edit bKash instructions
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-soft"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders yet. Place a test order from the storefront to see it here.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {orders.slice(0, 5).map((o) => (
              <li
                key={o.number}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <span className="font-medium">{o.number}</span>
                <span className="text-muted-foreground">
                  {o.customer.fullName}
                </span>
                <span className="hidden uppercase text-muted-foreground sm:inline">
                  {o.paymentMethod}
                </span>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

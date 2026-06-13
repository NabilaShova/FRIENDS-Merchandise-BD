"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Package, Smartphone, Truck } from "lucide-react";
import { type PlacedOrder } from "@/lib/orders";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function OrderSuccess() {
  const [order, setOrder] = React.useState<PlacedOrder | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const number = new URLSearchParams(window.location.search).get("order");
    if (!number) {
      setLoaded(true);
      return;
    }
    api.orders
      .get(number)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && !order) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold">No recent order</h1>
        <p className="text-muted-foreground">
          We couldn&apos;t find an order to show.
        </p>
        <Link href="/shop" className={buttonVariants()}>
          Continue shopping
        </Link>
      </div>
    );
  }

  if (!order) return <div className="py-24" />;

  const isBkash = order.paymentMethod === "bkash";

  return (
    <div className="mx-auto max-w-2xl py-10">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand"
      >
        <CheckCircle2 className="h-11 w-11" />
      </motion.div>

      <div className="mt-6 text-center">
        <h1 className="heading-display text-3xl">Thank you! 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          Your order{" "}
          <span className="font-semibold text-foreground">{order.number}</span>{" "}
          has been placed.
        </p>
      </div>

      {/* Status banner */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft">
        {isBkash ? (
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-[#e2136e]" />
        ) : (
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        )}
        <div className="text-sm">
          {isBkash ? (
            <>
              <p className="font-semibold">Payment under verification</p>
              <p className="text-muted-foreground">
                We received your bKash TrxID{" "}
                <strong>{order.bkash?.trxId}</strong> from{" "}
                <strong>{order.bkash?.senderNumber}</strong>. We&apos;ll confirm
                your order once the {formatPrice(order.total)} payment is
                verified.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">Cash on Delivery confirmed</p>
              <p className="text-muted-foreground">
                Please keep {formatPrice(order.total)} ready for the delivery
                agent.
              </p>
            </>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Estimated delivery: 2–4 business
            days.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="mb-3 font-semibold">Order details</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {order.items.map((i) => (
            <li key={`${i.id}-${i.variant ?? "d"}`} className="flex justify-between">
              <span className="text-muted-foreground">
                {i.quantity}× {i.name}
                {i.variant ? ` (${i.variant})` : ""}
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-bold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="mt-3 text-sm text-muted-foreground">
          Shipping to: {order.customer.fullName}, {order.customer.address},{" "}
          {order.customer.city}, {order.customer.district} ·{" "}
          {order.customer.phone}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className={buttonVariants()}>
          Continue shopping
        </Link>
        <Link
          href="/account/orders"
          className={buttonVariants({ variant: "outline" })}
        >
          Track my order
        </Link>
      </div>
    </div>
  );
}

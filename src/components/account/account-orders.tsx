"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Package, Truck } from "lucide-react";
import { type PlacedOrder } from "@/lib/orders";
import { api } from "@/lib/api";
import { getMyOrderNumbers } from "@/lib/my-orders";
import { cn, formatPrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const steps = ["Placed", "Confirmed", "Shipped", "Delivered"] as const;

/** Map an order status to how far along the tracking bar should be. */
function activeStep(order: PlacedOrder) {
  if (order.status === "pending_payment") return 0;
  if (order.status === "pending") return 1;
  return 1;
}

export function AccountOrders() {
  const [orders, setOrders] = React.useState<PlacedOrder[]>([]);
  const [open, setOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    const numbers = getMyOrderNumbers();
    Promise.all(numbers.map((n) => api.orders.get(n).catch(() => null))).then(
      (list) => setOrders(list.filter(Boolean) as PlacedOrder[]),
    );
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-card py-20 text-center shadow-soft">
        <Package className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-semibold">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            When you place an order, it&apos;ll show up here for tracking.
          </p>
        </div>
        <Link href="/shop" className={buttonVariants()}>
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const expanded = open === order.number;
        const current = activeStep(order);
        return (
          <div
            key={order.number}
            className="overflow-hidden rounded-2xl bg-card shadow-soft"
          >
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : order.number)}
              className="flex w-full items-center gap-4 p-5 text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Truck className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">{order.number}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {order.items.reduce((s, i) => s + i.quantity, 0)} item(s)
                </p>
              </div>
              <span className="hidden text-sm font-semibold sm:block">
                {formatPrice(order.total)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  order.status === "pending_payment"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700",
                )}
              >
                {order.status === "pending_payment"
                  ? "Awaiting payment"
                  : "Processing"}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border p-5">
                    {/* Tracking */}
                    <div className="mb-6 flex items-center">
                      {steps.map((step, i) => (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center gap-1.5">
                            <span
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                                i <= current
                                  ? "bg-brand text-brand-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {i <= current ? <Check className="h-4 w-4" /> : i + 1}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {step}
                            </span>
                          </div>
                          {i < steps.length - 1 ? (
                            <span
                              className={cn(
                                "mx-1 mb-5 h-0.5 flex-1 rounded-full",
                                i < current ? "bg-brand" : "bg-muted",
                              )}
                            />
                          ) : null}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Items */}
                    <ul className="flex flex-col gap-3">
                      {order.items.map((i) => (
                        <li
                          key={`${i.id}-${i.variant ?? "d"}`}
                          className="flex items-center gap-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                            {i.image ? (
                              <Image
                                src={i.image}
                                alt={i.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="flex-1 text-sm">
                            <Link
                              href={`/product/${i.slug}`}
                              className="font-medium hover:text-brand"
                            >
                              {i.name}
                            </Link>
                            <p className="text-muted-foreground">
                              {i.quantity}× {formatPrice(i.price)}
                              {i.variant ? ` · ${i.variant}` : ""}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(i.price * i.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Summary */}
                    <div className="mt-4 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-semibold">Delivery address</p>
                        <p className="text-muted-foreground">
                          {order.customer.fullName}
                          <br />
                          {order.customer.address}, {order.customer.city}
                          <br />
                          {order.customer.district} · {order.customer.phone}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-muted-foreground">
                          Payment: {order.paymentMethod.toUpperCase()}
                          {order.bkash ? ` · TrxID ${order.bkash.trxId}` : ""}
                        </p>
                        <p className="mt-2 text-lg font-bold">
                          Total {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

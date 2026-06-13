"use client";

import * as React from "react";
import { Smartphone, Truck } from "lucide-react";
import { type PlacedOrder } from "@/lib/orders";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";

const STATUSES: PlacedOrder["status"][] = ["pending_payment", "pending", "confirmed"];

const statusStyles: Record<PlacedOrder["status"], string> = {
  pending_payment: "bg-amber-100 text-amber-700",
  pending: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
};

const statusLabel: Record<PlacedOrder["status"], string> = {
  pending_payment: "Verify bKash",
  pending: "Pending (COD)",
  confirmed: "Confirmed",
};

export function AdminOrders() {
  const [orders, setOrders] = React.useState<PlacedOrder[]>([]);
  React.useEffect(() => {
    api.orders.listAdmin().then(setOrders).catch(() => setOrders([]));
  }, []);

  const changeStatus = async (orderNumber: string, status: PlacedOrder["status"]) => {
    const { order } = await api.orders.setStatus(orderNumber, status);
    setOrders((prev) => prev.map((o) => (o.number === order.number ? order : o)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading-display text-2xl md:text-3xl">Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"} · bKash payments
          flagged for manual verification.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-card p-10 text-center text-muted-foreground shadow-soft">
          No orders yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">bKash TrxID</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.number} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{o.number}</td>
                    <td className="px-4 py-3">
                      <div>{o.customer.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.customer.phone} · {o.customer.district}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        {o.paymentMethod === "bkash" ? (
                          <Smartphone className="h-4 w-4 text-[#e2136e]" />
                        ) : (
                          <Truck className="h-4 w-4 text-brand" />
                        )}
                        {o.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {o.bkash ? (
                        <div>
                          <div className="font-mono">{o.bkash.trxId}</div>
                          <div className="text-xs">{o.bkash.senderNumber}</div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold",
                          statusStyles[o.status],
                        )}
                      >
                        {statusLabel[o.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          changeStatus(o.number, e.target.value as PlacedOrder["status"])
                        }
                        className="h-9 rounded-lg border border-border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

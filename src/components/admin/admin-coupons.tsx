"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { type Coupon, type CouponKind } from "@/lib/coupons";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const blank: Coupon = {
  code: "",
  kind: "percent",
  value: 10,
  minSpend: 0,
  active: true,
};

export function AdminCoupons() {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [editing, setEditing] = React.useState<Coupon | "new" | null>(null);

  React.useEffect(() => {
    api.coupons.list().then(setCoupons).catch(() => setCoupons([]));
  }, []);

  const save = async (coupon: Coupon) => {
    const code = coupon.code.trim().toUpperCase();
    const normalized = { ...coupon, code };
    try {
      if (editing === "new") {
        if (coupons.some((c) => c.code === code)) return;
        const { coupon: created } = await api.coupons.create(normalized);
        setCoupons((prev) => [created, ...prev]);
      } else {
        const { coupon: updated } = await api.coupons.update(
          (editing as Coupon).code,
          normalized,
        );
        setCoupons((prev) => prev.map((c) => (c.code === updated.code ? updated : c)));
      }
      setEditing(null);
    } catch (err) {
      alert(`Could not save coupon: ${(err as Error).message}`);
    }
  };

  const remove = async (code: string) => {
    await api.coupons.remove(code).catch(() => {});
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const toggle = async (code: string) => {
    const target = coupons.find((c) => c.code === code);
    if (!target) return;
    const { coupon: updated } = await api.coupons.update(code, {
      ...target,
      active: !target.active,
    });
    setCoupons((prev) => prev.map((c) => (c.code === code ? updated : c)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="heading-display text-2xl md:text-3xl">Coupons</h1>
          <p className="text-muted-foreground">
            Discount codes — used live by the cart &amp; checkout.
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> New coupon
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-card py-16 text-center shadow-soft">
          <Tag className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No coupons yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div
              key={c.code}
              className={cn(
                "rounded-2xl border bg-card p-5 shadow-soft",
                c.active ? "border-brand/40" : "border-border opacity-70",
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-bold tracking-wide">
                    {c.code}
                  </p>
                  <p className="text-sm text-brand">
                    {c.kind === "percent"
                      ? `${c.value}% off`
                      : `${formatPrice(c.value)} off`}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={c.active}
                  onClick={() => toggle(c.code)}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    c.active ? "bg-brand" : "bg-muted-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      c.active ? "translate-x-[22px]" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Min spend: {c.minSpend > 0 ? formatPrice(c.minSpend) : "none"}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(c)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(c.code)}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing !== null ? (
          <CouponModal
            coupon={editing === "new" ? blank : editing}
            isNew={editing === "new"}
            onClose={() => setEditing(null)}
            onSave={save}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CouponModal({
  coupon,
  isNew,
  onClose,
  onSave,
}: {
  coupon: Coupon;
  isNew: boolean;
  onClose: () => void;
  onSave: (c: Coupon) => void;
}) {
  const [form, setForm] = React.useState<Coupon>(coupon);
  const set = <K extends keyof Coupon>(key: K, value: Coupon[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-background p-6 shadow-lift"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {isNew ? "New coupon" : "Edit coupon"}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium">Code</span>
            <input
              value={form.code}
              required
              disabled={!isNew}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Type</span>
            <select
              value={form.kind}
              onChange={(e) => set("kind", e.target.value as CouponKind)}
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed (৳)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Value</span>
            <input
              type="number"
              value={String(form.value)}
              required
              onChange={(e) => set("value", Number(e.target.value))}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-sm font-medium">Minimum spend (৳)</span>
            <input
              type="number"
              value={String(form.minSpend)}
              onChange={(e) => set("minSpend", Number(e.target.value))}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex items-center gap-2.5 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Active
          </label>
          <div className="mt-2 flex gap-3 sm:col-span-2">
            <Button type="submit" className="flex-1">
              {isNew ? "Create coupon" : "Save changes"}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </>
  );
}

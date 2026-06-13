"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, Check, Copy, ShoppingBag, Smartphone, Truck } from "lucide-react";
import { useCart } from "@/components/cart/cart-store";
import { useSettings } from "@/components/settings/settings-store";
import { cn, formatPrice } from "@/lib/utils";
import {
  generateOrderNumber,
  type CustomerInfo,
  type OrderLine,
  type PaymentMethod,
  type PlacedOrder,
} from "@/lib/orders";
import { api } from "@/lib/api";
import { addMyOrder } from "@/lib/my-orders";
import { Button } from "@/components/ui/button";

const emptyCustomer: CustomerInfo = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  postcode: "",
  notes: "",
};

export function CheckoutView() {
  const router = useRouter();
  const cart = useCart();
  const { settings } = useSettings();
  const { items, subtotal, shipping, total, coupon, couponDiscount, giftWrap, count } =
    cart;

  const [customer, setCustomer] = React.useState<CustomerInfo>(emptyCustomer);
  const [method, setMethod] = React.useState<PaymentMethod>(
    settings.codEnabled ? "cod" : "bkash",
  );
  const [bkash, setBkash] = React.useState({ senderNumber: "", trxId: "" });
  const [orderNumber] = React.useState(generateOrderNumber());
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [copied, setCopied] = React.useState(false);

  const set = (key: keyof CustomerInfo, value: string) =>
    setCustomer((c) => ({ ...c, [key]: value }));

  function validate() {
    const next: Record<string, string> = {};
    if (!customer.fullName.trim()) next.fullName = "Required";
    if (!/^01\d{9}$/.test(customer.phone.replace(/[\s-]/g, "")))
      next.phone = "Enter a valid 11-digit BD number";
    if (!customer.address.trim()) next.address = "Required";
    if (!customer.city.trim()) next.city = "Required";
    if (!customer.district.trim()) next.district = "Required";
    if (method === "bkash") {
      if (!/^01\d{9}$/.test(bkash.senderNumber.replace(/[\s-]/g, "")))
        next.senderNumber = "Enter the bKash number you paid from";
      if (bkash.trxId.trim().length < 6) next.trxId = "Enter the Transaction ID";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      document
        .querySelector("[data-error='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);

    const lines: OrderLine[] = items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      slug: i.product.slug,
      price: i.product.price,
      image: i.product.images[0]?.url,
      variant: i.product.variants?.find((v) => v.id === i.variantId)?.value,
      quantity: i.quantity,
    }));

    const order: PlacedOrder = {
      number: orderNumber,
      createdAt: new Date().toISOString(),
      items: lines,
      customer,
      paymentMethod: method,
      bkash: method === "bkash" ? bkash : undefined,
      subtotal,
      shipping,
      total,
      coupon: coupon?.code,
      giftWrap,
      status: method === "bkash" ? "pending_payment" : "pending",
    };

    try {
      await api.orders.create(order);
      addMyOrder(order.number);
      cart.clear();
      router.push(`/checkout/success?order=${encodeURIComponent(order.number)}`);
    } catch (err) {
      setSubmitting(false);
      setErrors({ submit: (err as Error).message || "Could not place order." });
    }
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-9 w-9 text-muted-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Add a few favourites before checking out.
        </p>
        <Link href="/shop">
          <Button>Browse the shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={placeOrder} className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* Left: details */}
      <div className="flex flex-col gap-8">
        {/* Contact + shipping */}
        <section className="rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Truck className="h-5 w-5 text-brand" /> Shipping details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              value={customer.fullName}
              onChange={(v) => set("fullName", v)}
              error={errors.fullName}
              autoComplete="name"
            />
            <Field
              label="Phone (bKash/contact)"
              value={customer.phone}
              onChange={(v) => set("phone", v)}
              error={errors.phone}
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
            />
            <Field
              label="Email (optional)"
              value={customer.email ?? ""}
              onChange={(v) => set("email", v)}
              className="sm:col-span-2"
              autoComplete="email"
            />
            <Field
              label="Full address"
              value={customer.address}
              onChange={(v) => set("address", v)}
              error={errors.address}
              className="sm:col-span-2"
              placeholder="House, road, area"
              autoComplete="street-address"
            />
            <Field
              label="City / Area"
              value={customer.city}
              onChange={(v) => set("city", v)}
              error={errors.city}
            />
            <Field
              label="District"
              value={customer.district}
              onChange={(v) => set("district", v)}
              error={errors.district}
            />
            <Field
              label="Postcode (optional)"
              value={customer.postcode ?? ""}
              onChange={(v) => set("postcode", v)}
            />
            <Field
              label="Order notes (optional)"
              value={customer.notes ?? ""}
              onChange={(v) => set("notes", v)}
              className="sm:col-span-2"
              placeholder="Landmark, delivery preference…"
            />
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Banknote className="h-5 w-5 text-brand" /> Payment method
          </h2>
          <div className="flex flex-col gap-3">
            {settings.codEnabled ? (
              <PaymentOption
                active={method === "cod"}
                onSelect={() => setMethod("cod")}
                icon={<Truck className="h-5 w-5" />}
                title="Cash on Delivery"
                subtitle="Pay with cash when your order arrives."
              />
            ) : null}

            {settings.bkash.enabled ? (
              <PaymentOption
                active={method === "bkash"}
                onSelect={() => setMethod("bkash")}
                icon={<Smartphone className="h-5 w-5" />}
                title="bKash — Send Money"
                subtitle="Send money manually, then enter the Transaction ID."
              />
            ) : null}
          </div>

          {/* bKash instructions */}
          <AnimatePresence>
            {method === "bkash" ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-2xl border border-[#e2136e]/30 bg-[#e2136e]/5 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Send Money to ({settings.bkash.accountType})
                      </p>
                      <p className="font-display text-xl font-bold text-[#e2136e]">
                        {settings.bkash.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          settings.bkash.accountNumber,
                        );
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#e2136e] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy number
                        </>
                      )}
                    </button>
                  </div>

                  <ol className="mt-4 flex flex-col gap-1.5 text-sm">
                    {settings.bkash.instructions.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e2136e] text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-3 rounded-xl bg-background/60 px-3 py-2 text-sm">
                    Amount to send:{" "}
                    <strong>{formatPrice(total)}</strong> · Reference:{" "}
                    <strong>{orderNumber}</strong>
                  </div>

                  {settings.bkash.note ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      {settings.bkash.note}
                    </p>
                  ) : null}

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Your bKash number"
                      value={bkash.senderNumber}
                      onChange={(v) =>
                        setBkash((b) => ({ ...b, senderNumber: v }))
                      }
                      error={errors.senderNumber}
                      placeholder="01XXXXXXXXX"
                    />
                    <Field
                      label="Transaction ID (TrxID)"
                      value={bkash.trxId}
                      onChange={(v) => setBkash((b) => ({ ...b, trxId: v }))}
                      error={errors.trxId}
                      placeholder="e.g. 8N7A6B5C4D"
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>

      {/* Right: summary */}
      <aside className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:self-start">
        <div className="rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-bold">Order summary</h2>
          <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
            {items.map((i) => {
              const variant = i.product.variants?.find(
                (v) => v.id === i.variantId,
              );
              const cover = i.product.images[0];
              return (
                <li
                  key={`${i.product.id}-${i.variantId ?? "d"}`}
                  className="flex gap-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                      {i.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 font-medium">{i.product.name}</p>
                    {variant ? (
                      <p className="text-xs text-muted-foreground">
                        {variant.name}: {variant.value}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(i.product.price * i.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {coupon ? (
              <Row
                label={`Coupon (${coupon.code})`}
                value={`-${formatPrice(couponDiscount)}`}
                accent
              />
            ) : null}
            <Row
              label="Shipping"
              value={shipping === 0 ? "Free" : formatPrice(shipping)}
            />
            <div className="mt-1 flex items-baseline justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <Button
            type="submit"
            size="lg"
            className="mt-5 w-full"
            disabled={submitting}
          >
            {submitting
              ? "Placing order…"
              : method === "bkash"
                ? `Confirm bKash Order · ${formatPrice(total)}`
                : `Place Order (COD) · ${formatPrice(total)}`}
          </Button>
          {errors.submit ? (
            <p className="mt-3 text-center text-xs text-destructive">
              {errors.submit}
            </p>
          ) : null}
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By placing this order you agree to our terms & refund policy.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  className,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)} data-error={!!error}>
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(
          "h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          error ? "border-destructive" : "border-border",
        )}
      />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function PaymentOption({
  active,
  onSelect,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-brand bg-brand/5 ring-1 ring-brand"
          : "border-border hover:border-brand/50",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          active ? "bg-brand text-brand-foreground" : "bg-muted",
        )}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted-foreground">{subtitle}</span>
      </span>
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2",
          active ? "border-brand bg-brand" : "border-border",
        )}
      >
        {active ? <Check className="h-3 w-3 text-brand-foreground" /> : null}
      </span>
    </button>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "text-brand" : ""}>{value}</dd>
    </div>
  );
}

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  useAccount,
  type SavedAddress,
} from "@/components/account/account-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Draft = Omit<SavedAddress, "id">;

const emptyDraft: Draft = {
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  district: "",
  postcode: "",
  isDefault: false,
};

export function AccountAddresses() {
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } =
    useAccount();
  const [editing, setEditing] = React.useState<string | "new" | null>(null);
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const startNew = () => {
    setDraft(emptyDraft);
    setErrors({});
    setEditing("new");
  };

  const startEdit = (a: SavedAddress) => {
    const { id: _id, ...rest } = a;
    setDraft(rest);
    setErrors({});
    setEditing(a.id);
  };

  const set = (key: keyof Draft, value: string | boolean) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function validate() {
    const next: Record<string, string> = {};
    if (!draft.fullName.trim()) next.fullName = "Required";
    if (!/^01\d{9}$/.test(draft.phone.replace(/[\s-]/g, "")))
      next.phone = "Enter a valid 11-digit number";
    if (!draft.address.trim()) next.address = "Required";
    if (!draft.city.trim()) next.city = "Required";
    if (!draft.district.trim()) next.district = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function save() {
    if (!validate()) return;
    if (editing === "new") addAddress(draft);
    else if (editing) updateAddress(editing, draft);
    setEditing(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {addresses.length} saved address{addresses.length === 1 ? "" : "es"}
        </p>
        {editing === null ? (
          <Button onClick={startNew}>
            <Plus className="h-4 w-4" /> Add address
          </Button>
        ) : null}
      </div>

      <AnimatePresence>
        {editing !== null ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl bg-card p-6 shadow-soft"
          >
            <h3 className="mb-4 font-display text-lg font-bold">
              {editing === "new" ? "New address" : "Edit address"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label" value={draft.label} onChange={(v) => set("label", v)} placeholder="Home / Office" />
              <Field label="Full name" value={draft.fullName} onChange={(v) => set("fullName", v)} error={errors.fullName} />
              <Field label="Phone" value={draft.phone} onChange={(v) => set("phone", v)} error={errors.phone} placeholder="01XXXXXXXXX" />
              <Field label="Address" value={draft.address} onChange={(v) => set("address", v)} error={errors.address} className="sm:col-span-2" />
              <Field label="City / Area" value={draft.city} onChange={(v) => set("city", v)} error={errors.city} />
              <Field label="District" value={draft.district} onChange={(v) => set("district", v)} error={errors.district} />
              <Field label="Postcode (optional)" value={draft.postcode ?? ""} onChange={(v) => set("postcode", v)} />
              <label className="flex items-center gap-2.5 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.isDefault}
                  onChange={(e) => set("isDefault", e.target.checked)}
                  className="h-4 w-4 accent-brand"
                />
                Set as default address
              </label>
            </div>
            <div className="mt-5 flex gap-3">
              <Button onClick={save}>
                <Check className="h-4 w-4" /> Save address
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {addresses.length === 0 && editing === null ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-card py-16 text-center shadow-soft">
          <MapPin className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No addresses saved yet.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={cn(
              "relative rounded-2xl border bg-card p-5 shadow-soft",
              a.isDefault ? "border-brand" : "border-border",
            )}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                {a.label}
              </span>
              {a.isDefault ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                  <Star className="h-3 w-3 fill-current" /> Default
                </span>
              ) : null}
            </div>
            <p className="font-semibold">{a.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {a.address}, {a.city}, {a.district}
              {a.postcode ? ` - ${a.postcode}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">{a.phone}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {!a.isDefault ? (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(a.id)}
                  className="text-xs font-semibold text-brand hover:underline"
                >
                  Set default
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => startEdit(a)}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => removeAddress(a.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  className,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          error ? "border-destructive" : "border-border",
        )}
      />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

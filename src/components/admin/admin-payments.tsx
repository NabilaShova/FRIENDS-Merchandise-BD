"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, RotateCcw, Save, Smartphone, Truck } from "lucide-react";
import { useSettings } from "@/components/settings/settings-store";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Admin editor for the bKash "Send Money" instructions shown at checkout.
 * Changes persist to the settings store (localStorage in this demo).
 */
export function AdminPayments() {
  const { settings, hydrated, updateBkash, setCodEnabled, reset } = useSettings();

  // Local draft so the admin can edit then explicitly save.
  const [accountType, setAccountType] = React.useState(settings.bkash.accountType);
  const [accountNumber, setAccountNumber] = React.useState(
    settings.bkash.accountNumber,
  );
  const [instructions, setInstructions] = React.useState(
    settings.bkash.instructions.join("\n"),
  );
  const [note, setNote] = React.useState(settings.bkash.note);
  const [bkashEnabled, setBkashEnabled] = React.useState(settings.bkash.enabled);
  const [saved, setSaved] = React.useState(false);

  // Sync draft once settings hydrate from storage.
  React.useEffect(() => {
    if (!hydrated) return;
    setAccountType(settings.bkash.accountType);
    setAccountNumber(settings.bkash.accountNumber);
    setInstructions(settings.bkash.instructions.join("\n"));
    setNote(settings.bkash.note);
    setBkashEnabled(settings.bkash.enabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const steps = instructions
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  function save() {
    updateBkash({
      accountType,
      accountNumber,
      instructions: steps,
      note,
      enabled: bkashEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="heading-display text-2xl md:text-3xl">
          Payment Settings
        </h1>
        <p className="text-muted-foreground">
          Manage Cash on Delivery and bKash Send Money instructions shown at
          checkout.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Editor */}
        <div className="flex flex-col gap-6">
          {/* COD toggle */}
          <section className="rounded-2xl bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Truck className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold">Cash on Delivery</h2>
                  <p className="text-sm text-muted-foreground">
                    Let customers pay in cash on arrival.
                  </p>
                </div>
              </div>
              <Toggle
                checked={settings.codEnabled}
                onChange={(v) => setCodEnabled(v)}
              />
            </div>
          </section>

          {/* bKash editor */}
          <section className="rounded-2xl bg-card p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2136e]/10 text-[#e2136e]">
                  <Smartphone className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-semibold">bKash — Send Money</h2>
                  <p className="text-sm text-muted-foreground">
                    Manual payment with Transaction ID verification.
                  </p>
                </div>
              </div>
              <Toggle checked={bkashEnabled} onChange={setBkashEnabled} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Account type</span>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {["Personal", "Agent", "Merchant"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">bKash number</span>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                Step-by-step instructions
                <span className="font-normal text-muted-foreground">
                  {" "}
                  (one step per line)
                </span>
              </span>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={8}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="mt-4 flex flex-col gap-1.5">
              <span className="text-sm font-medium">Note (optional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={save}>
                <AnimatePresence mode="wait" initial={false}>
                  {saved ? (
                    <motion.span
                      key="saved"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" /> Saved
                    </motion.span>
                  ) : (
                    <motion.span
                      key="save"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" /> Save changes
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button variant="outline" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Reset to default
              </Button>
            </div>
          </section>
        </div>

        {/* Live preview */}
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Eye className="h-4 w-4" /> Checkout preview
            </p>
            <div className="rounded-2xl border border-[#e2136e]/30 bg-[#e2136e]/5 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Send Money to ({accountType})
              </p>
              <p className="font-display text-lg font-bold text-[#e2136e]">
                {accountNumber || "—"}
              </p>
              <ol className="mt-3 flex flex-col gap-1.5 text-sm">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e2136e] text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 rounded-lg bg-background/60 px-3 py-2 text-sm">
                Amount: <strong>{formatPrice(1290)}</strong> · Ref:{" "}
                <strong>FM-XXXXXX</strong>
              </div>
              {note ? (
                <p className="mt-3 text-xs text-muted-foreground">{note}</p>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-muted-foreground/30",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

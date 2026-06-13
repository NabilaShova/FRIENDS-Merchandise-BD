"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Save } from "lucide-react";
import { useAccount } from "@/components/account/account-store";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AccountProfile() {
  const { profile, hydrated, updateProfile } = useAccount();
  const { resolvedTheme, setTheme } = useTheme();

  const [fullName, setFullName] = React.useState(profile.fullName);
  const [email, setEmail] = React.useState(profile.email);
  const [phone, setPhone] = React.useState(profile.phone);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({ fullName, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <form onSubmit={save} className="flex max-w-xl flex-col gap-6">
      <section className="rounded-2xl bg-card p-6 shadow-soft">
        <h3 className="mb-4 font-display text-lg font-bold">Personal details</h3>
        <div className="grid gap-4">
          <Field label="Full name" value={fullName} onChange={setFullName} />
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field label="Phone" value={phone} onChange={setPhone} placeholder="01XXXXXXXXX" />
        </div>
      </section>

      <section className="flex items-center justify-between rounded-2xl bg-card p-6 shadow-soft">
        <div>
          <h3 className="font-display text-lg font-bold">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme.
          </p>
        </div>
        <div className="flex rounded-full border border-border p-1">
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                resolvedTheme === t
                  ? "bg-brand text-brand-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <div>
        <Button type="submit">
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
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

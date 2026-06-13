"use client";

import * as React from "react";
import { api } from "@/lib/api";
import {
  DEFAULT_SETTINGS,
  type BkashSettings,
  type Settings,
} from "@/lib/settings";

export type { BkashSettings, Settings } from "@/lib/settings";
export { DEFAULT_SETTINGS } from "@/lib/settings";

interface SettingsContextValue {
  settings: Settings;
  hydrated: boolean;
  updateBkash: (patch: Partial<BkashSettings>) => void;
  setCodEnabled: (value: boolean) => void;
  reset: () => void;
}

const SettingsContext = React.createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    api.settings
      .get()
      .then(setSettings)
      .catch(() => setSettings(DEFAULT_SETTINGS))
      .finally(() => setHydrated(true));
  }, []);

  // Persist to the shared server (admin only — storefront never calls these).
  const persist = React.useCallback((next: Settings) => {
    setSettings(next);
    api.settings.update(next).catch(() => {});
  }, []);

  const value: SettingsContextValue = {
    settings,
    hydrated,
    updateBkash: (patch) =>
      persist({ ...settings, bkash: { ...settings.bkash, ...patch } }),
    setCodEnabled: (codEnabled) => persist({ ...settings, codEnabled }),
    reset: () => persist(DEFAULT_SETTINGS),
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}

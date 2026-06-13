"use client";

import * as React from "react";

export interface Profile {
  fullName: string;
  email: string;
  phone: string;
  /** loyalty points — earned 1 per ৳100 spent in this demo */
  rewardPoints: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postcode?: string;
  isDefault: boolean;
}

const STORAGE_KEY = "fmbd.account.v1";

const DEFAULT_PROFILE: Profile = {
  fullName: "",
  email: "",
  phone: "",
  rewardPoints: 0,
};

interface AccountState {
  profile: Profile;
  addresses: SavedAddress[];
}

interface AccountContextValue extends AccountState {
  hydrated: boolean;
  updateProfile: (patch: Partial<Profile>) => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AccountContext = React.createContext<AccountContextValue | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AccountState>({
    profile: DEFAULT_PROFILE,
    addresses: [],
  });
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<AccountState>;
        setState({
          profile: { ...DEFAULT_PROFILE, ...parsed.profile },
          addresses: parsed.addresses ?? [],
        });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = React.useCallback((next: AccountState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const ensureSingleDefault = (addresses: SavedAddress[]): SavedAddress[] => {
    if (addresses.length && !addresses.some((a) => a.isDefault)) {
      return addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
    }
    return addresses;
  };

  const value: AccountContextValue = {
    ...state,
    hydrated,
    updateProfile: (patch) =>
      persist({ ...state, profile: { ...state.profile, ...patch } }),
    addAddress: (address) => {
      const isFirst = state.addresses.length === 0;
      const next = [
        ...state.addresses,
        { ...address, id: uid(), isDefault: address.isDefault || isFirst },
      ];
      persist({
        ...state,
        addresses: ensureSingleDefault(
          address.isDefault
            ? next.map((a, i) =>
                i === next.length - 1 ? a : { ...a, isDefault: false },
              )
            : next,
        ),
      });
    },
    updateAddress: (id, patch) =>
      persist({
        ...state,
        addresses: state.addresses.map((a) =>
          a.id === id ? { ...a, ...patch } : a,
        ),
      }),
    removeAddress: (id) =>
      persist({
        ...state,
        addresses: ensureSingleDefault(
          state.addresses.filter((a) => a.id !== id),
        ),
      }),
    setDefaultAddress: (id) =>
      persist({
        ...state,
        addresses: state.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      }),
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = React.useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within an AccountProvider");
  return ctx;
}

"use client";

import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/components/settings/settings-store";
import { AccountProvider } from "@/components/account/account-store";
import { WishlistProvider } from "@/components/wishlist/wishlist-store";
import { CartProvider } from "@/components/cart/cart-store";
import { CartDrawer } from "@/components/cart/cart-drawer";

/** Global client providers (theme, settings, account, wishlist, cart). */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider>
        <AccountProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </WishlistProvider>
        </AccountProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

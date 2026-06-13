import type { Metadata } from "next";
import { AccountNav } from "@/components/account/account-nav";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container pt-[calc(var(--nav-height)+2rem)]">
      <header className="mb-8">
        <h1 className="heading-display text-3xl md:text-4xl">My Account</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your orders, wishlist, addresses and profile.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:self-start">
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

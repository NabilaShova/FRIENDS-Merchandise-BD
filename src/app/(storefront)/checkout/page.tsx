import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Securely complete your FRIENDS Merchandise BD order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container pt-[calc(var(--nav-height)+2rem)]">
      <header className="mb-8">
        <h1 className="heading-display text-3xl md:text-4xl">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Guest checkout — no account required.
        </p>
      </header>
      <CheckoutView />
    </div>
  );
}

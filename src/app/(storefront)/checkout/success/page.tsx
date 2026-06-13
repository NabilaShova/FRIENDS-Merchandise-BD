import type { Metadata } from "next";
import { OrderSuccess } from "@/components/checkout/order-success";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <div className="container pt-[calc(var(--nav-height)+1rem)]">
      <OrderSuccess />
    </div>
  );
}

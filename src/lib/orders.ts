export type PaymentMethod = "cod" | "bkash";

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  postcode?: string;
  notes?: string;
}

export interface OrderLine {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  variant?: string;
  quantity: number;
}

export interface PlacedOrder {
  number: string;
  createdAt: string;
  items: OrderLine[];
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  /** bKash-only: sender number + transaction id supplied by the buyer */
  bkash?: { senderNumber: string; trxId: string };
  subtotal: number;
  shipping: number;
  total: number;
  coupon?: string;
  giftWrap: boolean;
  status: "pending_payment" | "pending" | "confirmed";
}

/** Human-friendly order number, e.g. FM-LZ4K9Q. */
export function generateOrderNumber() {
  return `FM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

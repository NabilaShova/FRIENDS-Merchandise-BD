/**
 * Tracks the order numbers placed from *this* browser so a guest can view their
 * own orders. The orders themselves live on the server; this is just the list
 * of "my" order numbers (no auth in the demo).
 */
const KEY = "fmbd.myOrders.v1";

export function addMyOrder(orderNumber: string) {
  if (typeof window === "undefined") return;
  const existing = getMyOrderNumbers();
  if (!existing.includes(orderNumber)) {
    localStorage.setItem(KEY, JSON.stringify([orderNumber, ...existing]));
  }
}

export function getMyOrderNumbers(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/** Store-wide settings shared by the storefront, checkout, and admin. */

export interface BkashSettings {
  /** Personal / Agent / Merchant */
  accountType: string;
  /** The number customers send money to */
  accountNumber: string;
  /** Step-by-step "Send Money" instructions */
  instructions: string[];
  /** Extra note shown under the steps */
  note: string;
  /** Toggle bKash on/off at checkout */
  enabled: boolean;
}

export interface Settings {
  bkash: BkashSettings;
  codEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  codEnabled: true,
  bkash: {
    enabled: true,
    accountType: "Personal",
    accountNumber: "01700-000000",
    instructions: [
      "Open your bKash app or dial *247#.",
      "Choose “Send Money”.",
      "Enter the number shown above as the receiver.",
      "Enter the exact order total as the amount.",
      "Use your Order Number as the reference.",
      "Enter your bKash PIN to confirm.",
      "Copy the Transaction ID (TrxID) and paste it below.",
    ],
    note: "Orders are confirmed once we verify your payment (usually within 1–2 hours during business hours).",
  },
};

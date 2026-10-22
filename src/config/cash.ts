export const RECIPIENTS = ["Main office", "Branch cashier"] as const;

export type CashRecipient = (typeof RECIPIENTS)[number];

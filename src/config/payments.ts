import { Banknote, Smartphone, Landmark, type LucideIcon } from "lucide-react";

/**
 * BUSINESS RULE:
 * Payment allocation priority order:
 * 1. Penalty (assessed late fees)
 * 2. Arrears (overdue instalments, oldest first)
 * 3. Scheduled (current due instalment)
 * Confirm with the product owner for regional regulatory adherence.
 */
export const ALLOCATION_ORDER = ["penalty", "arrears", "scheduled"] as const;

export const ALLOW_ADVANCE_PAYMENT = false;

export const MAX_BACKDATE_DAYS = 7;

export type PaymentMethod = "cash" | "upi" | "bank_transfer" | "withheld";

export interface PaymentMethodConfig {
  id: PaymentMethod;
  label: string;
  icon: LucideIcon;
  requiresReference: boolean;
  referencePlaceholder: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "cash",
    label: "Cash",
    icon: Banknote,
    requiresReference: false,
    referencePlaceholder: "Enter reference number (optional)",
  },
  {
    id: "upi",
    label: "UPI",
    icon: Smartphone, // Pure Lucide icon; no proprietary third-party logos
    requiresReference: true,
    referencePlaceholder: "Enter UPI transaction ID / UTR",
  },
  {
    id: "bank_transfer",
    label: "Bank transfer",
    icon: Landmark,
    requiresReference: true,
    referencePlaceholder: "Enter bank reference / IMPS number",
  },
];

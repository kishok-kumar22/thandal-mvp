import type { Frequency } from "@/lib/loan";

/**
 * Admin-facing display names for instalment frequencies.
 */
export const INSTALMENT_NAME: Record<Frequency, string> = {
  daily: "Daily instalment",
  weekly: "Weekly instalment",
  monthly: "Monthly instalment",
};

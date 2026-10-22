import type { Frequency } from "@/lib/calendar";

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  withheld: "Disbursement deduction",
  cash: "Cash payment",
  upi: "UPI payment",
  bank_transfer: "Bank transfer",
};

export interface CustomerRemarkInput {
  method?: string;
  status?: string;
  allocation?: {
    toPenalty?: number;
    toArrears?: number;
    toScheduled?: number;
  };
}

/**
 * Returns a customer-safe remark template.
 * Never leaks internal notes, agent comments, or staff reasons.
 */
export function customerRemark(receipt: CustomerRemarkInput): string {
  const method = (receipt.method || "").toLowerCase();
  const status = (receipt.status || "").toLowerCase();
  const penalty = receipt.allocation?.toPenalty || 0;

  let base = "Instalment received";
  if (method === "withheld") {
    base = "Loan disbursed, first instalment deducted";
  } else if (status === "partial" || status === "part_paid") {
    base = "Part payment received";
  }

  if (penalty > 0) {
    base += ` (includes penalty ₹${penalty})`;
  }

  return base;
}

export const INSTALMENT_LABEL: Record<Frequency, string> = {
  daily: "Daily instalment amount",
  weekly: "Weekly instalment amount",
  monthly: "Monthly instalment amount",
};

export function getInstalmentLabel(frequency: string): string {
  const f = frequency.toLowerCase() as Frequency;
  return INSTALMENT_LABEL[f] || "Instalment amount";
}

export function getInterestTypeLabel(loan: { interestMethod?: string; ratePercent?: number; interest?: number; principal?: number }): string {
  // Built from loan's method, rate, and basis
  const rate = loan.ratePercent || (loan.principal && loan.interest ? Math.round((loan.interest / loan.principal) * 100) : 5);
  return `Flat ${rate}% (entire term)`;
}

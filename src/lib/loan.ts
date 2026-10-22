export type LoanStatus = "active" | "pending" | "overdue" | "completed" | "closed";

export type Frequency = "daily" | "weekly" | "monthly";

export type RateBasis = "entire_loan_term" | "per_month" | "per_annum";

export type InterestMethod = "flat" | "reducing_balance";

export type PenaltyPolicy = "standard" | "none" | "custom";

export type PaymentMethod = "cash" | "bank_transfer" | "upi";

export interface LoanDraft {
  customerId: string;
  product: string;
  principal: number;
  ratePercent: number;
  rateBasis: RateBasis;
  interestMethod: InterestMethod;
  frequency: Frequency;
  term: number; // total instalments
  firstDueDate: string; // ISO date string YYYY-MM-DD
  agentId: string;
  penaltyPolicy: PenaltyPolicy;
  collectFirstAtDisbursement: boolean;
  paymentMethod: PaymentMethod;
  disbursementDate: string; // ISO date string YYYY-MM-DD
  reference: string;
  scheduleDates?: string[];
}

export interface LoanCalculation {
  principal: number;
  ratePercent: number;
  totalInterest: number;
  totalRepayment: number;
  instalment: number;
  term: number;
  firstInstalmentWithheld: number;
  netCash: number;
  remainingToCollect: number;
  remainingInstalments: number;
}

export interface ScheduleItem {
  instalmentNumber: number;
  dueDate: string; // formatted e.g. "21 Oct 2026"
  dueDateIso: string; // YYYY-MM-DD
  amount: number;
  status: "Paid at disbursement" | "Pending" | "Paid" | "Overdue";
  remarks?: string;
}

export interface CalculateLoanParams {
  principal: number;
  ratePercent: number;
  term: number;
  frequency?: Frequency;
  collectFirstAtDisbursement?: boolean;
}

/**
 * Calculates loan financials using integer rupees (no floating point drift).
 * 
 * Rules:
 * - totalInterest = Math.round((principal * ratePercent) / 100)
 * - totalRepayment = principal + totalInterest
 * - instalment = Math.round(totalRepayment / term)
 * - If collectFirstAtDisbursement:
 *     firstInstalmentWithheld = instalment
 *     netCash = principal - instalment
 *     remainingToCollect = totalRepayment - instalment
 *     remainingInstalments = term - 1
 * - Else:
 *     firstInstalmentWithheld = 0
 *     netCash = principal
 *     remainingToCollect = totalRepayment
 *     remainingInstalments = term
 */
export function calculateLoan({
  principal,
  ratePercent,
  term,
  collectFirstAtDisbursement = true,
}: CalculateLoanParams): LoanCalculation {
  const p = Math.max(0, Math.round(principal));
  const r = Math.max(0, ratePercent);
  const t = Math.max(1, Math.round(term));

  const totalInterest = Math.round((p * r) / 100);
  const totalRepayment = p + totalInterest;
  const instalment = Math.round(totalRepayment / t);

  if (collectFirstAtDisbursement) {
    const firstInstalmentWithheld = instalment;
    const netCash = p - firstInstalmentWithheld;
    const remainingToCollect = totalRepayment - instalment;
    const remainingInstalments = t - 1;

    return {
      principal: p,
      ratePercent: r,
      totalInterest,
      totalRepayment,
      instalment,
      term: t,
      firstInstalmentWithheld,
      netCash,
      remainingToCollect,
      remainingInstalments,
    };
  }

  return {
    principal: p,
    ratePercent: r,
    totalInterest,
    totalRepayment,
    instalment,
    term: t,
    firstInstalmentWithheld: 0,
    netCash: p,
    remainingToCollect: totalRepayment,
    remainingInstalments: t,
  };
}

/**
 * Helper to add calendar months and clamp to the month's last day.
 * Example: 31 Jan + 1 month -> 28 Feb (or 29 Feb in leap year).
 */
export function addMonthsClamped(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const originalDay = date.getDate();
  const targetMonth = d.getMonth() + months;
  d.setDate(1);
  d.setMonth(targetMonth);

  const daysInTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(originalDay, daysInTargetMonth));
  return d;
}

/**
 * Formats a Date object to "DD MMM YYYY", e.g. "21 Oct 2026"
 */
export function formatDateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface BuildScheduleParams {
  principal: number;
  ratePercent: number;
  term: number;
  frequency: Frequency;
  firstDueDate: string; // YYYY-MM-DD or parseable date string
  collectFirstAtDisbursement?: boolean;
  scheduleDates?: string[];
}

/**
 * Builds the complete repayment schedule.
 * Any rounding discrepancies are adjusted on the LAST instalment
 * so the sum of all instalments precisely equals totalRepayment.
 */
export function buildSchedule({
  principal,
  ratePercent,
  term,
  frequency,
  firstDueDate,
  collectFirstAtDisbursement = true,
  scheduleDates,
}: BuildScheduleParams): ScheduleItem[] {
  const calc = calculateLoan({ principal, ratePercent, term, collectFirstAtDisbursement });
  const items: ScheduleItem[] = [];

  // Parse start date safely
  const baseDate = new Date(firstDueDate);
  if (isNaN(baseDate.getTime())) {
    baseDate.setTime(Date.now());
  }

  let accumulated = 0;

  for (let i = 1; i <= calc.term; i++) {
    let dueDateObj: Date;

    if (scheduleDates && scheduleDates[i - 1]) {
      const isoStr = scheduleDates[i - 1];
      const [y, m, d] = isoStr.split("-").map(Number);
      dueDateObj = new Date(Date.UTC(y, m - 1, d));
    } else if (frequency === "daily") {
      dueDateObj = new Date(baseDate.getTime());
      dueDateObj.setDate(baseDate.getDate() + (i - 1));
    } else if (frequency === "weekly") {
      dueDateObj = new Date(baseDate.getTime());
      dueDateObj.setDate(baseDate.getDate() + (i - 1) * 7);
    } else {
      // monthly
      dueDateObj = addMonthsClamped(baseDate, i - 1);
    }

    // Last instalment absorbs any remainder
    let amount: number;
    if (i === calc.term) {
      amount = calc.totalRepayment - accumulated;
    } else {
      amount = calc.instalment;
      accumulated += amount;
    }

    const isFirstAndWithheld = i === 1 && collectFirstAtDisbursement;

    items.push({
      instalmentNumber: i,
      dueDate: formatDateDisplay(dueDateObj),
      dueDateIso: formatDateIso(dueDateObj),
      amount,
      status: isFirstAndWithheld ? "Paid at disbursement" : "Pending",
      remarks: isFirstAndWithheld ? "Deducted at disbursement" : undefined,
    });
  }

  return items;
}

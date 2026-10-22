import { buildSchedule, type ScheduleItem, type LoanDraft } from "./loan";
import type { LoanItem } from "@/data/mockLoans";
import type { Receipt } from "@/data/mockReceipts";
import { todayIso } from "./clock";

export interface ScheduleRow {
  instalmentNumber: number;
  dueDate: string;      // e.g. "21 Oct 2026"
  dueDateIso: string;   // e.g. "2026-10-21"
  principal: number;    // e.g. 100
  interest: number;     // e.g. 5
  dueAmount: number;    // e.g. 105
  paidAmount: number;   // e.g. 105, 50, 0
  status: "paid_at_disbursement" | "paid" | "partial" | "pending" | "upcoming" | "overdue";
  receiptNo?: string;
  paidAt?: string;
}

export interface BuildScheduleRowsParams {
  loan: LoanItem | LoanDraft | {
    id?: string;
    principal: number;
    interest?: number;
    ratePercent?: number;
    term: number;
    frequency: any;
    firstDueDate: string;
    collectFirstAtDisbursement?: boolean;
    scheduleDates?: string[];
  };
  receipts?: Receipt[];
  today?: string;
  detailed?: boolean;
}

/**
 * Builds the comprehensive schedule rows for a loan, computing principal/interest breakdown,
 * payment allocations, and deterministic statuses.
 */
export function buildScheduleRows({
  loan,
  receipts = [],
  today = todayIso(),
  detailed = false,
}: BuildScheduleRowsParams): ScheduleRow[] {
  const loanAny = loan as any;
  const principal = loan.principal || 5000;
  const interest = loanAny.interest !== undefined ? loanAny.interest : Math.round((principal * (loanAny.ratePercent || 5)) / 100);
  const term = loan.term || 50;
  const collectFirst = loanAny.collectFirstAtDisbursement !== false;

  const baseItems: ScheduleItem[] = buildSchedule({
    principal,
    ratePercent: loanAny.interest && principal ? Math.round((loanAny.interest / principal) * 100) : (loanAny.ratePercent || 5),
    term,
    frequency: loan.frequency || "daily",
    firstDueDate: loan.firstDueDate || "2026-10-21",
    collectFirstAtDisbursement: collectFirst,
    scheduleDates: loan.scheduleDates,
  });

  // Calculate per-instalment principal and interest portions
  const basePrincipalPerInstalment = Math.floor(principal / term);
  const baseInterestPerInstalment = Math.floor(interest / term);

  let allocatedPrincipal = 0;
  let allocatedInterest = 0;

  const rows: ScheduleRow[] = baseItems.map((item, idx) => {
    let pPortion: number;
    let iPortion: number;

    if (idx === term - 1) {
      pPortion = principal - allocatedPrincipal;
      iPortion = interest - allocatedInterest;
    } else {
      pPortion = basePrincipalPerInstalment;
      iPortion = item.amount - pPortion;
      allocatedPrincipal += pPortion;
      allocatedInterest += iPortion;
    }

    return {
      instalmentNumber: item.instalmentNumber,
      dueDate: item.dueDate,
      dueDateIso: item.dueDateIso,
      principal: pPortion,
      interest: iPortion,
      dueAmount: item.amount,
      paidAmount: 0,
      status: "pending",
    };
  });

  // 1. Handle disbursement deduction (Instalment 1)
  const withheldReceipt = receipts.find((r) => r.method === "withheld");
  if (collectFirst && rows.length > 0) {
    rows[0].paidAmount = rows[0].dueAmount;
    rows[0].status = detailed ? "paid_at_disbursement" : "paid";
    if (withheldReceipt) {
      rows[0].receiptNo = withheldReceipt.receiptNo;
      rows[0].paidAt = withheldReceipt.paidAt;
    }
  }

  // 2. Allocate non-withheld payments
  const nonWithheldReceipts = receipts
    .filter((r) => r.method !== "withheld")
    .sort((a, b) => new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime());

  let currentInstalmentIndex = collectFirst ? 1 : 0;

  for (const rc of nonWithheldReceipts) {
    // Determine payment portion allocated to scheduled instalments
    let availableAmount = rc.allocation?.toScheduled ?? rc.amount;

    while (availableAmount > 0 && currentInstalmentIndex < rows.length) {
      const row = rows[currentInstalmentIndex];
      const needed = row.dueAmount - row.paidAmount;

      if (availableAmount >= needed) {
        row.paidAmount = row.dueAmount;
        row.status = "paid";
        row.receiptNo = rc.receiptNo;
        row.paidAt = rc.paidAt;
        availableAmount -= needed;
        currentInstalmentIndex++;
      } else {
        row.paidAmount += availableAmount;
        row.status = "partial";
        row.receiptNo = rc.receiptNo;
        row.paidAt = rc.paidAt;
        availableAmount = 0;
      }
    }
  }

  // 3. Assign statuses for unpaid / remaining instalments
  for (const row of rows) {
    if (row.paidAmount === row.dueAmount) {
      // Already marked paid or paid_at_disbursement
      continue;
    }

    if (row.paidAmount > 0) {
      row.status = "partial";
      continue;
    }

    // Zero paid
    if (row.dueDateIso === today) {
      row.status = "pending";
    } else if (row.dueDateIso < today) {
      row.status = "overdue";
    } else {
      row.status = "upcoming";
    }
  }

  return rows;
}

import type { LoanItem } from "@/data/mockLoans";
import type { Receipt } from "@/data/mockReceipts";
import { type ScheduleRow, buildScheduleRows } from "./schedule";
import { getInterestTypeLabel } from "@/config/customerLabels";

export interface NextDueInfo {
  dueOn: string;
  dueOnIso: string;
  amount: number;
  isOverdue: boolean;
  isPartial: boolean;
}

export interface LoanOverview {
  principal: number;
  interest: number;
  total: number;
  paid: number;
  remaining: number;
  instalment: number;
  term: number;
  interestType: string;
  netCashDisbursed: number;
  firstInstalmentLabel: "First Instalment Paid On" | "First Due Date";
  firstInstalmentDate: string;
  paidCount: number;
  nextDue: NextDueInfo | null;
}

/**
 * Pure calculation function that produces comprehensive loan figures and next due details.
 */
export function getLoanOverview(
  loan: LoanItem,
  scheduleRows: ScheduleRow[],
  receipts: Receipt[] = [],
  today = "2026-10-22"
): LoanOverview {
  const principal = loan.principal;
  const interest = loan.interest;
  const total = principal + interest;

  const paid = scheduleRows.reduce((sum, r) => sum + r.paidAmount, 0);
  const remaining = Math.max(0, total - paid);

  const isWithheld = loan.collectFirstAtDisbursement !== false;
  const firstInstalmentAmount = scheduleRows[0]?.dueAmount || loan.instalment;
  const netCashDisbursed = isWithheld ? principal - firstInstalmentAmount : principal;

  const firstInstalmentLabel: "First Instalment Paid On" | "First Due Date" = isWithheld
    ? "First Instalment Paid On"
    : "First Due Date";

  const firstInstalmentDate = isWithheld ? (loan.disbursedOn || "21 Oct 2026") : (loan.firstDueDate || "21 Oct 2026");

  const paidCount = scheduleRows.filter((r) => r.paidAmount >= r.dueAmount).length;

  const firstUnpaidRow = scheduleRows.find((r) => r.paidAmount < r.dueAmount);
  let nextDue: NextDueInfo | null = null;

  if (firstUnpaidRow) {
    const unpaidBalance = firstUnpaidRow.dueAmount - firstUnpaidRow.paidAmount;
    nextDue = {
      dueOn: firstUnpaidRow.dueDate,
      dueOnIso: firstUnpaidRow.dueDateIso,
      amount: unpaidBalance,
      isOverdue: firstUnpaidRow.dueDateIso < today,
      isPartial: firstUnpaidRow.paidAmount > 0,
    };
  }

  return {
    principal,
    interest,
    total,
    paid,
    remaining,
    instalment: loan.instalment,
    term: loan.term,
    interestType: getInterestTypeLabel(loan),
    netCashDisbursed,
    firstInstalmentLabel,
    firstInstalmentDate,
    paidCount,
    nextDue,
  };
}

// ----------------------------------------------------------------------------
// PLAIN TYPESCRIPT RUNTIME ASSERTIONS (Requirement 5 verification)
// ----------------------------------------------------------------------------
function runLoanOverviewAssertions(): void {
  const seedLoan: LoanItem = {
    id: "LN-1052",
    customerId: "C-001",
    customerName: "R.Kumar",
    principal: 5000,
    interest: 250,
    remaining: 5145,
    frequency: "daily",
    status: "active",
    agent: "Selvam",
    term: 50,
    instalment: 105,
    disbursedOn: "21 Oct 2026",
    firstDueDate: "21 Oct 2026",
  };

  const seedRc0001: Receipt = {
    receiptNo: "RC-0001",
    paymentId: "PAY-0001",
    loanId: "LN-1052",
    customerId: "C-001",
    agentId: "A-001",
    collectedBy: "Admin",
    amount: 105,
    method: "withheld",
    paidAt: "2026-10-21T09:00:00+05:30",
    scheduledDue: 105,
    remainingBalance: 0,
    status: "paid",
    allocation: { toPenalty: 0, toArrears: 0, toScheduled: 105 },
  };

  // Case 1: Before any new payment at 22 Oct 2026
  const rowsBefore = buildScheduleRows({
    loan: seedLoan,
    receipts: [seedRc0001],
    today: "2026-10-22",
    detailed: true,
  });
  const overviewBefore = getLoanOverview(seedLoan, rowsBefore, [seedRc0001], "2026-10-22");

  if (
    overviewBefore.paid !== 105 ||
    overviewBefore.remaining !== 5145 ||
    overviewBefore.netCashDisbursed !== 4895 ||
    !overviewBefore.nextDue ||
    overviewBefore.nextDue.dueOn !== "22 Oct 2026" ||
    overviewBefore.nextDue.amount !== 105 ||
    overviewBefore.nextDue.isPartial !== false ||
    overviewBefore.paidCount !== 1
  ) {
    throw new Error(`Loan overview assertion 1 failed: ${JSON.stringify(overviewBefore)}`);
  }

  // Case 2: After a ₹50 cash payment (RC-0021)
  const seedRc0021: Receipt = {
    receiptNo: "RC-0021",
    paymentId: "PAY-0021",
    loanId: "LN-1052",
    customerId: "C-001",
    agentId: "A-001",
    collectedBy: "Selvam",
    amount: 50,
    method: "cash",
    paidAt: "2026-10-22T10:30:00+05:30",
    scheduledDue: 105,
    remainingBalance: 55,
    status: "partial",
    allocation: { toPenalty: 0, toArrears: 0, toScheduled: 50 },
  };

  const rowsAfter = buildScheduleRows({
    loan: seedLoan,
    receipts: [seedRc0001, seedRc0021],
    today: "2026-10-22",
    detailed: true,
  });
  const overviewAfter = getLoanOverview(seedLoan, rowsAfter, [seedRc0001, seedRc0021], "2026-10-22");

  if (
    overviewAfter.paid !== 155 ||
    overviewAfter.remaining !== 5095 ||
    !overviewAfter.nextDue ||
    overviewAfter.nextDue.dueOn !== "22 Oct 2026" ||
    overviewAfter.nextDue.amount !== 55 ||
    overviewAfter.nextDue.isPartial !== true
  ) {
    throw new Error(`Loan overview assertion 2 failed: ${JSON.stringify(overviewAfter)}`);
  }
}

// Execute runtime assertions
runLoanOverviewAssertions();

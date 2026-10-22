import { mockReceiptsList, type Receipt } from "@/data/mockReceipts";
import { mockLoansList, type LoanItem } from "@/data/mockLoans";
import { mockAgentsList } from "@/data/mockAgents";
import { mockCollectionTasks } from "@/data/mockCollections";
import { mockCashEntriesList } from "@/data/mockCash";
import { mockHandoversList } from "@/data/mockHandovers";
import { isWithinRange } from "./dates";
import { splitPercentages } from "./format";
import { getOpeningCash } from "./cashbook";
import type { PaymentMethod } from "@/config/payments";

export interface CollectionsReportFilter {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  branchId?: string;
  agentId?: string;
}

export interface PaymentModeRow {
  method: "cash" | "upi" | "bank_transfer";
  label: string;
  amount: number;
  percentage: number;
}

export interface CollectionsReportData {
  total: number;
  byMethod: PaymentModeRow[];
  excludedWithheld: number;
  from: string;
  to: string;
}

/**
 * Computes Collection Summary Report purely from immutable receipts.
 *
 * Seed reconciliation check (21-22 Oct 2026):
 * - Cash: ₹3,000 (71.43%)
 * - UPI: ₹1,200 (28.57%)
 * - Total: ₹4,200 (100.00%)
 * - Excluded withheld: ₹105 (RC-0001)
 */
export function getCollectionsReport(filter: CollectionsReportFilter): CollectionsReportData {
  const { from, to, branchId, agentId } = filter;

  // Agent to branch map
  const agentBranchMap = new Map<string, string>();
  mockAgentsList.forEach((a) => {
    agentBranchMap.set(a.id, a.branchId);
  });

  let cashTotal = 0;
  let upiTotal = 0;
  let bankTotal = 0;
  let excludedWithheld = 0;

  mockReceiptsList.forEach((r) => {
    // Exclude withheld disbursement amounts
    if (r.method === "withheld") {
      if (isWithinRange(r.paidAt, from, to)) {
        excludedWithheld += r.amount;
      }
      return;
    }

    // Date range check (inclusive, Asia/Kolkata)
    if (!isWithinRange(r.paidAt, from, to)) {
      return;
    }

    // Agent filter
    if (agentId && agentId !== "all" && r.agentId !== agentId) {
      return;
    }

    // Branch filter
    if (branchId && branchId !== "all") {
      const branch = agentBranchMap.get(r.agentId);
      if (branch !== branchId) return;
    }

    if (r.method === "cash") {
      cashTotal += r.amount;
    } else if (r.method === "upi") {
      upiTotal += r.amount;
    } else if (r.method === "bank_transfer") {
      bankTotal += r.amount;
    }
  });

  const total = cashTotal + upiTotal + bankTotal;

  // Build rows for non-zero methods only
  const rowsRaw: { method: "cash" | "upi" | "bank_transfer"; label: string; amount: number }[] = [];
  if (cashTotal > 0) rowsRaw.push({ method: "cash", label: "Cash", amount: cashTotal });
  if (upiTotal > 0) rowsRaw.push({ method: "upi", label: "UPI", amount: upiTotal });
  if (bankTotal > 0) rowsRaw.push({ method: "bank_transfer", label: "Bank transfer", amount: bankTotal });

  const percentages = splitPercentages(rowsRaw.map((r) => r.amount));

  const byMethod: PaymentModeRow[] = rowsRaw.map((r, i) => ({
    ...r,
    percentage: percentages[i] ?? 0,
  }));

  return {
    total,
    byMethod,
    excludedWithheld,
    from,
    to,
  };
}

// ----------------------------------------------------
// OTHER REPORTS DATA HELPERS
// ----------------------------------------------------

export interface LoanPortfolioReportData {
  activeLoansCount: number;
  outstandingPrincipal: number;
  disbursedInPeriod: number;
  overdueLoansCount: number;
  byStatus: { status: string; count: number; totalAmount: number; remainingAmount: number }[];
  byFrequency: { frequency: string; count: number; totalAmount: number; remainingAmount: number }[];
}

export function getLoanPortfolioReport(filter: CollectionsReportFilter): LoanPortfolioReportData {
  const { from, to } = filter;

  let activeCount = 0;
  let outstanding = 0;
  let disbursed = 0;
  let overdueCount = 0;

  const statusMap = new Map<string, { count: number; total: number; remaining: number }>();
  const freqMap = new Map<string, { count: number; total: number; remaining: number }>();

  mockLoansList.forEach((loan) => {
    const isDisbursedInPeriod = isWithinRange(loan.disbursedOn || "2026-10-21", from, to);
    if (isDisbursedInPeriod) {
      disbursed += loan.principal;
    }

    if (loan.status === "active") {
      activeCount++;
      outstanding += loan.remaining || loan.principal;
    } else if (loan.status === "overdue") {
      overdueCount++;
      outstanding += loan.remaining || loan.principal;
    }

    const totalLoanVal = loan.principal + loan.interest;

    // Group by status
    const sGroup = statusMap.get(loan.status) || { count: 0, total: 0, remaining: 0 };
    sGroup.count++;
    sGroup.total += totalLoanVal;
    sGroup.remaining += loan.remaining || 0;
    statusMap.set(loan.status, sGroup);

    // Group by frequency
    const fGroup = freqMap.get(loan.frequency) || { count: 0, total: 0, remaining: 0 };
    fGroup.count++;
    fGroup.total += totalLoanVal;
    fGroup.remaining += loan.remaining || 0;
    freqMap.set(loan.frequency, fGroup);
  });

  return {
    activeLoansCount: activeCount,
    outstandingPrincipal: outstanding,
    disbursedInPeriod: disbursed,
    overdueLoansCount: overdueCount,
    byStatus: Array.from(statusMap.entries()).map(([status, d]) => ({
      status,
      count: d.count,
      totalAmount: d.total,
      remainingAmount: d.remaining,
    })),
    byFrequency: Array.from(freqMap.entries()).map(([frequency, d]) => ({
      frequency,
      count: d.count,
      totalAmount: d.total,
      remainingAmount: d.remaining,
    })),
  };
}

export interface AgeingBucketRow {
  bucket: string;
  loansCount: number;
  customersCount: number;
  arrears: number;
  penalty: number;
  total: number;
}

export function getOverdueAgeingReport(_asOfDate: string = "2026-10-22"): {
  buckets: AgeingBucketRow[];
  totals: AgeingBucketRow;
} {
  // Buckets: 1-7 days, 8-30 days, 31-60 days, 61+ days
  const buckets: AgeingBucketRow[] = [
    { bucket: "1 – 7 days", loansCount: 3, customersCount: 3, arrears: 1050, penalty: 150, total: 1200 },
    { bucket: "8 – 30 days", loansCount: 1, customersCount: 1, arrears: 1500, penalty: 400, total: 1900 },
    { bucket: "31 – 60 days", loansCount: 0, customersCount: 0, arrears: 0, penalty: 0, total: 0 },
    { bucket: "61+ days", loansCount: 0, customersCount: 0, arrears: 0, penalty: 0, total: 0 },
  ];

  const totals = buckets.reduce(
    (acc, b) => ({
      bucket: "Total",
      loansCount: acc.loansCount + b.loansCount,
      customersCount: acc.customersCount + b.customersCount,
      arrears: acc.arrears + b.arrears,
      penalty: acc.penalty + b.penalty,
      total: acc.total + b.total,
    }),
    { bucket: "Total", loansCount: 0, customersCount: 0, arrears: 0, penalty: 0, total: 0 }
  );

  return { buckets, totals };
}

export interface AgentPerformanceRow {
  agentId: string;
  agentName: string;
  customersCount: number;
  receiptsCount: number;
  collectedAmount: number;
  cashAmount: number;
  nonCashAmount: number;
  overdueCustomers: number;
}

export function getAgentPerformanceReport(filter: CollectionsReportFilter): {
  rows: AgentPerformanceRow[];
  total: AgentPerformanceRow;
} {
  const { from, to } = filter;

  const agentStats = new Map<
    string,
    {
      name: string;
      receipts: number;
      collected: number;
      cash: number;
      nonCash: number;
    }
  >();

  mockAgentsList.forEach((a) => {
    agentStats.set(a.id, {
      name: a.name,
      receipts: 0,
      collected: 0,
      cash: 0,
      nonCash: 0,
    });
  });

  mockReceiptsList.forEach((r) => {
    if (r.method === "withheld") return;
    if (!isWithinRange(r.paidAt, from, to)) return;

    const stats = agentStats.get(r.agentId) || {
      name: r.agentName || r.collectedBy,
      receipts: 0,
      collected: 0,
      cash: 0,
      nonCash: 0,
    };

    stats.receipts++;
    stats.collected += r.amount;
    if (r.method === "cash") {
      stats.cash += r.amount;
    } else {
      stats.nonCash += r.amount;
    }
    agentStats.set(r.agentId, stats);
  });

  const rows: AgentPerformanceRow[] = Array.from(agentStats.entries()).map(([id, d]) => ({
    agentId: id,
    agentName: d.name,
    customersCount: id === "A-001" ? 12 : id === "A-002" ? 6 : 0,
    receiptsCount: d.receipts,
    collectedAmount: d.collected,
    cashAmount: d.cash,
    nonCashAmount: d.nonCash,
    overdueCustomers: id === "A-001" ? 3 : 1,
  }));

  const total = rows.reduce(
    (acc, r) => ({
      agentId: "all",
      agentName: "Total",
      customersCount: acc.customersCount + r.customersCount,
      receiptsCount: acc.receiptsCount + r.receiptsCount,
      collectedAmount: acc.collectedAmount + r.cashAmount + r.nonCashAmount,
      cashAmount: acc.cashAmount + r.cashAmount,
      nonCashAmount: acc.nonCashAmount + r.nonCashAmount,
      overdueCustomers: acc.overdueCustomers + r.overdueCustomers,
    }),
    {
      agentId: "all",
      agentName: "Total",
      customersCount: 0,
      receiptsCount: 0,
      collectedAmount: 0,
      cashAmount: 0,
      nonCashAmount: 0,
      overdueCustomers: 0,
    }
  );

  return { rows, total };
}

export interface InterestPenaltiesData {
  interestDue: number;
  interestCollected: number;
  penaltiesAssessed: number;
  penaltiesWaived: number;
  penaltiesCollected: number;
}

export function getInterestPenaltiesReport(_filter: CollectionsReportFilter): InterestPenaltiesData {
  return {
    interestDue: 4500,
    interestCollected: 4200,
    penaltiesAssessed: 850,
    penaltiesWaived: 200,
    penaltiesCollected: 400,
  };
}

export interface CashReconRow {
  agentId: string;
  agentName: string;
  openingCash: number;
  cashCollected: number;
  acceptedHandovers: number;
  pendingHandovers: number;
  outstanding: number;
  checkStatus: "Matches" | string;
}

export function getCashReconciliationReport(date: string = "2026-10-22"): {
  rows: CashReconRow[];
  allMatch: boolean;
} {
  const agents = [
    { id: "A-001", name: "Selvam" },
    { id: "A-002", name: "Karthik" },
  ];

  let allMatch = true;

  const rows: CashReconRow[] = agents.map((agent) => {
    const opening = getOpeningCash(agent.id, date);

    // Sum cash receipts for date
    let receiptCash = 0;
    mockReceiptsList.forEach((r) => {
      if (r.agentId === agent.id && r.method === "cash" && r.paidAt.slice(0, 10) === date) {
        receiptCash += r.amount;
      }
    });

    // Sum ledger collections for date
    let ledgerCash = 0;
    let accepted = 0;
    mockCashEntriesList.forEach((ce) => {
      if (ce.agentId === agent.id && ce.at.slice(0, 10) === date) {
        if (ce.kind === "collection") ledgerCash += ce.amount;
        if (ce.kind === "handover" && ce.amount < 0) accepted += Math.abs(ce.amount);
      }
    });

    const pending = mockHandoversList
      .filter((h) => h.agentId === agent.id && h.status === "pending_review")
      .reduce((sum, h) => sum + h.reportedAmount, 0);

    const outstanding = opening + ledgerCash - accepted;

    // Reconciliation check: receiptCash vs ledgerCash
    const diff = ledgerCash - receiptCash;
    const checkStatus = diff === 0 ? "Matches" : `Mismatch ₹${Math.abs(diff)}`;
    if (diff !== 0) allMatch = false;

    return {
      agentId: agent.id,
      agentName: agent.name,
      openingCash: opening,
      cashCollected: ledgerCash,
      acceptedHandovers: accepted,
      pendingHandovers: pending,
      outstanding,
      checkStatus,
    };
  });

  return { rows, allMatch };
}

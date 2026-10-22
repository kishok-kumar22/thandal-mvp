import { mockCashEntriesList, type CashEntry } from "@/data/mockCash";
import { mockHandoversList, type Handover } from "@/data/mockHandovers";

export interface CashSummary {
  cashReceived: number; // Sum of positive collections on that date
  acceptedHandovers: number; // Sum of accepted handovers on that date (absolute positive value)
  cashOutstanding: number; // Cumulative net cash in hand up to that date (total collections - total accepted handovers)
}

export interface LedgerRowView extends CashEntry {
  inAmount: number;
  outAmount: number;
  runningBalance: number;
  agentName?: string;
}

/**
 * Derives difference between actual received cash and reported handover amount.
 * difference = actual - reported
 */
export function handoverDifference(actual: number, reported: number): number {
  return Math.round(actual) - Math.round(reported);
}

/**
 * Computes running cash summary for a given date and optional agent filter.
 * All figures derived dynamically from the append-only ledger.
 */
export function getCashSummary(filter: { date?: string; agentId?: string }): CashSummary {
  const targetDate = filter.date || "2026-10-22";
  const agentId = filter.agentId && filter.agentId !== "all" ? filter.agentId : undefined;

  let cashReceived = 0;
  let acceptedHandovers = 0;

  // Entries for the specific date
  mockCashEntriesList.forEach((entry) => {
    if (agentId && entry.agentId !== agentId) return;

    const entryDate = entry.at.slice(0, 10);
    if (entryDate === targetDate) {
      if (entry.kind === "collection" && entry.amount > 0) {
        cashReceived += entry.amount;
      } else if (entry.kind === "handover" && entry.amount < 0) {
        acceptedHandovers += Math.abs(entry.amount);
      }
    }
  });

  // Cumulative outstanding balance up to the end of targetDate
  let cashOutstanding = 0;
  mockCashEntriesList.forEach((entry) => {
    if (agentId && entry.agentId !== agentId) return;

    const entryDate = entry.at.slice(0, 10);
    if (entryDate <= targetDate) {
      cashOutstanding += entry.amount; // collections are +, accepted handovers are -
    }
  });

  return {
    cashReceived: Math.max(0, cashReceived),
    acceptedHandovers: Math.max(0, acceptedHandovers),
    cashOutstanding: Math.max(0, cashOutstanding),
  };
}

/**
 * Returns an agent's cumulative net cash balance up to a date/timestamp.
 */
export function getAgentCashBalance(agentId: string, upToIso?: string): number {
  const upTo = upToIso || "2026-10-22T23:59:59+05:30";

  let balance = 0;
  mockCashEntriesList.forEach((entry) => {
    if (entry.agentId === agentId && entry.at <= upTo) {
      balance += entry.amount;
    }
  });

  return Math.max(0, balance);
}

/**
 * Returns opening cash: cumulative balance before the start of the date (00:00:00+05:30).
 */
export function getOpeningCash(agentId: string, date: string): number {
  const startOfDay = `${date}T00:00:00+05:30`;
  let balance = 0;
  mockCashEntriesList.forEach((entry) => {
    if (entry.agentId === agentId && entry.at < startOfDay) {
      balance += entry.amount;
    }
  });
  return Math.max(0, balance);
}

/**
 * Returns available cash: cumulative balance up to the end of the date
 * minus the sum of that agent's pending_review handovers.
 */
export function getAvailableForHandover(agentId: string, date?: string): number {
  const targetDate = date || "2026-10-22";
  const endOfDay = `${targetDate}T23:59:59+05:30`;

  let netBalance = 0;
  mockCashEntriesList.forEach((entry) => {
    if (entry.agentId === agentId && entry.at <= endOfDay) {
      netBalance += entry.amount;
    }
  });

  const pendingCommitted = mockHandoversList
    .filter((h) => h.agentId === agentId && h.status === "pending_review")
    .reduce((sum, h) => sum + h.reportedAmount, 0);

  return Math.max(0, netBalance - pendingCommitted);
}

/**
 * Returns available cash in hand that is NOT already locked in a pending handover.
 */
export function getAgentAvailableHandoverCash(agentId: string): number {
  return getAvailableForHandover(agentId);
}

/**
 * Retrieves ledger entries for a date and agent with running balance calculated oldest to newest.
 */
export function getLedger(filter: { date?: string; agentId?: string }): {
  rows: LedgerRowView[];
  totalIn: number;
  totalOut: number;
} {
  const targetDate = filter.date || "2026-10-22";
  const agentId = filter.agentId && filter.agentId !== "all" ? filter.agentId : undefined;

  // Filter entries
  const matching = mockCashEntriesList.filter((entry) => {
    if (agentId && entry.agentId !== agentId) return false;
    const entryDate = entry.at.slice(0, 10);
    return entryDate === targetDate;
  });

  // Sort ascending by timestamp to calculate running balance
  const sorted = [...matching].sort((a, b) => a.at.localeCompare(b.at));

  let running = 0;
  let totalIn = 0;
  let totalOut = 0;

  const rows: LedgerRowView[] = sorted.map((entry) => {
    const inAmount = entry.amount > 0 ? entry.amount : 0;
    const outAmount = entry.amount < 0 ? Math.abs(entry.amount) : 0;
    totalIn += inAmount;
    totalOut += outAmount;
    running += entry.amount;

    return {
      ...entry,
      inAmount,
      outAmount,
      runningBalance: running,
      agentName: entry.agentId === "A-001" ? "Selvam" : entry.agentId,
    };
  });

  return {
    rows,
    totalIn,
    totalOut,
  };
}

/**
 * Returns pending review handovers.
 */
export function getPendingHandovers(agentId?: string): Handover[] {
  return mockHandoversList.filter((h) => {
    if (h.status !== "pending_review") return false;
    if (agentId && agentId !== "all" && h.agentId !== agentId) return false;
    return true;
  });
}

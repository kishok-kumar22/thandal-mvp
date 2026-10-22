import { mockReceiptsList, type Receipt } from "./mockReceipts";

export type CashEntryKind = "collection" | "handover" | "adjustment";

export interface CashEntry {
  id: string; // e.g. "CE-001"
  at: string; // ISO string with offset
  agentId: string;
  kind: CashEntryKind;
  amount: number; // Signed integer rupees: collections positive (+), accepted handovers negative (-)
  refId?: string; // Receipt number (RC-####) or Handover ID (H-###)
  note?: string;
}

/**
 * Derives cash collection ledger entries deterministically from cash receipts.
 * The ledger is APPEND-ONLY: records are never edited or deleted; corrections are new 'adjustment' entries.
 */
function deriveInitialCashLedger(): CashEntry[] {
  const entries: CashEntry[] = [];
  let counter = 1;

  // 1. Map all cash receipts to positive collection entries
  const cashReceipts = mockReceiptsList.filter((r) => r.method === "cash");

  // Sort chronologically
  cashReceipts.sort((a, b) => a.paidAt.localeCompare(b.paidAt));

  for (const r of cashReceipts) {
    entries.push({
      id: `CE-${String(counter++).padStart(3, "0")}`,
      at: r.paidAt,
      agentId: r.agentId,
      kind: "collection",
      amount: r.amount,
      refId: r.receiptNo,
      note: r.notes || `Instalment collection for ${r.loanId}`,
    });
  }

  // 2. Add accepted handover H-001 (-₹2,000 on 22 Oct at 09:45)
  entries.push({
    id: `CE-${String(counter++).padStart(3, "0")}`,
    at: "2026-10-22T09:45:00+05:30",
    agentId: "A-001",
    kind: "handover",
    amount: -2000,
    refId: "H-001",
    note: "Deposit accepted at Main office vault",
  });

  return entries;
}

export const mockCashEntriesList: CashEntry[] = deriveInitialCashLedger();

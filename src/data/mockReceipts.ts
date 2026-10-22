import type { PaymentMethod } from "@/config/payments";

export interface Receipt {
  receiptNo: string; // e.g. "RC-0001", "RC-0021"
  paymentId: string;
  loanId: string;
  customerId: string;
  customerName?: string;
  agentId: string;
  agentName?: string;
  collectedBy: string; // User/agent name who recorded it
  amount: number;
  method: PaymentMethod;
  paidAt: string; // ISO string with +05:30
  scheduledDue: number;
  remainingBalance: number;
  status: "paid" | "partial";
  reference?: string;
  notes?: string;
  allocation: {
    toPenalty: number;
    toArrears: number;
    toScheduled: number;
  };
  isDemo?: boolean; // Demo-only flag (delete when real data exists)
}

/**
 * Builds deterministic portfolio demo receipts RC-0003 to RC-0020.
 * Reconciles report numbers:
 * - 10 Cash receipts by Selvam on 22 Oct 2026: nine of ₹300, one of ₹150 = ₹2,850.
 *   Plus RC-0002 (₹150 cash, 22 Oct) = ₹3,000 Total Cash on 22 Oct.
 * - 8 UPI receipts of ₹150 each = ₹1,200 Total UPI:
 *   - 4 on 21 Oct 2026 by Karthik (A-002)
 *   - 4 on 22 Oct 2026 by Selvam (A-001)
 * Grand Total collections (21-22 Oct): ₹4,200 (Cash 71.43%, UPI 28.57%).
 * NOTE: Delete when real data exists.
 */
export function buildDemoReceipts(): Receipt[] {
  const receipts: Receipt[] = [];

  // 10 Cash receipts on 22 Oct 2026 by Selvam (A-001) for LN-1001 through LN-1010
  for (let i = 1; i <= 10; i++) {
    const num = i + 2; // RC-0003 to RC-0012
    const rcNo = `RC-${String(num).padStart(4, "0")}`;
    const loanNo = `LN-${1000 + i}`;
    const custNo = `C-${100 + i}`;
    const amount = i === 10 ? 150 : 300; // Nine of 300, one of 150 = 2850
    const padIndex = String(i).padStart(2, "0");

    receipts.push({
      receiptNo: rcNo,
      paymentId: `PAY-${String(num).padStart(4, "0")}`,
      loanId: loanNo,
      customerId: custNo,
      customerName: `Demo Customer ${padIndex}`,
      agentId: "A-001",
      agentName: "Selvam",
      collectedBy: "Selvam",
      amount,
      method: "cash",
      paidAt: `2026-10-22T08:${String(10 + i).padStart(2, "0")}:00+05:30`,
      scheduledDue: amount,
      remainingBalance: 0,
      status: "paid",
      notes: "Daily instalment collection",
      allocation: {
        toPenalty: 0,
        toArrears: 0,
        toScheduled: amount,
      },
      isDemo: true,
    });
  }

  // 4 UPI receipts on 21 Oct 2026 by Karthik (A-002) for LN-1011 through LN-1014 (RC-0013 to RC-0016)
  for (let i = 11; i <= 14; i++) {
    const num = i + 2;
    const rcNo = `RC-${String(num).padStart(4, "0")}`;
    const loanNo = `LN-${1000 + i}`;
    const custNo = `C-${100 + i}`;
    const padIndex = String(i).padStart(2, "0");

    receipts.push({
      receiptNo: rcNo,
      paymentId: `PAY-${String(num).padStart(4, "0")}`,
      loanId: loanNo,
      customerId: custNo,
      customerName: `Demo Customer ${padIndex}`,
      agentId: "A-002",
      agentName: "Karthik",
      collectedBy: "Karthik",
      amount: 150,
      method: "upi",
      paidAt: `2026-10-21T14:${String(10 + i).padStart(2, "0")}:00+05:30`,
      scheduledDue: 150,
      remainingBalance: 0,
      status: "paid",
      reference: `UPI-REF-210${i - 10}`,
      notes: "Customer direct UPI collection",
      allocation: {
        toPenalty: 0,
        toArrears: 0,
        toScheduled: 150,
      },
      isDemo: true,
    });
  }

  // 4 UPI receipts on 22 Oct 2026 by Selvam (A-001) for LN-1015 through LN-1018 (RC-0017 to RC-0020)
  for (let i = 15; i <= 18; i++) {
    const num = i + 2;
    const rcNo = `RC-${String(num).padStart(4, "0")}`;
    const loanNo = `LN-${1000 + i}`;
    const custNo = `C-${100 + i}`;
    const padIndex = String(i).padStart(2, "0");

    receipts.push({
      receiptNo: rcNo,
      paymentId: `PAY-${String(num).padStart(4, "0")}`,
      loanId: loanNo,
      customerId: custNo,
      customerName: `Demo Customer ${padIndex}`,
      agentId: "A-001",
      agentName: "Selvam",
      collectedBy: "Selvam",
      amount: 150,
      method: "upi",
      paidAt: `2026-10-22T11:${String(10 + i).padStart(2, "0")}:00+05:30`,
      scheduledDue: 150,
      remainingBalance: 0,
      status: "paid",
      reference: `UPI-REF-220${i - 14}`,
      notes: "QR code digital collection",
      allocation: {
        toPenalty: 0,
        toArrears: 0,
        toScheduled: 150,
      },
      isDemo: true,
    });
  }

  return receipts;
}

/**
 * Seed receipts: Immutable once created.
 * RC-0001 (disbursement withholding, method: "withheld", excluded from collection reports)
 * RC-0002 (real loan payment, ₹150 cash on 22 Oct)
 * RC-0003 through RC-0020 (reconciled demo portfolio collections)
 * NEXT receipt starts at RC-0021.
 */
export const mockReceiptsList: Receipt[] = [
  {
    receiptNo: "RC-0001",
    paymentId: "PAY-0001",
    loanId: "LN-1052",
    customerId: "C-001",
    customerName: "R. Kumar",
    agentId: "A-001",
    agentName: "Selvam",
    collectedBy: "Admin",
    amount: 105,
    method: "withheld",
    paidAt: "2026-10-21T09:00:00+05:30",
    scheduledDue: 105,
    remainingBalance: 0,
    status: "paid",
    reference: "DISB-WITHHELD-01",
    notes: "First instalment collected at disbursement",
    allocation: {
      toPenalty: 0,
      toArrears: 0,
      toScheduled: 105,
    },
  },
  {
    receiptNo: "RC-0002",
    paymentId: "PAY-0002",
    loanId: "LN-1053",
    customerId: "C-002",
    customerName: "S. Priya",
    agentId: "A-001",
    agentName: "Selvam",
    collectedBy: "Selvam",
    amount: 150,
    method: "cash",
    paidAt: "2026-10-22T09:15:00+05:30",
    scheduledDue: 150,
    remainingBalance: 0,
    status: "paid",
    reference: undefined,
    notes: "Morning field collection",
    allocation: {
      toPenalty: 0,
      toArrears: 0,
      toScheduled: 150,
    },
  },
  ...buildDemoReceipts(),
];

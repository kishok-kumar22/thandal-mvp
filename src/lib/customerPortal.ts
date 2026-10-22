import "server-only";
import { notFound } from "next/navigation";
import type { SessionUser } from "@/config/auth";
import { can } from "@/lib/permissions";
import { mockLoansList, type LoanItem } from "@/data/mockLoans";
import { mockReceiptsList, type Receipt } from "@/data/mockReceipts";
import { mockCustomersList } from "@/data/mockCustomers";
import { normaliseRef } from "@/lib/format";
import { buildScheduleRows, type ScheduleRow } from "./schedule";
import { getLoanOverview, type LoanOverview } from "./loanOverview";
import { PAYMENT_TYPE_LABELS, customerRemark } from "@/config/customerLabels";

export interface CustomerLoanView {
  id: string;
  customerId: string;
  customerName: string;
  status: LoanItem["status"];
  frequency: LoanItem["frequency"];
  agentFirstName: string;
  disbursedOn: string;
  firstDueDate: string;
  scheduleDates?: string[];
  overview: LoanOverview;
}

export interface CustomerReceiptSummary {
  receiptNo: string;
  loanId: string;
  amount: number;
  paidAt: string;
  paidDateFormatted: string;
  method: string;
  paymentTypeLabel: string;
  status: "paid" | "partial";
  statusLabel: string;
  remark: string;
  agentFirstName: string;
}

export interface CustomerReceiptDetail extends CustomerReceiptSummary {
  customerId: string;
  customerName: string;
  agentName: string; // first name only
  scheduledDue: number;
  remainingBalance: number;
  allocation: {
    toPenalty: number;
    toArrears: number;
    toCurrentDue: number;
  };
  reference?: string;
}

export interface CustomerPaymentRow {
  receiptNo: string;
  amount: number;
  paymentDate: string;
  type: string;
  remarks: string;
}

function getAgentFirstName(agentField?: string): string {
  if (!agentField) return "Selvam";
  return agentField.trim().split(/\s+/)[0];
}

function formatDateDisplay(isoOrStr: string): string {
  const d = new Date(isoOrStr);
  if (isNaN(d.getTime())) return isoOrStr;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Returns all disbursed loans owned by the authenticated customer.
 * Pending / unapproved loans are strictly omitted.
 */
export async function getMyLoans(user: SessionUser): Promise<CustomerLoanView[]> {
  const customerId = user.customerId || "C-001";
  if (!can(user, "view_loans", { customerId })) {
    return [];
  }

  const rawLoans = mockLoansList.filter(
    (l) =>
      l.customerId === customerId &&
      ["active", "overdue", "completed", "closed"].includes(l.status)
  );

  return rawLoans.map((loan) => {
    const loanReceipts = mockReceiptsList.filter((r) => r.loanId === loan.id);
    const scheduleRows = buildScheduleRows({
      loan,
      receipts: loanReceipts,
      detailed: true,
    });
    const overview = getLoanOverview(loan, scheduleRows, loanReceipts);

    return {
      id: loan.id,
      customerId: loan.customerId,
      customerName: loan.customerName,
      status: loan.status,
      frequency: loan.frequency,
      agentFirstName: getAgentFirstName(loan.agent),
      disbursedOn: loan.disbursedOn,
      firstDueDate: loan.firstDueDate,
      scheduleDates: loan.scheduleDates,
      overview,
    };
  });
}

/**
 * Retrieves a single disbursed loan owned by the authenticated customer.
 * Returns notFound() if the loan does not exist or does not belong to the customer.
 */
export async function getMyLoan(
  user: SessionUser,
  rawLoanId: string
): Promise<{ loan: CustomerLoanView; scheduleRows: ScheduleRow[]; receipts: CustomerReceiptSummary[] }> {
  const customerId = user.customerId || "C-001";
  const canonicalId = normaliseRef(rawLoanId);

  const loan = mockLoansList.find(
    (l) =>
      normaliseRef(l.id) === canonicalId &&
      l.customerId === customerId &&
      ["active", "overdue", "completed", "closed"].includes(l.status)
  );

  if (!loan || !can(user, "view_loans", { customerId })) {
    notFound();
  }

  const loanReceipts = mockReceiptsList.filter((r) => normaliseRef(r.loanId) === canonicalId);
  const scheduleRows = buildScheduleRows({
    loan,
    receipts: loanReceipts,
    detailed: true,
  });
  const overview = getLoanOverview(loan, scheduleRows, loanReceipts);

  const safeReceipts: CustomerReceiptSummary[] = loanReceipts
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .map((r) => ({
      receiptNo: r.receiptNo,
      loanId: r.loanId,
      amount: r.amount,
      paidAt: r.paidAt,
      paidDateFormatted: formatDateDisplay(r.paidAt),
      method: r.method,
      paymentTypeLabel: PAYMENT_TYPE_LABELS[r.method] || "Payment",
      status: r.status,
      statusLabel: r.status === "partial" ? "Part paid" : "Recorded",
      remark: customerRemark(r),
      agentFirstName: getAgentFirstName(r.agentName || r.collectedBy),
    }));

  return {
    loan: {
      id: loan.id,
      customerId: loan.customerId,
      customerName: loan.customerName,
      status: loan.status,
      frequency: loan.frequency,
      agentFirstName: getAgentFirstName(loan.agent),
      disbursedOn: loan.disbursedOn,
      firstDueDate: loan.firstDueDate,
      scheduleDates: loan.scheduleDates,
      overview,
    },
    scheduleRows,
    receipts: safeReceipts,
  };
}

/**
 * Queries the customer's own receipts with optional search and pagination.
 */
export async function getMyReceipts(
  user: SessionUser,
  filters?: { q?: string; loanId?: string; page?: number; pageSize?: number }
): Promise<{
  receipts: CustomerReceiptSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const customerId = user.customerId || "C-001";
  if (!can(user, "view_loans", { customerId })) {
    return { receipts: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  }

  let list = mockReceiptsList.filter((r) => r.customerId === customerId);

  // Filter by loan if specified
  if (filters?.loanId && filters.loanId !== "all") {
    const canonicalLoan = normaliseRef(filters.loanId);
    list = list.filter((r) => normaliseRef(r.loanId) === canonicalLoan);
  }

  // Search filter
  if (filters?.q && filters.q.trim()) {
    const rawQ = filters.q.trim().toLowerCase();
    const normQ = normaliseRef(rawQ);
    list = list.filter(
      (r) =>
        normaliseRef(r.receiptNo).includes(normQ) ||
        normaliseRef(r.loanId).includes(normQ) ||
        r.receiptNo.toLowerCase().includes(rawQ) ||
        r.loanId.toLowerCase().includes(rawQ)
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

  const total = list.length;
  const page = Math.max(1, filters?.page || 1);
  const pageSize = Math.max(1, filters?.pageSize || 10);
  const totalPages = Math.ceil(total / pageSize);

  const paginated = list.slice((page - 1) * pageSize, page * pageSize);

  const safeReceipts: CustomerReceiptSummary[] = paginated.map((r) => ({
    receiptNo: r.receiptNo,
    loanId: r.loanId,
    amount: r.amount,
    paidAt: r.paidAt,
    paidDateFormatted: formatDateDisplay(r.paidAt),
    method: r.method,
    paymentTypeLabel: PAYMENT_TYPE_LABELS[r.method] || "Payment",
    status: r.status,
    statusLabel: r.status === "partial" ? "Part paid" : "Recorded",
    remark: customerRemark(r),
    agentFirstName: getAgentFirstName(r.agentName || r.collectedBy),
  }));

  return {
    receipts: safeReceipts,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Retrieves payment history rows for a specific customer loan.
 */
export async function getMyPayments(
  user: SessionUser,
  rawLoanId: string,
  options?: { page?: number; pageSize?: number }
): Promise<{
  payments: CustomerPaymentRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const { receipts } = await getMyLoan(user, rawLoanId);

  const rows: CustomerPaymentRow[] = receipts.map((r) => ({
    receiptNo: r.receiptNo,
    amount: r.amount,
    paymentDate: r.paidDateFormatted,
    type: r.paymentTypeLabel,
    remarks: r.remark,
  }));

  const total = rows.length;
  const page = Math.max(1, options?.page || 1);
  const pageSize = Math.max(1, options?.pageSize || 10);
  const totalPages = Math.ceil(total / pageSize);
  const paginated = rows.slice((page - 1) * pageSize, page * pageSize);

  return {
    payments: paginated,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Retrieves a single customer receipt.
 * Returns notFound() if foreign or missing.
 */
export async function getMyReceipt(user: SessionUser, rawReceiptNo: string): Promise<CustomerReceiptDetail> {
  const customerId = user.customerId || "C-001";
  const canonicalNo = normaliseRef(rawReceiptNo);

  const receipt = mockReceiptsList.find(
    (r) => normaliseRef(r.receiptNo) === canonicalNo && r.customerId === customerId
  );

  if (!receipt || !can(user, "view_loans", { customerId })) {
    notFound();
  }

  const agentFirst = getAgentFirstName(receipt.agentName || receipt.collectedBy);

  return {
    receiptNo: receipt.receiptNo,
    loanId: receipt.loanId,
    customerId: receipt.customerId,
    customerName: receipt.customerName || user.name || "Customer",
    amount: receipt.amount,
    paidAt: receipt.paidAt,
    paidDateFormatted: formatDateDisplay(receipt.paidAt),
    method: receipt.method,
    paymentTypeLabel: PAYMENT_TYPE_LABELS[receipt.method] || "Payment",
    status: receipt.status,
    statusLabel: receipt.status === "partial" ? "Part paid" : "Recorded",
    remark: customerRemark(receipt),
    agentFirstName: agentFirst,
    agentName: agentFirst,
    scheduledDue: receipt.scheduledDue,
    remainingBalance: receipt.remainingBalance,
    allocation: {
      toPenalty: receipt.allocation?.toPenalty || 0,
      toArrears: receipt.allocation?.toArrears || 0,
      toCurrentDue: (receipt.allocation as any)?.toScheduled || 0,
    },
    reference: receipt.reference,
  };
}

export interface CustomerProfileView {
  customerId: string;
  id: string;
  name: string;
  mobile: string; // raw 10 digits
  area: string;
  city: string;
  agentFirstName?: string;
  customerSince?: string;
}

/**
 * Retrieves customer profile view model.
 * Never includes street address, agent mobile, or internal IDs.
 */
export async function getMyProfile(user: SessionUser): Promise<CustomerProfileView> {
  const customerId = user.customerId || "C-001";
  const customer = mockCustomersList.find((c) => c.id === customerId);

  const rawMobile = (customer?.mobile || "9876543210").replace(/\D/g, "").slice(-10);

  let area = "Anna Nagar";
  let city = "Chennai";
  if (customer?.currentAddress) {
    const cleaned = customer.currentAddress.split(/[–-]/)[0].trim();
    const parts = cleaned.split(",").map((s) => s.trim());
    if (parts.length >= 2) {
      area = parts[0];
      city = parts[1];
    } else if (parts.length === 1) {
      area = parts[0];
    }
  }

  const agentFirst = getAgentFirstName(customer?.assignedAgent);

  return {
    customerId,
    id: customerId,
    name: customer?.name || user.name || "R. Kumar",
    mobile: rawMobile,
    area,
    city,
    agentFirstName: agentFirst || undefined,
    customerSince: customer?.customerSince,
  };
}

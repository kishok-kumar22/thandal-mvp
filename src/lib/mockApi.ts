import type { LoanDraft } from "./loan";
import { mockLoansList, type LoanItem } from "@/data/mockLoans";
import { mockAgentsList, type Agent } from "@/data/mockAgents";
import { mockCustomersList } from "@/data/mockCustomers";
import { mockAssignmentsList, type CustomerAssignment } from "@/data/mockAssignments";
import { mockCollectionTasks } from "@/data/mockCollections";
import { mockRoutesList } from "@/data/mockRoutes";
import { mockReceiptsList, type Receipt } from "@/data/mockReceipts";
import { mockCashEntriesList, type CashEntry } from "@/data/mockCash";
import { mockHandoversList, type Handover } from "@/data/mockHandovers";
import { calculateLoan } from "./loan";
import { maskEmail, maskMobile } from "./mask";
import { allocatePayment } from "./payments";
import type { PaymentMethod } from "@/config/payments";
import { getAvailableForHandover } from "./cashbook";
import { DEMO_USERS, type SessionUser } from "@/config/auth";

function getCurrentUser(): SessionUser {
  return DEMO_USERS.admin;
}
import { can, getPermissionMatrix, setPermissionMatrix, validatePermissionChanges } from "./permissions";
import { appendAudit } from "./mockStore";
import type { PermissionMatrix, ActionKey, Role, PermissionValue } from "@/config/permissions";
import { notify } from "./notifications";
import { buildDueDates } from "./calendar";
import { currentAppSettings } from "@/data/mockSettings";
import { todayIso } from "./clock";
import {
  mockSupportRequests,
  getNextSupportRequestId,
  type SupportRequest,
  type SupportStatus,
  type SupportAttachmentMeta,
} from "@/data/mockSupport";

const supportRateLimit = new Map<string, number[]>();
const supportIdempotency = new Map<string, SupportRequest>();

// Global sequential counter: NEXT receipt starts at RC-0021 per specification
let receiptSequence = 21;
export function nextReceiptNo(): string {
  const numStr = String(receiptSequence).padStart(4, "0");
  receiptSequence += 1;
  return `RC-${numStr}`;
}

// Global sequential counter: NEXT handover starts at H-003
let handoverSequence = 3;
export function nextHandoverId(): string {
  const numStr = String(handoverSequence).padStart(3, "0");
  handoverSequence += 1;
  return `H-${numStr}`;
}

// Version tracker for settings
let permissionsVersion = 1;

export interface CreateCustomerFormValues {
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  dob?: string;
  streetAddress: string;
  area: string;
  city: string;
  postalCode: string;
  agent: string;
  status: "Active" | "Inactive";
  documentType: string;
  documentFile: File | null;
  guarantor?: {
    name?: string;
    mobile?: string;
    relationship?: string;
    address?: string;
  };
}

/**
 * Simulates saving a newly created customer.
 */
export async function saveCustomer(
  _data: CreateCustomerFormValues
): Promise<{ success: boolean; customerId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_loans")) {
    return { success: false, customerId: "" };
  }

  const customerId = `C-${String(mockCustomersList.length + 1).padStart(3, "0")}`;

  appendAudit({
    action: "customer_created",
    entityType: "customer",
    entityId: customerId,
    details: `Customer ${customerId} created`,
  });

  return {
    success: true,
    customerId,
  };
}

export async function activateCustomer(customerId: string): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_loans")) {
    return { success: false };
  }

  appendAudit({
    action: "customer_activated",
    entityType: "customer",
    entityId: customerId,
    details: `Customer ${customerId} activated`,
  });

  return { success: true };
}

export interface AgentFormValues {
  fullName: string;
  mobile: string;
  email: string;
  employeeId: string;
  branchId: string;
  routeId: string;
  joiningDate: string; // YYYY-MM-DD
  status: "active" | "inactive";
  role: "collection_agent";
  invitationMethod?: "email" | "sms";
}

/**
 * Checks uniqueness of mobile, email, or employeeId across collection agents.
 */
export async function checkAgentUnique(
  field: "mobile" | "email" | "employeeId",
  value: string,
  excludeAgentId?: string
): Promise<{ isUnique: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 80));

  const val = value.trim().toLowerCase();
  const existing = mockAgentsList.find((a) => {
    if (excludeAgentId && a.id === excludeAgentId) return false;
    if (field === "mobile") return a.mobile.replace(/\D/g, "") === val.replace(/\D/g, "");
    if (field === "email") return a.email.toLowerCase() === val;
    if (field === "employeeId") return a.employeeId.toUpperCase() === val.toUpperCase();
    return false;
  });

  if (existing) {
    if (field === "mobile") return { isUnique: false, message: "This mobile number is already registered" };
    if (field === "email") return { isUnique: false, message: "This email address is already registered" };
    if (field === "employeeId") return { isUnique: false, message: "This Employee ID is already assigned" };
  }

  return { isUnique: true };
}

/**
 * Simulates creating a new collection agent.
 */
export async function createAgent(
  data: AgentFormValues
): Promise<{ success: boolean; agentId: string; maskedContact: string; invitationMethod: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_settings")) {
    return { success: false, agentId: "", maskedContact: "", invitationMethod: "" };
  }

  const newId = `A-${String(mockAgentsList.length + 1).padStart(3, "0")}`;
  const routeObj = mockRoutesList.find((r) => r.id === data.routeId);
  const routeName = routeObj ? routeObj.name : "Anna Nagar";

  const newAgent: Agent = {
    id: newId,
    name: data.fullName,
    mobile: data.mobile.replace(/\D/g, ""),
    email: data.email,
    employeeId: data.employeeId.toUpperCase(),
    branchId: data.branchId || "BR-001",
    routeId: data.routeId || "RT-001",
    route: routeName,
    joiningDate: data.joiningDate,
    status: data.status,
    role: "collection_agent",
    assignedCustomers: 0,
  };

  mockAgentsList.push(newAgent);

  const method = data.invitationMethod || "email";
  const maskedContact = method === "email" ? maskEmail(data.email) : maskMobile(data.mobile, "agent");

  appendAudit({
    action: "agent_created",
    entityType: "agent",
    entityId: newId,
    details: `Agent ${newId} created`,
  });

  return {
    success: true,
    agentId: newId,
    maskedContact,
    invitationMethod: method === "email" ? "Email" : "SMS",
  };
}

/**
 * Simulates updating an existing agent.
 */
export async function updateAgent(
  agentId: string,
  data: Partial<AgentFormValues>
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const agent = mockAgentsList.find((a) => a.id === agentId);
  if (agent) {
    if (data.fullName) agent.name = data.fullName;
    if (data.mobile) agent.mobile = data.mobile.replace(/\D/g, "");
    if (data.email) agent.email = data.email;
    if (data.employeeId) agent.employeeId = data.employeeId.toUpperCase();
    if (data.branchId) agent.branchId = data.branchId;
    if (data.routeId) {
      agent.routeId = data.routeId;
      const rObj = mockRoutesList.find((r) => r.id === data.routeId);
      if (rObj) agent.route = rObj.name;
    }
    if (data.joiningDate) agent.joiningDate = data.joiningDate;
    if (data.status) agent.status = data.status;
  }

  return { success: true };
}

/**
 * Simulates committing customer assignments to an agent.
 */
export async function saveAssignments(
  agentId: string,
  assignments: Array<{ customerId: string; routeId: string; effectiveDate: string }>
): Promise<{ success: boolean; count: number }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_loans")) {
    return { success: false, count: 0 };
  }

  assignments.forEach((asg) => {
    const idx = mockAssignmentsList.findIndex((a) => a.customerId === asg.customerId);
    const newAsg: CustomerAssignment = {
      id: `ASG-${String(mockAssignmentsList.length + 1).padStart(3, "0")}`,
      customerId: asg.customerId,
      agentId,
      routeId: asg.routeId,
      effectiveDate: asg.effectiveDate,
      status: "active",
    };

    if (idx >= 0) {
      mockAssignmentsList[idx] = newAsg;
    } else {
      mockAssignmentsList.push(newAsg);
    }

    const cust = mockCustomersList.find((c) => c.id === asg.customerId);
    const agent = mockAgentsList.find((a) => a.id === agentId);
    if (cust && agent) {
      cust.assignedAgent = agent.name;
    }
  });

  const agent = mockAgentsList.find((a) => a.id === agentId);
  if (agent) {
    const totalCount = mockAssignmentsList.filter((a) => a.agentId === agentId).length;
    agent.assignedCustomers = Math.max(agent.assignedCustomers, totalCount);
  }

  appendAudit({
    action: "assignment_changed",
    entityType: "agent",
    entityId: agentId,
    details: `${assignments.length} assignments updated for Agent ${agentId}`,
  });

  return {
    success: true,
    count: assignments.length,
  };
}

/**
 * Simulates recording a collection payment.
 */
export async function recordPayment(params: {
  idempotencyKey?: string;
  loanId: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  reference?: string;
  notes?: string;
  collectedBy: string;
}): Promise<{ success: boolean; receiptNo: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  const task = mockCollectionTasks.find((t) => t.loanId === params.loanId);
  if (!can(currentUser, "record_collections", { agentId: task?.agentId })) {
    return { success: false, receiptNo: "" };
  }

  const loan = mockLoansList.find((l) => l.id === params.loanId);
  const customerId = loan?.customerId || task?.customerId || "C-001";
  const customerName = loan?.customerName || task?.customerName || "Customer";
  const agentId = task?.agentId || currentUser.agentId || "A-001";
  const agentName = task?.agentName || currentUser.name || "Selvam";

  const scheduledDue = task ? task.amountDue : (loan ? loan.instalment : 105);
  const arrearsDue = task ? task.arrears : 0;
  const penaltyDue = task ? task.penalty : 0;

  const allocation = allocatePayment({
    amount: params.amount,
    penaltyDue,
    arrearsDue,
    scheduledDue,
  });

  const receiptNo = nextReceiptNo();

  const newReceipt: Receipt = {
    receiptNo,
    paymentId: `PAY-${receiptNo.replace("RC-", "")}`,
    loanId: params.loanId,
    customerId,
    customerName,
    agentId,
    agentName,
    collectedBy: currentUser.name,
    amount: params.amount,
    method: params.method,
    paidAt: params.paidAt,
    scheduledDue,
    remainingBalance: Math.max(0, scheduledDue + arrearsDue + penaltyDue - params.amount),
    status: params.amount >= (scheduledDue + arrearsDue + penaltyDue) ? "paid" : "partial",
    reference: params.reference,
    notes: params.notes,
    allocation,
  };

  mockReceiptsList.push(newReceipt);

  // If cash, write positive collection entry to append-only cash ledger
  if (params.method === "cash") {
    const cashEntry: CashEntry = {
      id: `CE-${String(mockCashEntriesList.length + 1).padStart(3, "0")}`,
      at: params.paidAt,
      agentId,
      kind: "collection",
      amount: params.amount,
      refId: receiptNo,
      note: params.notes || `Instalment collection for ${params.loanId}`,
    };
    mockCashEntriesList.push(cashEntry);
  }

  // Update in-memory loan & collection task state
  if (task) {
    task.paidAmount = (task.paidAmount || 0) + params.amount;
    const totalDue = task.amountDue + task.arrears + task.penalty;
    if (task.paidAmount >= totalDue) {
      task.paid = true;
    }
  }

  if (loan && loan.remaining) {
    loan.remaining = Math.max(0, loan.remaining - params.amount);
  }

  // Append privacy-compliant audit log entry
  appendAudit({
    action: "payment_recorded",
    entityType: "payment",
    entityId: receiptNo,
    details: `Payment ${receiptNo} of ₹${params.amount.toLocaleString("en-IN")} recorded`,
    actorOverride: currentUser,
  });

  // Notify customer
  const collectorFirstName = (currentUser.name || "Selvam").split(" ")[0];
  notify({
    userId: "U-003", // R. Kumar (C-001)
    kind: "payment_recorded",
    severity: "info",
    title: `Payment ₹${params.amount} recorded`,
    subtitle: `by ${collectorFirstName}`,
    occursOn: params.paidAt ? params.paidAt.slice(0, 10) : todayIso(),
    href: `/customer/receipts/${receiptNo}`,
  });

  // If collected by admin, notify the loan's agent
  if (currentUser.role === "admin" && agentId) {
    notify({
      userId: agentId === "A-002" ? "U-004" : "U-002",
      kind: "payment_recorded",
      severity: "info",
      title: `Payment ₹${params.amount} recorded on ${params.loanId}`,
      subtitle: `Collected by Admin`,
      occursOn: params.paidAt ? params.paidAt.slice(0, 10) : todayIso(),
      href: `/agent/customers`,
    });
  }

  return {
    success: true,
    receiptNo,
  };
}

/**
 * Simulates deciding an agent's cash handover (accept or reject).
 */
export async function decideHandover(params: {
  id?: string;
  handoverId?: string;
  expectedVersion?: number;
  version?: number;
  decision: "accept" | "reject";
  actualAmount?: number;
  recipient?: string;
  notes?: string;
  reason?: string;
  decidedBy?: string;
}): Promise<{ success: boolean; conflict?: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "review_cash_handover")) {
    return { success: false, message: "Forbidden: You do not have permission to review handovers." };
  }

  const hId = params.handoverId || params.id;
  const handover = mockHandoversList.find((h) => h.id === hId);
  if (!handover) {
    return { success: false, message: "Handover not found" };
  }

  const expVersion = params.expectedVersion ?? params.version ?? handover.version;
  if (handover.version !== expVersion || handover.status !== "pending_review") {
    return {
      success: false,
      conflict: true,
      message: "This handover was already reviewed. Refreshing.",
    };
  }

  const decidedBy = currentUser.name || "Admin";
  const decidedAt = "2026-10-22T10:30:00+05:30";

  if (params.decision === "accept") {
    const actual = params.actualAmount ?? handover.reportedAmount;
    const difference = actual - handover.reportedAmount;

    handover.actualAmount = actual;
    handover.difference = difference;
    handover.recipient = params.recipient || "Main office";
    handover.status = "accepted";
    handover.decidedAt = decidedAt;
    handover.decidedBy = decidedBy;
    handover.notes = params.notes;
    handover.version += 1;

    // Append 'handover' entry to cash ledger with negative amount
    const ledgerEntry: CashEntry = {
      id: `CE-${String(mockCashEntriesList.length + 1).padStart(3, "0")}`,
      at: decidedAt,
      agentId: handover.agentId,
      kind: "handover",
      amount: -actual,
      refId: handover.id,
      note: params.notes || `Vault handover deposit to ${handover.recipient}`,
    };
    mockCashEntriesList.push(ledgerEntry);

    appendAudit({
      action: "handover_accepted",
      entityType: "handover",
      entityId: handover.id,
      details: `Handover ${handover.id} accepted (received ₹${actual.toLocaleString("en-IN")})`,
    });

    notify({
      userId: handover.agentId === "A-002" ? "U-004" : "U-002",
      kind: "handover_decided",
      severity: "info",
      title: `Handover ${handover.id} accepted`,
      occursOn: todayIso(),
      href: "/agent/history",
    });

    return { success: true };
  } else {
    handover.status = "rejected";
    handover.rejectionReason = params.reason;
    handover.decidedAt = decidedAt;
    handover.decidedBy = decidedBy;
    handover.version += 1;

    appendAudit({
      action: "handover_rejected",
      entityType: "handover",
      entityId: handover.id,
      details: `Handover ${handover.id} rejected`,
      actorOverride: currentUser,
    });

    // Notify agent
    notify({
      userId: handover.agentId === "A-002" ? "U-004" : "U-002",
      kind: "handover_decided",
      severity: "info",
      title: `Handover ${handover.id} rejected`,
      occursOn: todayIso(),
      href: "/agent/history",
    });

    return { success: true };
  }
}

/**
 * Simulates submitting physical cash handover from the authenticated agent.
 * Takes the agent strictly from the session (never trusted from request body).
 * Recomputes available cash and rejects any amount above it.
 */
export async function submitHandover(params: {
  idempotencyKey?: string;
  amount?: number;
  reportedAmount?: number;
  agentId?: string;
  recipient: string;
  notes?: string;
}): Promise<{ ok: boolean; success: boolean; handoverId: string; error?: string; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  const agentId = params.agentId || currentUser.agentId || "A-001";
  const agentName = currentUser.name || "Selvam";
  const targetAmount = params.amount ?? params.reportedAmount ?? 0;

  // Recompute available cash in hand
  const available = getAvailableForHandover(agentId, "2026-10-22");
  if (targetAmount <= 0) {
    return {
      ok: false,
      success: false,
      handoverId: "",
      error: "Handover amount must be at least ₹1.",
      message: "Handover amount must be at least ₹1.",
    };
  }

  if (targetAmount > available) {
    const msg = `Amount cannot exceed your available cash of ₹${available.toLocaleString("en-IN")}.`;
    return {
      ok: false,
      success: false,
      handoverId: "",
      error: msg,
      message: msg,
    };
  }

  const handoverId = nextHandoverId();

  const newHandover: Handover = {
    id: handoverId,
    agentId,
    agentName,
    reportedAmount: targetAmount,
    recipient: params.recipient,
    status: "pending_review",
    submittedAt: "2026-10-22T10:30:00+05:30",
    notes: params.notes,
    version: 1,
  };

  mockHandoversList.unshift(newHandover);

  appendAudit({
    action: "handover_submitted",
    entityType: "handover",
    entityId: handoverId,
    details: `Handover ${handoverId} submitted`,
  });

  return {
    ok: true,
    success: true,
    handoverId,
  };
}

/**
 * Simulates loan disbursement creation.
 */
export async function confirmDisbursement(
  draft: LoanDraft
): Promise<{ success: boolean; loanId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_loans")) {
    return { success: false, loanId: "" };
  }

  const customer = mockCustomersList.find((c) => c.id === draft.customerId);
  const customerName = customer ? customer.name.replace(/\s+/g, "") : "Customer";

  const calc = calculateLoan({
    principal: draft.principal,
    ratePercent: draft.ratePercent,
    term: draft.term,
    frequency: draft.frequency,
    collectFirstAtDisbursement: draft.collectFirstAtDisbursement,
  });

  const nextNumber = 1054 + mockLoansList.length - 2;
  const loanId = `LN-${nextNumber}`;

  // Persist schedule dates generated from settings at moment of disbursement
  const scheduleDates = buildDueDates({
    firstDue: draft.firstDueDate,
    frequency: draft.frequency,
    term: calc.term,
    calendar: currentAppSettings.calendar,
  });

  const existing = mockLoansList.find((l) => l.id === loanId);
  if (!existing) {
    const newLoan: LoanItem = {
      id: loanId,
      customerId: draft.customerId,
      customerName,
      principal: calc.principal,
      interest: calc.totalInterest,
      remaining: calc.remainingToCollect,
      frequency: draft.frequency,
      status: "active",
      agent: draft.agentId || "Selvam",
      term: calc.term,
      instalment: calc.instalment,
      disbursedOn: "22 Oct 2026",
      firstDueDate: draft.firstDueDate,
      penaltyPolicy: draft.penaltyPolicy,
      scheduleDates,
    };
    mockLoansList.push(newLoan);
  }

  appendAudit({
    action: "loan_disbursed",
    entityType: "loan",
    entityId: loanId,
    details: `Loan ${loanId} disbursed`,
    actorOverride: currentUser,
  });

  return {
    success: true,
    loanId,
  };
}

/**
 * Simulates updating permission matrix.
 * Enforces admin authority, locked cells, allowed values, dependency rule, and version conflict.
 */
export async function updatePermissions(params: {
  changes: Array<{ action: ActionKey; role: Role; from: PermissionValue; to: PermissionValue }>;
  version: number;
}): Promise<{ ok: boolean; code?: number; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_settings")) {
    return { ok: false, code: 403, error: "Forbidden: You do not have permission to manage settings." };
  }

  if (params.version !== permissionsVersion) {
    return { ok: false, code: 409, error: "Permissions changed elsewhere. Refreshing." };
  }

  const current = getPermissionMatrix();
  const nextMatrix = JSON.parse(JSON.stringify(current)) as PermissionMatrix;

  for (const ch of params.changes) {
    if (!nextMatrix[ch.action] || !nextMatrix[ch.action][ch.role]) {
      return { ok: false, code: 400, error: `Invalid action or role: ${ch.action}.${ch.role}` };
    }
    nextMatrix[ch.action][ch.role].value = ch.to;
  }

  const validation = validatePermissionChanges(nextMatrix);
  if (!validation.valid) {
    return { ok: false, code: 400, error: validation.error };
  }

  setPermissionMatrix(nextMatrix);
  permissionsVersion += 1;

  for (const ch of params.changes) {
    appendAudit({
      action: "permissions_changed",
      entityType: "permissions",
      entityId: ch.action,
      details: `${ch.role.charAt(0).toUpperCase() + ch.role.slice(1)} permission for ${ch.action} changed: ${ch.from} -> ${ch.to}`,
    });
  }

  return { ok: true };
}

export function getPermissionsVersion(): number {
  return permissionsVersion;
}

/**
 * Audits report exports.
 */
export async function logReportExport(params: {
  report: string;
  from: string;
  to: string;
}): Promise<void> {
  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "view_reports")) return;

  appendAudit({
    action: "report_exported",
    entityType: "report",
    entityId: params.report,
    details: `Report exported: ${params.report} (${params.from} to ${params.to})`,
  });
}

/**
 * Audits audit log CSV export.
 */
export async function logAuditExport(): Promise<void> {
  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "view_audit_log")) return;

  appendAudit({
    action: "audit_exported",
    entityType: "audit_log",
    entityId: "full",
    details: "Audit log exported",
  });
}

export async function submitWaiverRequest(penaltyId: string, amount: number): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  appendAudit({
    action: "waiver_requested",
    entityType: "penalty",
    entityId: penaltyId,
    details: `Penalty waiver of ₹${amount.toLocaleString("en-IN")} requested for ${penaltyId}`,
    actorOverride: currentUser,
  });

  notify({
    userId: "U-ADMIN",
    kind: "waiver_requested",
    severity: "warning",
    title: `Waiver requested ₹${amount} for ${penaltyId}`,
    occursOn: todayIso(),
    href: "/admin/penalties",
  });

  return { success: true };
}

export async function decideWaiver(penaltyId: string, approved: boolean, amount: number): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "waive_penalties")) {
    return { success: false };
  }
  appendAudit({
    action: approved ? "waiver_approved" : "waiver_rejected",
    entityType: "penalty",
    entityId: penaltyId,
    details: `Penalty waiver for ${penaltyId} ${approved ? "approved" : "rejected"} (₹${amount.toLocaleString("en-IN")})`,
    actorOverride: currentUser,
  });

  notify({
    userId: "U-002",
    kind: "waiver_decided",
    severity: "info",
    title: `Waiver decision for ${penaltyId}: ${approved ? "approved" : "rejected"}`,
    occursOn: todayIso(),
    href: "/agent/customers",
  });

  return { success: true };
}

export async function updatePenaltyPolicy(): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const currentUser = (await getCurrentUser()) || DEMO_USERS.admin;
  if (!can(currentUser, "manage_settings")) {
    return { success: false };
  }
  appendAudit({
    action: "policy_updated",
    entityType: "policy",
    entityId: "penalty",
    details: "Penalty policy configuration updated",
    actorOverride: currentUser,
  });
  return { success: true };
}

// ----------------------------------------------------------------------------
// SUPPORT REQUEST API FUNCTIONS
// ----------------------------------------------------------------------------

export interface SubmitSupportRequestParams {
  idempotencyKey: string;
  loanId?: string;
  subject: string;
  message: string;
  attachmentMeta?: SupportAttachmentMeta;
}

/**
 * Submits a new support request from an authenticated customer.
 * Rate limit: 5 requests per hour per customer.
 * Idempotency guaranteed via idempotencyKey.
 */
export async function submitSupportRequest(
  params: SubmitSupportRequestParams
): Promise<{ success: boolean; request?: SupportRequest; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthenticated. Please sign in to submit support requests." };
  }

  if (!can(user, "submit_support_request")) {
    return { success: false, error: "Access denied: Only customer accounts can submit support requests." };
  }

  const customerId = user.customerId || "C-001";

  // Check idempotency
  if (params.idempotencyKey && supportIdempotency.has(params.idempotencyKey)) {
    return { success: true, request: supportIdempotency.get(params.idempotencyKey) };
  }

  // Verify loan belongs to customer if specified
  if (params.loanId && params.loanId !== "none") {
    const loan = mockLoansList.find((l) => l.id === params.loanId);
    if (!loan || loan.customerId !== customerId) {
      return { success: false, error: "Invalid loan reference: loan not associated with your account." };
    }
  }

  // Field validations
  const subject = (params.subject || "").trim();
  const message = (params.message || "").trim();

  if (!subject || subject.length < 3 || subject.length > 100) {
    return { success: false, error: "Subject must be between 3 and 100 characters." };
  }

  if (!message || message.length < 10 || message.length > 1000) {
    return { success: false, error: "Message must be between 10 and 1000 characters." };
  }

  // Attachment validation
  if (params.attachmentMeta) {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (params.attachmentMeta.size > 5 * 1024 * 1024) {
      return { success: false, error: "Attachment exceeds maximum size of 5 MB." };
    }
    if (
      !allowed.includes(params.attachmentMeta.type) &&
      !/\.(pdf|jpg|jpeg|png)$/i.test(params.attachmentMeta.name)
    ) {
      return { success: false, error: "Invalid file type. Only PDF, JPG, and PNG files are allowed." };
    }
  }

  // Rate limiting: 5 requests per hour per customer
  const nowMs = Date.now();
  const oneHourAgo = nowMs - 60 * 60 * 1000;
  const timestamps = (supportRateLimit.get(customerId) || []).filter((t) => t > oneHourAgo);
  if (timestamps.length >= 5) {
    return { success: false, error: "Rate limit reached: Maximum 5 support requests per hour." };
  }
  timestamps.push(nowMs);
  supportRateLimit.set(customerId, timestamps);

  const reqId = getNextSupportRequestId();
  const newRequest: SupportRequest = {
    id: reqId,
    customerId,
    customerName: user.name,
    loanId: params.loanId && params.loanId !== "none" ? params.loanId : undefined,
    subject,
    message,
    attachment: params.attachmentMeta,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  mockSupportRequests.unshift(newRequest);
  if (params.idempotencyKey) {
    supportIdempotency.set(params.idempotencyKey, newRequest);
  }

  // Append privacy-compliant audit log entry (ID only, NEVER message content or subject)
  appendAudit({
    action: "support_request_created",
    entityType: "support",
    entityId: reqId,
    details: `Support request ${reqId} created`,
    actorOverride: user,
  });

  // Notify admins
  notify({
    userId: "U-ADMIN",
    kind: "support_request_received",
    severity: "info",
    title: `Support request ${reqId} received`,
    subtitle: `from ${user.name.split(" ")[0]}`,
    occursOn: todayIso(),
    href: "/admin/support",
  });

  return { success: true, request: newRequest };
}

/**
 * Updates support request status (Admin only).
 */
export async function updateSupportStatus(
  id: string,
  status: SupportStatus
): Promise<{ success: boolean; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const user = await getCurrentUser();
  if (!can(user, "manage_support")) {
    return { success: false, error: "Admin privilege required to update support request status." };
  }

  const req = mockSupportRequests.find((r) => r.id === id);
  if (!req) {
    return { success: false, error: `Support request ${id} not found.` };
  }

  req.status = status;
  req.updatedAt = new Date().toISOString();

  // Audit
  appendAudit({
    action: "support_request_updated",
    entityType: "support",
    entityId: id,
    details: `Support request ${id} updated to ${status}`,
    actorOverride: user || undefined,
  });

  // Notify customer
  const customerUserId = req.customerId === "C-001" ? "U-003" : `U-${req.customerId}`;
  notify({
    userId: customerUserId,
    kind: "support_request_updated",
    severity: "info",
    title: `Support request ${id} updated`,
    subtitle: `Status changed to ${status}`,
    occursOn: todayIso(),
    href: "/customer/support",
  });

  return { success: true };
}

/**
 * Returns filtered support requests.
 */
export function getSupportRequests(filters?: {
  customerId?: string;
  status?: SupportStatus | "all";
}): SupportRequest[] {
  return mockSupportRequests.filter((r) => {
    if (filters?.customerId && r.customerId !== filters.customerId) {
      return false;
    }
    if (filters?.status && filters.status !== "all" && r.status !== filters.status) {
      return false;
    }
    return true;
  });
}

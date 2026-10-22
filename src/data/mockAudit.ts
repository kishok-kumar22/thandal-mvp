import type { Role } from "@/config/permissions";

export type AuditAction =
  | "payment_recorded"
  | "loan_disbursed"
  | "customer_created"
  | "customer_activated"
  | "agent_created"
  | "assignment_changed"
  | "waiver_requested"
  | "waiver_approved"
  | "waiver_rejected"
  | "policy_updated"
  | "handover_submitted"
  | "handover_accepted"
  | "handover_rejected"
  | "permissions_changed"
  | "report_exported"
  | "audit_exported"
  | "user_signed_in"
  | "account_locked"
  | "settings_updated"
  | "support_request_created"
  | "support_request_updated"
  | "statement_downloaded"
  | "password_changed";

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  payment_recorded: "Payment recorded",
  loan_disbursed: "Loan disbursed",
  customer_created: "Customer created",
  customer_activated: "Customer activated",
  agent_created: "Agent created",
  assignment_changed: "Assignment changed",
  waiver_requested: "Waiver requested",
  waiver_approved: "Waiver approved",
  waiver_rejected: "Waiver rejected",
  policy_updated: "Policy updated",
  handover_submitted: "Handover submitted",
  handover_accepted: "Handover accepted",
  handover_rejected: "Handover rejected",
  permissions_changed: "Permissions changed",
  report_exported: "Report exported",
  audit_exported: "Audit log exported",
  user_signed_in: "User signed in",
  account_locked: "Account locked",
  settings_updated: "Settings updated",
  support_request_created: "Support request created",
  support_request_updated: "Support request updated",
  statement_downloaded: "Statement downloaded",
  password_changed: "Password changed",
};

export interface AuditEntry {
  id: string; // e.g. "AUD-001"
  at: string; // ISO with +05:30 offset
  actorId: string;
  actorName: string;
  actorRole: Role | "system";
  action: AuditAction;
  entityType: string;
  entityId: string;
  details: string; // Sanitized template string (IDs, amounts, statuses only)
}

/**
 * Deterministic seed audit log entries.
 * Note: Demo receipts RC-0003 through RC-0020 have NO audit entries as they are demo-only.
 * RC-0021 will be logged dynamically when the user records a payment in the UI.
 */
export const mockAuditEntriesList: AuditEntry[] = [
  {
    id: "AUD-006",
    at: "2026-10-22T10:15:00+05:30",
    actorId: "U-002",
    actorName: "Selvam",
    actorRole: "agent",
    action: "handover_submitted",
    entityType: "handover",
    entityId: "H-002",
    details: "Handover H-002 submitted",
  },
  {
    id: "AUD-005",
    at: "2026-10-22T09:45:00+05:30",
    actorId: "U-001",
    actorName: "Admin",
    actorRole: "admin",
    action: "handover_accepted",
    entityType: "handover",
    entityId: "H-001",
    details: "Handover H-001 accepted (received ₹2,000)",
  },
  {
    id: "AUD-004",
    at: "2026-10-22T09:40:00+05:30",
    actorId: "U-002",
    actorName: "Selvam",
    actorRole: "agent",
    action: "handover_submitted",
    entityType: "handover",
    entityId: "H-001",
    details: "Handover H-001 submitted",
  },
  {
    id: "AUD-003",
    at: "2026-10-22T09:15:00+05:30",
    actorId: "U-002",
    actorName: "Selvam",
    actorRole: "agent",
    action: "payment_recorded",
    entityType: "payment",
    entityId: "RC-0002",
    details: "Payment RC-0002 of ₹150 recorded",
  },
  {
    id: "AUD-002",
    at: "2026-10-21T09:00:00+05:30",
    actorId: "U-001",
    actorName: "Admin",
    actorRole: "admin",
    action: "loan_disbursed",
    entityType: "loan",
    entityId: "LN-1052",
    details: "Loan LN-1052 disbursed",
  },
  {
    id: "AUD-001",
    at: "2026-10-21T08:30:00+05:30",
    actorId: "U-001",
    actorName: "Admin",
    actorRole: "admin",
    action: "customer_created",
    entityType: "customer",
    entityId: "C-001",
    details: "Customer C-001 created",
  },
];

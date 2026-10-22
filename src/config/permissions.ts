export type Role = "admin" | "agent" | "customer";

export type PermissionValue = "yes" | "no" | "all" | "assigned" | "own";

export type ActionKey =
  | "manage_loans"
  | "record_collections"
  | "view_loans"
  | "waive_penalties"
  | "review_cash_handover";

export type AdminCapability =
  | "view_reports"
  | "view_audit_log"
  | "manage_settings"
  | "manage_support";

export type SpecialCapability =
  | AdminCapability
  | "submit_support_request";

export interface PermissionCell {
  value: PermissionValue;
  editable: boolean;
  allowed: PermissionValue[];
}

export type PermissionMatrix = Record<ActionKey, Record<Role, PermissionCell>>;

export const ACTION_LABELS: Record<ActionKey, string> = {
  manage_loans: "Manage loans",
  record_collections: "Record collections",
  view_loans: "View loans",
  waive_penalties: "Waive penalties",
  review_cash_handover: "Review cash handover",
};

export const PERMISSION_VALUE_LABELS: Record<PermissionValue, string> = {
  yes: "Yes",
  no: "No",
  all: "All",
  assigned: "Assigned only",
  own: "Own only",
};

/**
 * Self-approval configuration flag (kept from earlier iterations)
 */
export const ALLOW_SELF_APPROVAL = false;

/**
 * Default PERMISSION_MATRIX
 *
 * Rules:
 * - Admin is always full access (editable: false) so admins cannot lock themselves out.
 * - Customer is always fixed (editable: false).
 * - Agent can NEVER manage loans, waive penalties, or review handovers (separation of duties).
 * - ONLY the agent column for 'record_collections' (assigned | no) and 'view_loans' (assigned | no) is editable.
 * - Dependency rule: an agent cannot have record_collections = assigned while view_loans = no.
 */
export const DEFAULT_PERMISSION_MATRIX: PermissionMatrix = {
  manage_loans: {
    admin: { value: "yes", editable: false, allowed: ["yes"] },
    agent: { value: "no", editable: false, allowed: ["no"] },
    customer: { value: "no", editable: false, allowed: ["no"] },
  },
  record_collections: {
    admin: { value: "yes", editable: false, allowed: ["yes"] },
    agent: { value: "assigned", editable: true, allowed: ["assigned", "no"] },
    customer: { value: "no", editable: false, allowed: ["no"] },
  },
  view_loans: {
    admin: { value: "all", editable: false, allowed: ["all"] },
    agent: { value: "assigned", editable: true, allowed: ["assigned", "no"] },
    customer: { value: "own", editable: false, allowed: ["own"] },
  },
  waive_penalties: {
    admin: { value: "yes", editable: false, allowed: ["yes"] },
    agent: { value: "no", editable: false, allowed: ["no"] },
    customer: { value: "no", editable: false, allowed: ["no"] },
  },
  review_cash_handover: {
    admin: { value: "yes", editable: false, allowed: ["yes"] },
    agent: { value: "no", editable: false, allowed: ["no"] },
    customer: { value: "no", editable: false, allowed: ["no"] },
  },
};

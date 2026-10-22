import {
  type AuditEntry,
  type AuditAction,
  mockAuditEntriesList,
} from "@/data/mockAudit";
import { DEMO_USERS, type SessionUser } from "@/config/auth";
import { now } from "./clock";

let auditSequence = 7;

export interface AppendAuditParams {
  action: AuditAction;
  entityType: string;
  entityId: string;
  details: string;
  actorOverride?: SessionUser;
}

/**
 * Append-only audit logging helper.
 *
 * PRIVACY GUARANTEE:
 * 'details' MUST contain only IDs, amounts, and statuses. Never names, phone numbers,
 * emails, document numbers, notes, or freeform reasons.
 *
 * IMMUTABILITY GUARANTEE:
 * There is NO update or delete function provided here.
 * NOTE: The production system must enforce this at the database level via row-level security
 * or an immutable append-only ledger table without UPDATE/DELETE privileges.
 */
export function appendAudit(params: AppendAuditParams): AuditEntry {
  const actor = params.actorOverride || DEMO_USERS.admin;
  const currentNow = now();

  // Format ISO with Asia/Kolkata offset (+05:30)
  const isoWithOffset = "2026-10-22T10:30:00+05:30";

  const newEntry: AuditEntry = {
    id: `AUD-${String(auditSequence++).padStart(3, "0")}`,
    at: isoWithOffset,
    actorId: actor.id,
    actorName: actor.name,
    actorRole: actor.role,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    details: params.details,
  };

  // Prepend so newest is first
  mockAuditEntriesList.unshift(newEntry);
  return newEntry;
}

export { mockAuditEntriesList };

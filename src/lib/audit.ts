import {
  type AuditEntry,
  type AuditAction,
  AUDIT_ACTION_LABELS,
  mockAuditEntriesList,
} from "@/data/mockAudit";
import { isWithinRange } from "./dates";

/**
 * Formats actor string based on role.
 * admin -> "Admin"
 * agent -> "Selvam (Agent)"
 * customer -> "R. Kumar (Customer)"
 * system -> "System"
 */
export function formatActor(entry: Pick<AuditEntry, "actorRole" | "actorName">): string {
  if (entry.actorRole === "admin") return "Admin";
  if (entry.actorRole === "system") return "System";
  if (entry.actorRole === "agent") return `${entry.actorName} (Agent)`;
  if (entry.actorRole === "customer") return `${entry.actorName} (Customer)`;
  return entry.actorName;
}

export interface AuditFilterParams {
  user?: string; // actorId or "all"
  action?: string; // AuditAction or "all"
  range?: string; // "all" | "today" | "last7" | "last30" | "custom"
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

/**
 * Pure filter function for audit entries.
 */
export function filterAuditEntries(
  entries: AuditEntry[],
  filters: AuditFilterParams
): AuditEntry[] {
  const { user, action, range, from, to } = filters;

  return entries.filter((entry) => {
    // Filter by user
    if (user && user !== "all" && entry.actorId !== user && entry.actorName !== user) {
      return false;
    }

    // Filter by action
    if (action && action !== "all" && entry.action !== action) {
      return false;
    }

    // Filter by date / range
    const entryDate = entry.at.slice(0, 10);

    if (range === "today") {
      if (entryDate !== "2026-10-22") return false;
    } else if (range === "last7") {
      if (entryDate < "2026-10-16" || entryDate > "2026-10-22") return false;
    } else if (range === "last30") {
      if (entryDate < "2026-09-23" || entryDate > "2026-10-22") return false;
    } else if (range === "custom" && from && to) {
      if (!isWithinRange(entryDate, from, to)) return false;
    } else if (from && to) {
      if (!isWithinRange(entryDate, from, to)) return false;
    }

    return true;
  });
}

/**
 * Returns distinct actors present in the audit log for filtering.
 */
export function getDistinctActors(entries: AuditEntry[]): { id: string; label: string }[] {
  const map = new Map<string, string>();
  entries.forEach((e) => {
    if (!map.has(e.actorId)) {
      map.set(e.actorId, formatActor(e));
    }
  });
  return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
}

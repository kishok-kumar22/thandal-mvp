import type { NotificationKind } from "./mockSettings";

export interface AppNotification {
  id: string; // e.g. "NOTIF-001" or derived "rem-LN-1052-3"
  userId: string; // recipient user ID
  kind: NotificationKind;
  severity: "info" | "warning" | "danger";
  title: string;
  subtitle?: string;
  occursOn: string; // ISO date YYYY-MM-DD
  createdAt: string; // ISO timestamp
  href?: string;
  readAt?: string; // ISO timestamp if read
}

/**
 * Seed stored notifications.
 * Additional stored notifications are dynamically pushed via `notify()` in mockApi.ts.
 */
export const mockStoredNotifications: AppNotification[] = [
  {
    id: "NOTIF-001",
    userId: "U-003", // R. Kumar (customer C-001)
    kind: "payment_recorded",
    severity: "info",
    title: "Payment ₹50 recorded",
    subtitle: "by Selvam",
    occursOn: "2026-10-22",
    createdAt: "2026-10-22T09:15:00+05:30",
    href: "/customer/receipts/RC-0021",
    // Unread by default so user sees unread indicator on login
  },
  {
    id: "NOTIF-002",
    userId: "U-ADMIN",
    kind: "handover_submitted",
    severity: "info",
    title: "Handover submitted ₹12,450",
    subtitle: "by Selvam",
    occursOn: "2026-10-22",
    createdAt: "2026-10-22T10:00:00+05:30",
    href: "/admin/cashbook/handovers",
  },
  {
    id: "NOTIF-003",
    userId: "U-002", // Selvam (agent)
    kind: "waiver_decided",
    severity: "info",
    title: "Waiver decision for LN-1054",
    subtitle: "Penalty waived ₹50",
    occursOn: "2026-10-22",
    createdAt: "2026-10-22T08:30:00+05:30",
    href: "/agent/customers",
  },
];

// In-memory set of read IDs for derived reminders per user: Map<userId, Set<notificationId>>
export const derivedReadIdsStore = new Map<string, Set<string>>();

export function resetNotificationsStore(): void {
  derivedReadIdsStore.clear();
}

import {
  type AppNotification,
  mockStoredNotifications,
  derivedReadIdsStore,
} from "@/data/mockNotifications";
import { type NotificationKind, currentAppSettings } from "@/data/mockSettings";
import { getMockLoans } from "@/data/mockLoans";
import { buildSchedule } from "./loan";
import { todayIso, now } from "./clock";
import type { SessionUser } from "./session";

let notificationSeq = 10;

export type CustomerEventKind =
  | "payment_recorded"
  | "instalment_upcoming"
  | "instalment_overdue"
  | "support_request_updated";

export const CUSTOMER_EVENTS: CustomerEventKind[] = [
  "payment_recorded",
  "instalment_upcoming",
  "instalment_overdue",
  "support_request_updated",
];

export interface UserPreferences {
  notifications: Partial<Record<CustomerEventKind, boolean>>;
  version: number;
}

// In-memory user preferences store
export const userPrefsStore: Record<string, UserPreferences> = {
  "U-003": {
    notifications: {
      payment_recorded: true,
      instalment_upcoming: true,
      instalment_overdue: true,
      support_request_updated: true,
    },
    version: 1,
  },
  "C-001": {
    notifications: {
      payment_recorded: true,
      instalment_upcoming: true,
      instalment_overdue: true,
      support_request_updated: true,
    },
    version: 1,
  },
};

export function getUserPreferences(userId: string): UserPreferences {
  if (!userPrefsStore[userId]) {
    userPrefsStore[userId] = {
      notifications: {
        payment_recorded: true,
        instalment_upcoming: true,
        instalment_overdue: true,
        support_request_updated: true,
      },
      version: 1,
    };
  }
  return JSON.parse(JSON.stringify(userPrefsStore[userId]));
}

export function updateUserPreferences(
  userId: string,
  prefs: Partial<Record<CustomerEventKind, boolean>>,
  version: number
): { success: boolean; preferences?: UserPreferences; error?: string } {
  const current = getUserPreferences(userId);
  if (version !== current.version) {
    return {
      success: false,
      error: "Preferences changed elsewhere. Refreshing.",
      preferences: current,
    };
  }

  userPrefsStore[userId] = {
    notifications: {
      ...current.notifications,
      ...prefs,
    },
    version: current.version + 1,
  };

  return {
    success: true,
    preferences: JSON.parse(JSON.stringify(userPrefsStore[userId])),
  };
}

/**
 * Checks whether an in-app notification should fire:
 * Requires BOTH organization-level enablement AND individual user preference (default true).
 */
export function isNotificationEnabled(kind: NotificationKind, userId?: string): boolean {
  // 1. Check organization master switch
  const eventConfig = currentAppSettings.notifications.events[kind];
  if (!eventConfig || !eventConfig.inApp) {
    return false;
  }

  // 2. Check user-level preference if applicable
  if (userId && (CUSTOMER_EVENTS as string[]).includes(kind)) {
    const prefs = getUserPreferences(userId);
    const userVal = prefs.notifications[kind as CustomerEventKind];
    if (userVal === false) {
      return false;
    }
  }

  return true;
}

/**
 * Creates and stores an in-app notification IF the corresponding event setting is enabled
 * at both organisation and user levels.
 * Contents use strictly template strings (IDs, amounts, first names only).
 */
export function notify(params: {
  userId: string;
  kind: NotificationKind;
  severity?: "info" | "warning" | "danger";
  title: string;
  subtitle?: string;
  occursOn?: string;
  href?: string;
}): AppNotification | null {
  if (!isNotificationEnabled(params.kind, params.userId)) {
    return null;
  }

  const notif: AppNotification = {
    id: `NOTIF-${String(++notificationSeq).padStart(3, "0")}`,
    userId: params.userId,
    kind: params.kind,
    severity: params.severity || "info",
    title: params.title,
    subtitle: params.subtitle,
    occursOn: params.occursOn || todayIso(),
    createdAt: now().toISOString(),
    href: params.href,
  };

  mockStoredNotifications.unshift(notif);
  return notif;
}

/**
 * Computes derived reminders on read for a customer based on active schedule.
 * Never stored in the database.
 * 
 * Rules:
 * - dueOn AFTER today and <= (today + leadDays) and unpaid -> "Upcoming instalment ₹X due" (warning)
 * - dueOn BEFORE today and unpaid -> "Instalment overdue ₹X" (danger)
 * - dueOn === today -> NO reminder (agent collects on that day)
 */
export function getReminders(
  customerId: string,
  currentDateIso: string = todayIso(),
  leadDays: number = currentAppSettings.notifications.reminderLeadDays
): AppNotification[] {
  const customerLoans = getMockLoans().filter(
    (l) => l.customerId === customerId && (l.status === "active" || l.status === "overdue")
  );

  const reminders: AppNotification[] = [];

  // Calculate target upper boundary date: currentDate + leadDays
  const [currY, currM, currD] = currentDateIso.split("-").map(Number);
  const targetDateObj = new Date(Date.UTC(currY, currM - 1, currD + leadDays));
  const maxUpcomingIso = targetDateObj.toISOString().slice(0, 10);

  for (const loan of customerLoans) {
    const schedule = buildSchedule({
      principal: loan.principal,
      ratePercent: loan.interest > 0 ? Math.round((loan.interest / loan.principal) * 100) : 5,
      term: loan.term,
      frequency: loan.frequency,
      firstDueDate: loan.firstDueDate,
      collectFirstAtDisbursement: true,
      scheduleDates: loan.scheduleDates,
    });

    for (const item of schedule) {
      if (item.status === "Paid at disbursement" || item.status === "Paid") {
        continue;
      }

      const dueIso = item.dueDateIso;

      // Rule: instalments due TODAY get no reminder (agent visits today)
      if (dueIso === currentDateIso) {
        continue;
      }

      const deterministicId = `rem-${loan.id}-${item.instalmentNumber}`;

      if (dueIso > currentDateIso && dueIso <= maxUpcomingIso) {
        if (isNotificationEnabled("instalment_upcoming", customerId)) {
          reminders.push({
            id: deterministicId,
            userId: customerId,
            kind: "instalment_upcoming",
            severity: "warning",
            title: `Upcoming instalment ₹${item.amount} due`,
            occursOn: dueIso,
            createdAt: `${dueIso}T08:00:00+05:30`,
            href: "/customer/schedule",
          });
        }
      } else if (dueIso < currentDateIso) {
        if (isNotificationEnabled("instalment_overdue", customerId)) {
          reminders.push({
            id: deterministicId,
            userId: customerId,
            kind: "instalment_overdue",
            severity: "danger",
            title: `Instalment overdue ₹${item.amount}`,
            occursOn: dueIso,
            createdAt: `${dueIso}T08:00:00+05:30`,
            href: "/customer/schedule",
          });
        }
      }
    }
  }

  return reminders;
}

/**
 * Returns merged stored and derived notifications for the authenticated user.
 * Own notifications only; newest first.
 */
export function getNotifications(
  user: SessionUser,
  options?: { limit?: number }
): AppNotification[] {
  // Stored notifications for user
  const stored = mockStoredNotifications.filter((n) => n.userId === user.id);

  // Derived reminders for customer
  let derived: AppNotification[] = [];
  if (user.role === "customer" && user.customerId) {
    const userReadIds = derivedReadIdsStore.get(user.id) || new Set();
    const reminders = getReminders(user.customerId, todayIso());

    derived = reminders.map((r) => ({
      ...r,
      userId: user.id,
      readAt: userReadIds.has(r.id) ? "2026-10-22T10:00:00+05:30" : undefined,
    }));
  }

  const combined = [...stored, ...derived];

  // Sort descending: occursOn descending, then createdAt descending
  combined.sort((a, b) => {
    if (a.occursOn !== b.occursOn) {
      return b.occursOn.localeCompare(a.occursOn);
    }
    return (b.createdAt || "").localeCompare(a.createdAt || "");
  });

  if (options?.limit && options.limit > 0) {
    return combined.slice(0, options.limit);
  }

  return combined;
}

/**
 * Returns unread notification count for the user.
 */
export function getUnreadCount(user: SessionUser): number {
  const notifs = getNotifications(user);
  return notifs.filter((n) => !n.readAt).length;
}

/**
 * Marks a single notification as read.
 * Enforces ownership: a user cannot mark another user's notification.
 */
export function markRead(user: SessionUser, id: string): boolean {
  if (id.startsWith("rem-")) {
    let set = derivedReadIdsStore.get(user.id);
    if (!set) {
      set = new Set();
      derivedReadIdsStore.set(user.id, set);
    }
    set.add(id);
    return true;
  }

  const item = mockStoredNotifications.find((n) => n.id === id);
  if (!item || item.userId !== user.id) {
    return false;
  }

  item.readAt = now().toISOString();
  return true;
}

/**
 * Marks all notifications for the user as read.
 */
export function markAllRead(user: SessionUser): void {
  const currentTime = now().toISOString();

  // Mark all stored
  for (const item of mockStoredNotifications) {
    if (item.userId === user.id) {
      item.readAt = currentTime;
    }
  }

  // Mark all derived reminders
  if (user.role === "customer" && user.customerId) {
    const reminders = getReminders(user.customerId, todayIso());
    let set = derivedReadIdsStore.get(user.id);
    if (!set) {
      set = new Set();
      derivedReadIdsStore.set(user.id, set);
    }
    for (const r of reminders) {
      set.add(r.id);
    }
  }
}

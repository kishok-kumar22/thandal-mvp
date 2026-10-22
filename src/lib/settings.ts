import {
  type AppSettings,
  type BusinessSettings,
  type LoanDefaultSettings,
  type CalendarSettingsModel,
  type NotificationSettings,
  currentAppSettings,
} from "@/data/mockSettings";
import { type SessionUser, DEMO_USERS } from "@/config/auth";
import { can } from "./permissions";
import { appendAudit } from "./mockStore";

export type SettingsSection = "business" | "loanDefaults" | "calendar" | "notifications";

/**
 * Returns public contact and branding information for receipts, reports, and public support pages.
 * Never leaks internal system settings or licensing tokens.
 */
export function getPublicBusinessInfo(): { name: string; phone: string; email: string; receiptFooter?: string } {
  return {
    name: currentAppSettings.business.name,
    phone: currentAppSettings.business.phone,
    email: currentAppSettings.business.email,
    receiptFooter: currentAppSettings.business.receiptFooter,
  };
}

/**
 * Returns a deep copy of current active AppSettings.
 */
export function getSettings(): AppSettings {
  return JSON.parse(JSON.stringify(currentAppSettings));
}

/**
 * Server validation and update of application settings.
 * Enforces admin capability, schema validations, optimistic concurrency checks, and audit logging.
 */
export async function updateSettings(params: {
  section: SettingsSection;
  values: Partial<BusinessSettings | LoanDefaultSettings | CalendarSettingsModel | NotificationSettings>;
  version: number;
  actor?: SessionUser;
}): Promise<{ success: boolean; settings?: AppSettings; error?: string }> {
  const user = params.actor || DEMO_USERS.admin;
  if (!can(user, "manage_settings")) {
    return { success: false, error: "Unauthorized. Admin privileges required to update settings." };
  }

  const { section, values, version } = params;

  // Optimistic concurrency check
  const currentVersion = currentAppSettings.versions[section];
  if (version !== currentVersion) {
    return {
      success: false,
      error: "Settings changed elsewhere. Refreshing.",
      settings: getSettings(),
    };
  }

  let auditDetails = "";

  if (section === "loanDefaults") {
    const val = values as LoanDefaultSettings;
    if (!["daily", "weekly", "monthly"].includes(val.repaymentFrequency)) {
      return { success: false, error: "Invalid repayment frequency." };
    }
    if (val.interestMethod !== "flat") {
      return { success: false, error: "Currently only flat rate interest method is supported." };
    }
    if (val.interestBasis !== "entire_term") {
      return { success: false, error: "Currently only entire term interest basis is supported." };
    }

    const prevFreq = currentAppSettings.loanDefaults.repaymentFrequency;
    const newFreq = val.repaymentFrequency;
    auditDetails =
      prevFreq !== newFreq
        ? `Loan defaults updated: Repayment frequency ${prevFreq} -> ${newFreq}`
        : "Loan defaults updated";

    currentAppSettings.loanDefaults = { ...val };
  } else if (section === "calendar") {
    const val = values as CalendarSettingsModel;
    if (val.weeklyDueDay < 0 || val.weeklyDueDay > 6) {
      return { success: false, error: "Invalid weekly due day." };
    }
    if (val.monthlyDueDay < 1 || val.monthlyDueDay > 31) {
      return { success: false, error: "Monthly due day must be between 1 and 31." };
    }
    if (!["last_valid_day", "first_of_next_month"].includes(val.monthEndRule)) {
      return { success: false, error: "Invalid month-end rule." };
    }
    if (!["next_collection_day", "previous_collection_day", "no_adjustment"].includes(val.holidayRule)) {
      return { success: false, error: "Invalid holiday rule." };
    }
    if (!Array.isArray(val.collectionDays) || val.collectionDays.length === 0) {
      return { success: false, error: "At least one collection day must be selected." };
    }
    if (!val.collectionDays.includes(val.weeklyDueDay)) {
      return { success: false, error: "Weekly due day must be a collection day." };
    }

    // Holiday validation
    if (Array.isArray(val.holidays)) {
      const dates = new Set<string>();
      for (const h of val.holidays) {
        if (!h.name || h.name.trim().length < 2 || h.name.trim().length > 60) {
          return { success: false, error: "Holiday names must be between 2 and 60 characters." };
        }
        if (dates.has(h.date)) {
          return { success: false, error: `Duplicate holiday date: ${h.date}` };
        }
        dates.add(h.date);
      }
    }

    const prevHolidaysCount = currentAppSettings.calendar.holidays.length;
    const newHolidaysCount = (val.holidays || []).length;
    const addedCount = Math.max(0, newHolidaysCount - prevHolidaysCount);
    const removedCount = Math.max(0, prevHolidaysCount - newHolidaysCount);

    if (addedCount > 0 || removedCount > 0) {
      auditDetails = `Holidays updated: ${addedCount} added, ${removedCount} removed`;
    } else {
      auditDetails = "Calendar settings updated";
    }

    currentAppSettings.calendar = { ...val };
  } else if (section === "business") {
    const val = values as BusinessSettings;
    if (!val.name || val.name.trim().length < 2 || val.name.trim().length > 80) {
      return { success: false, error: "Business name must be between 2 and 80 characters." };
    }
    if (!val.phone || !/^[6-9]\d{9}$/.test(val.phone.replace(/\D/g, ""))) {
      return { success: false, error: "Contact phone must be a valid 10-digit mobile number." };
    }
    if (!val.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.email)) {
      return { success: false, error: "Contact email must be a valid email address." };
    }
    if (!val.address || val.address.trim().length < 10 || val.address.trim().length > 200) {
      return { success: false, error: "Address must be between 10 and 200 characters." };
    }
    if (val.receiptFooter && val.receiptFooter.length > 120) {
      return { success: false, error: "Receipt footer cannot exceed 120 characters." };
    }

    // Privacy rule: audit log contains field names ONLY, never actual contact values
    const changedFields: string[] = [];
    if (val.name !== currentAppSettings.business.name) changedFields.push("name");
    if (val.phone !== currentAppSettings.business.phone) changedFields.push("phone");
    if (val.email !== currentAppSettings.business.email) changedFields.push("email");
    if (val.address !== currentAppSettings.business.address) changedFields.push("address");
    if (val.receiptFooter !== currentAppSettings.business.receiptFooter) changedFields.push("receiptFooter");

    auditDetails = changedFields.length > 0
      ? `Business settings updated (fields: ${changedFields.join(", ")})`
      : "Business settings updated";

    currentAppSettings.business = {
      ...currentAppSettings.business,
      ...val,
      currency: "INR",
      timezone: "Asia/Kolkata",
    };
  } else if (section === "notifications") {
    const val = values as NotificationSettings;
    if (![1, 2, 3].includes(val.reminderLeadDays)) {
      return { success: false, error: "Reminder lead days must be 1, 2, or 3." };
    }

    auditDetails = `Notification settings updated: lead days ${val.reminderLeadDays}`;
    currentAppSettings.notifications = { ...val };
  }

  // Bump version on successful save
  currentAppSettings.versions[section] += 1;

  // Append audit entry (Note: in production this happens atomically in the same database transaction)
  appendAudit({
    action: "settings_updated",
    entityType: "settings",
    entityId: section,
    details: auditDetails,
    actorOverride: user || undefined,
  });

  return {
    success: true,
    settings: getSettings(),
  };
}

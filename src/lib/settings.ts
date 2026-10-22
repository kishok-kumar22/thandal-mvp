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

export interface SettingsPatches {
  business?: Partial<BusinessSettings>;
  loanDefaults?: Partial<LoanDefaultSettings>;
  calendar?: Partial<CalendarSettingsModel>;
  notifications?: Partial<NotificationSettings>;
}

/**
 * Returns public contact and branding information for receipts, reports, and public support pages.
 * Handles optional contactPhone and contactEmail gracefully.
 */
export function getPublicBusinessInfo(): {
  name: string;
  phone?: string;
  email?: string;
  receiptFooter?: string;
} {
  return {
    name: currentAppSettings.business.name || "Thandal",
    phone: currentAppSettings.business.contactPhone,
    email: currentAppSettings.business.contactEmail,
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
 * Validates business settings patch.
 */
function validateBusinessPatch(patch: Partial<BusinessSettings>): string | null {
  if (patch.name !== undefined) {
    const trimmed = patch.name.trim();
    if (trimmed.length < 2 || trimmed.length > 80) {
      return "Business name must be between 2 and 80 characters.";
    }
  }
  if (patch.currency !== undefined && patch.currency !== "INR") {
    return "Currency must be INR.";
  }
  if (patch.timezone !== undefined && patch.timezone !== "Asia/Kolkata") {
    return "Timezone must be Asia/Kolkata.";
  }
  if (patch.contactPhone !== undefined && patch.contactPhone !== "") {
    const digits = patch.contactPhone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      return "Contact phone must be a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
    }
  }
  if (patch.contactEmail !== undefined && patch.contactEmail !== "") {
    const trimmed = patch.contactEmail.trim();
    if (trimmed.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Contact email must be a valid email address (max 120 characters).";
    }
  }
  if (patch.address !== undefined && patch.address !== "") {
    if (patch.address.length > 200) {
      return "Address cannot exceed 200 characters.";
    }
  }
  if (patch.licenceNo !== undefined && patch.licenceNo !== "") {
    const trimmed = patch.licenceNo.trim();
    if (trimmed.length < 4 || trimmed.length > 30) {
      return "Licence number must be between 4 and 30 characters.";
    }
  }
  if (patch.receiptFooter !== undefined && patch.receiptFooter !== "") {
    if (patch.receiptFooter.length > 120) {
      return "Receipt footer cannot exceed 120 characters.";
    }
  }
  return null;
}

/**
 * Validates loan defaults patch.
 */
function validateLoanDefaultsPatch(patch: Partial<LoanDefaultSettings>): string | null {
  if (patch.repaymentFrequency !== undefined) {
    if (!["daily", "weekly", "monthly"].includes(patch.repaymentFrequency)) {
      return "Invalid repayment frequency.";
    }
  }
  if (patch.interestMethod !== undefined && patch.interestMethod !== "flat") {
    return "Currently only flat rate interest calculation method is supported.";
  }
  if (patch.interestBasis !== undefined && patch.interestBasis !== "entire_term") {
    return "Currently only entire term interest basis is supported.";
  }
  return null;
}

/**
 * Validates calendar patch against existing or proposed collection days.
 */
function validateCalendarPatch(
  patch: Partial<CalendarSettingsModel>,
  existingCalendar: CalendarSettingsModel
): string | null {
  const merged: CalendarSettingsModel = { ...existingCalendar, ...patch };

  if (patch.weeklyDueDay !== undefined && (patch.weeklyDueDay < 0 || patch.weeklyDueDay > 6)) {
    return "Invalid weekly due day.";
  }
  if (patch.monthlyDueDay !== undefined && (patch.monthlyDueDay < 1 || patch.monthlyDueDay > 31)) {
    return "Monthly due day must be between 1 and 31.";
  }
  if (patch.monthEndRule !== undefined && !["last_valid_day", "first_of_next_month"].includes(patch.monthEndRule)) {
    return "Invalid month-end rule.";
  }
  if (
    patch.holidayRule !== undefined &&
    !["next_collection_day", "previous_collection_day", "no_adjustment"].includes(patch.holidayRule)
  ) {
    return "Invalid holiday rule.";
  }
  if (patch.collectionDays !== undefined) {
    if (!Array.isArray(patch.collectionDays) || patch.collectionDays.length === 0) {
      return "At least one collection day must be selected.";
    }
  }

  // Cross-field validation: Weekly due day MUST be a collection day
  if (!merged.collectionDays.includes(merged.weeklyDueDay)) {
    return "Weekly due day must be a collection day. Change collection days";
  }

  // Validate holidays if touched
  if (patch.holidays !== undefined) {
    if (Array.isArray(patch.holidays)) {
      const dates = new Set<string>();
      for (const h of patch.holidays) {
        if (!h.name || h.name.trim().length < 2 || h.name.trim().length > 60) {
          return "Holiday names must be between 2 and 60 characters.";
        }
        if (dates.has(h.date)) {
          return `Duplicate holiday date: ${h.date}`;
        }
        dates.add(h.date);
      }
    }
  }

  return null;
}

/**
 * Atomic multi-section update of application settings.
 * Enforces admin capability, server validation across all touched sections, optimistic concurrency
 * on each touched section, version increments, and dedicated privacy-compliant audit entries.
 */
export async function updateSettings(params: {
  patches?: SettingsPatches;
  // Single-section backward compatibility
  section?: SettingsSection;
  values?: Partial<BusinessSettings | LoanDefaultSettings | CalendarSettingsModel | NotificationSettings>;
  version?: number;
  versions?: Record<string, number>;
  actor?: SessionUser;
}): Promise<{ success: boolean; settings?: AppSettings; error?: string }> {
  const user = params.actor || DEMO_USERS.admin;
  if (!can(user, "manage_settings")) {
    return { success: false, error: "Unauthorized. Admin privileges required to update settings." };
  }

  // Normalize input patches
  const patches: SettingsPatches = params.patches || {};
  if (params.section && params.values) {
    patches[params.section] = params.values as any;
  }

  const touchedSections = (Object.keys(patches) as SettingsSection[]).filter(
    (k) => patches[k] !== undefined && Object.keys(patches[k] || {}).length > 0
  );

  if (touchedSections.length === 0) {
    return { success: true, settings: getSettings() };
  }

  // 1. Optimistic concurrency check across all touched sections
  const inputVersions = params.versions || {};
  if (params.section && params.version !== undefined) {
    inputVersions[params.section] = params.version;
  }

  for (const sec of touchedSections) {
    const requiredVersion = inputVersions[sec];
    if (requiredVersion !== undefined && requiredVersion !== currentAppSettings.versions[sec]) {
      return {
        success: false,
        error: "Settings changed elsewhere. Refreshing.",
        settings: getSettings(),
      };
    }
  }

  // 2. Validate every touched section before modifying any state
  if (patches.business) {
    const err = validateBusinessPatch(patches.business);
    if (err) return { success: false, error: err };
  }

  if (patches.loanDefaults) {
    const err = validateLoanDefaultsPatch(patches.loanDefaults);
    if (err) return { success: false, error: err };
  }

  if (patches.calendar) {
    const err = validateCalendarPatch(patches.calendar, currentAppSettings.calendar);
    if (err) return { success: false, error: err };
  }

  if (patches.notifications) {
    if (
      patches.notifications.reminderLeadDays !== undefined &&
      ![1, 2, 3].includes(patches.notifications.reminderLeadDays)
    ) {
      return { success: false, error: "Reminder lead days must be 1, 2, or 3." };
    }
  }

  // 3. Atomically apply patches and generate audit details
  const auditEntriesToAppend: { section: SettingsSection; details: string }[] = [];

  if (patches.business) {
    const bPatch = patches.business;
    const changedFields: string[] = [];
    if (bPatch.name !== undefined && bPatch.name !== currentAppSettings.business.name) changedFields.push("name");
    if (bPatch.contactPhone !== undefined && bPatch.contactPhone !== currentAppSettings.business.contactPhone) changedFields.push("contactPhone");
    if (bPatch.contactEmail !== undefined && bPatch.contactEmail !== currentAppSettings.business.contactEmail) changedFields.push("contactEmail");
    if (bPatch.address !== undefined && bPatch.address !== currentAppSettings.business.address) changedFields.push("address");
    if (bPatch.licenceNo !== undefined && bPatch.licenceNo !== currentAppSettings.business.licenceNo) changedFields.push("licenceNo");
    if (bPatch.receiptFooter !== undefined && bPatch.receiptFooter !== currentAppSettings.business.receiptFooter) changedFields.push("receiptFooter");

    currentAppSettings.business = {
      ...currentAppSettings.business,
      ...bPatch,
      currency: "INR",
      timezone: "Asia/Kolkata",
    };
    currentAppSettings.versions.business += 1;

    auditEntriesToAppend.push({
      section: "business",
      details: changedFields.length > 0
        ? `Business settings updated (fields: ${changedFields.join(", ")})`
        : "Business settings updated",
    });
  }

  if (patches.loanDefaults) {
    const ldPatch = patches.loanDefaults;
    const prevFreq = currentAppSettings.loanDefaults.repaymentFrequency;
    const newFreq = ldPatch.repaymentFrequency || prevFreq;

    currentAppSettings.loanDefaults = {
      ...currentAppSettings.loanDefaults,
      ...ldPatch,
    };
    currentAppSettings.versions.loanDefaults += 1;

    auditEntriesToAppend.push({
      section: "loanDefaults",
      details: prevFreq !== newFreq
        ? `Loan defaults updated: Repayment frequency ${prevFreq} -> ${newFreq}`
        : "Loan defaults updated",
    });
  }

  if (patches.calendar) {
    const calPatch = patches.calendar;
    currentAppSettings.calendar = {
      ...currentAppSettings.calendar,
      ...calPatch,
    };
    currentAppSettings.versions.calendar += 1;

    let calDetails = "Calendar settings updated";
    if (calPatch.collectionDays && !calPatch.weeklyDueDay) {
      calDetails = `Collection days updated: ${calPatch.collectionDays.length} days`;
    } else if (calPatch.holidays) {
      calDetails = `Holidays updated: ${calPatch.holidays.length} holidays configured`;
    }
    auditEntriesToAppend.push({
      section: "calendar",
      details: calDetails,
    });
  }

  if (patches.notifications) {
    currentAppSettings.notifications = {
      ...currentAppSettings.notifications,
      ...patches.notifications,
    };
    currentAppSettings.versions.notifications += 1;

    auditEntriesToAppend.push({
      section: "notifications",
      details: `Notification settings updated: lead days ${currentAppSettings.notifications.reminderLeadDays}`,
    });
  }

  // Append audit entries
  for (const entry of auditEntriesToAppend) {
    appendAudit({
      action: "settings_updated",
      entityType: "settings",
      entityId: entry.section,
      details: entry.details,
      actorOverride: user,
    });
  }

  return {
    success: true,
    settings: getSettings(),
  };
}

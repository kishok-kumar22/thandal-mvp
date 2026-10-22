import type { Weekday, MonthEndRule, HolidayRule, Frequency, HolidayItem } from "@/lib/calendar";
export type { HolidayItem };

export type NotificationKind =
  | "payment_recorded"
  | "instalment_upcoming"
  | "instalment_overdue"
  | "handover_submitted"
  | "handover_decided"
  | "waiver_requested"
  | "waiver_decided"
  | "support_request_received"
  | "support_request_updated";

export interface BusinessSettings {
  name: string;
  licenceNo?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  receiptFooter?: string;
  currency: "INR";
  timezone: "Asia/Kolkata";
}

export interface LoanDefaultSettings {
  repaymentFrequency: Frequency;
  interestMethod: "flat";
  interestBasis: "entire_term";
}

export interface CalendarSettingsModel {
  weeklyDueDay: Weekday;
  monthlyDueDay: number; // 1-31
  monthEndRule: MonthEndRule;
  holidayRule: HolidayRule;
  collectionDays: Weekday[];
  holidays: HolidayItem[];
}

export interface NotificationSettings {
  events: Record<NotificationKind, { inApp: boolean }>;
  reminderLeadDays: 1 | 2 | 3;
}

export interface AppSettings {
  versions: Record<"business" | "loanDefaults" | "calendar" | "notifications", number>;
  business: BusinessSettings;
  loanDefaults: LoanDefaultSettings;
  calendar: CalendarSettingsModel;
  notifications: NotificationSettings;
}

export const INITIAL_SETTINGS: AppSettings = {
  versions: {
    business: 1,
    loanDefaults: 1,
    calendar: 1,
    notifications: 1,
  },
  business: {
    name: "Thandal",
    licenceNo: "LIC-TN-2024-8849",
    contactPhone: "9876540000",
    contactEmail: "contact@thandal.in",
    address: "No. 42, West Cross Street, Anna Nagar, Madurai, Tamil Nadu 625020",
    receiptFooter: "Thank you for prompt repayment. Retain this digital receipt for your records.",
    currency: "INR",
    timezone: "Asia/Kolkata",
  },
  loanDefaults: {
    repaymentFrequency: "daily",
    interestMethod: "flat",
    interestBasis: "entire_term",
  },
  calendar: {
    weeklyDueDay: 1, // Monday
    monthlyDueDay: 5,
    monthEndRule: "last_valid_day",
    holidayRule: "next_collection_day",
    collectionDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
    holidays: [],
  },
  notifications: {
    reminderLeadDays: 1,
    events: {
      payment_recorded: { inApp: true },
      instalment_upcoming: { inApp: true },
      instalment_overdue: { inApp: true },
      handover_submitted: { inApp: true },
      handover_decided: { inApp: true },
      waiver_requested: { inApp: true },
      waiver_decided: { inApp: true },
      support_request_received: { inApp: true },
      support_request_updated: { inApp: true },
    },
  },
};

// In-memory single-source-of-truth settings store
export let currentAppSettings: AppSettings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));

export function resetAppSettings(): void {
  currentAppSettings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
}

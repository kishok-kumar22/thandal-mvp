"use server";

import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import {
  updateSettings as coreUpdateSettings,
  type SettingsSection,
  type SettingsPatches,
} from "@/lib/settings";
import type {
  AppSettings,
  BusinessSettings,
  LoanDefaultSettings,
  CalendarSettingsModel,
  NotificationSettings,
} from "@/data/mockSettings";

export async function updateSettings(params: {
  patches?: SettingsPatches;
  versions?: Partial<Record<SettingsSection, number>>;
  section?: SettingsSection;
  values?: Partial<BusinessSettings | LoanDefaultSettings | CalendarSettingsModel | NotificationSettings>;
  version?: number;
}): Promise<{ success: boolean; settings?: AppSettings; error?: string }> {
  const user = await getCurrentUser();
  if (!user || !can(user, "manage_settings")) {
    return { success: false, error: "Unauthorized. Admin privileges required to update settings." };
  }
  return coreUpdateSettings({ ...params, actor: user });
}

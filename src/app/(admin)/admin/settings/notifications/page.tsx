import React from "react";
import { getSettings } from "@/lib/settings";
import { NotificationSettingsTable } from "@/components/settings/NotificationSettingsTable";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

export const metadata = {
  title: "Notification Settings - Settings | THANDAL",
  description: "Configure in-app event notifications, reminder lead days, and multi-channel delivery rules.",
};

export default function NotificationSettingsPage() {
  const settings = getSettings();

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Settings"
        subtitle="Configure in-app event notifications, reminder lead days, and delivery rules."
      />
      <NotificationSettingsTable
        initialNotifications={settings.notifications}
        version={settings.versions.notifications}
      />
    </div>
  );
}

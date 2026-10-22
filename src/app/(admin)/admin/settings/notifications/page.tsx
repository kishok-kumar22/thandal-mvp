import React from "react";
import { getSettings } from "@/lib/settings";
import { NotificationSettingsTable } from "@/components/settings/NotificationSettingsTable";

export const metadata = {
  title: "Notification Settings - Settings | THANDAL",
  description: "Configure in-app event notifications, reminder lead days, and multi-channel delivery rules.",
};

export default function NotificationSettingsPage() {
  const settings = getSettings();

  return (
    <NotificationSettingsTable
      initialNotifications={settings.notifications}
      version={settings.versions.notifications}
    />
  );
}

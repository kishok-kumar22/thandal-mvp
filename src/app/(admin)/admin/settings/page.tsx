import React from "react";
import { getSettings } from "@/lib/settings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { GeneralSettingsForm } from "@/components/settings/GeneralSettingsForm";

export const metadata = {
  title: "Business & loan settings - Settings | THANDAL",
  description: "Configure your business details, loan defaults, collection calendar and more.",
};

export default function SettingsGeneralPage() {
  const settings = getSettings();

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Business & loan settings"
        subtitle="Configure your business details, loan defaults, collection calendar and more."
      />
      <GeneralSettingsForm initialSettings={settings} />
    </div>
  );
}

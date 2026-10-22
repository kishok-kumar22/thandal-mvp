import React from "react";
import { getSettings } from "@/lib/settings";
import { BusinessForm } from "@/components/settings/BusinessForm";

export const metadata = {
  title: "Business Profile - Settings | THANDAL",
  description: "Configure business branding, registration licence, and public contact information.",
};

export default function BusinessSettingsPage() {
  const settings = getSettings();

  return (
    <BusinessForm
      initialBusiness={settings.business}
      version={settings.versions.business}
    />
  );
}

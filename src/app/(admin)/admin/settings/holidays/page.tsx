import React from "react";
import { getSettings } from "@/lib/settings";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { HolidaysPageForm } from "@/components/settings/HolidaysPageForm";

export const metadata = {
  title: "Collection days & holidays - Settings | THANDAL",
  description: "Choose collection days and mark holidays.",
};

export default function SettingsHolidaysPage() {
  const settings = getSettings();

  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Collection days & holidays"
        subtitle="Choose collection days and mark holidays."
      />
      <HolidaysPageForm initialSettings={settings} />
    </div>
  );
}

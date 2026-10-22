import React from "react";
import { getSettings } from "@/lib/settings";
import { CollectionCalendarForm } from "@/components/settings/CollectionCalendarForm";

export const metadata = {
  title: "Collection Calendar - Settings | THANDAL",
  description: "Configure weekly collection days, calendar rules, and annual holidays.",
};

export default function CollectionCalendarPage() {
  const settings = getSettings();

  return (
    <CollectionCalendarForm
      initialCalendar={settings.calendar}
      version={settings.versions.calendar}
    />
  );
}

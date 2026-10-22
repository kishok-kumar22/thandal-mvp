"use client";

import React, { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { CollectionCalendarCard } from "./CollectionCalendarCard";
import { CollectionDaysCard } from "./CollectionDaysCard";
import { HolidaysCard } from "./HolidaysCard";
import { CalendarPreviewCard } from "./CalendarPreviewCard";
import { Button } from "@/components/ui/Button";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { useToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateSettings } from "@/app/(admin)/admin/settings/actions";
import type { CalendarSettingsModel } from "@/data/mockSettings";

interface CollectionCalendarFormProps {
  initialCalendar: CalendarSettingsModel;
  version: number;
}

export function CollectionCalendarForm({
  initialCalendar,
  version: initialVersion,
}: CollectionCalendarFormProps) {
  const { showToast } = useToast();

  const [calendar, setCalendar] = useState<CalendarSettingsModel>(initialCalendar);
  const [version, setVersion] = useState(initialVersion);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const isDirty = JSON.stringify(calendar) !== JSON.stringify(initialCalendar);
  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setCalendar(initialCalendar);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!calendar.collectionDays.includes(calendar.weeklyDueDay)) {
      newErrors.weeklyDueDay = "Weekly due day must be a collection day.";
    }

    if (calendar.collectionDays.length === 0) {
      newErrors.collectionDays = "At least one collection day must be selected.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = await updateSettings({
        section: "calendar",
        values: calendar,
        version,
      });

      if (!res.success) {
        showToast(res.error || "Failed to update collection calendar.", "error");
        if (res.settings) {
          setCalendar(res.settings.calendar);
          setVersion(res.settings.versions.calendar);
        }
        return;
      }

      showToast("Collection calendar saved successfully.", "success");
      if (res.settings) {
        setVersion(res.settings.versions.calendar);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {guardModal}

      {/* Card 1: Default rules */}
      <CollectionCalendarCard
        values={calendar}
        onChange={(updates) => setCalendar((prev) => ({ ...prev, ...updates }))}
        errors={errors}
      />

      {/* Card 2: Collection days */}
      <CollectionDaysCard
        collectionDays={calendar.collectionDays}
        onChange={(days) => setCalendar((prev) => ({ ...prev, collectionDays: days }))}
        error={errors.collectionDays}
      />

      {/* Card 3: Holidays */}
      <HolidaysCard
        holidays={calendar.holidays}
        onChange={(h) => setCalendar((prev) => ({ ...prev, holidays: h }))}
      />

      {/* Card 4: Preview */}
      <CalendarPreviewCard calendar={calendar} />

      {/* Info notice */}
      <InfoPanel>
        Changes apply to new loans only. Existing repayment schedules are not changed.
      </InfoPanel>

      {/* Footer bar */}
      <PageFooterBar
        left={
          isDirty ? (
            <span className="text-amber-600 font-semibold text-xs flex items-center gap-1.5">
              Unsaved changes
            </span>
          ) : null
        }
        right={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!isDirty || isPending}
              className="h-11 px-6 rounded-lg text-sm font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!isDirty || isPending}
              className="h-11 px-6 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save changes</span>
            </Button>
          </>
        }
      />
    </form>
  );
}

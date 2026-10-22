"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { AppSettings, HolidayItem } from "@/data/mockSettings";
import { CollectionDaysCard } from "./CollectionDaysCard";
import { HolidaysCard } from "./HolidaysCard";
import { CalendarPreviewCard } from "./CalendarPreviewCard";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateSettings } from "@/app/(admin)/admin/settings/actions";
import { WEEKDAY_NAMES, type Weekday } from "@/lib/calendar";

interface HolidaysPageFormProps {
  initialSettings: AppSettings;
}

export function HolidaysPageForm({ initialSettings }: HolidaysPageFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [collectionDays, setCollectionDays] = useState<Weekday[]>(
    initialSettings.calendar.collectionDays
  );
  const [holidays, setHolidays] = useState<HolidayItem[]>(
    initialSettings.calendar.holidays
  );
  const [error, setError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isDaysDirty =
    JSON.stringify(collectionDays.slice().sort()) !==
    JSON.stringify(initialSettings.calendar.collectionDays.slice().sort());
  const isHolidaysDirty =
    JSON.stringify(holidays) !== JSON.stringify(initialSettings.calendar.holidays);
  const isDirty = isDaysDirty || isHolidaysDirty;

  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setCollectionDays(initialSettings.calendar.collectionDays);
    setHolidays(initialSettings.calendar.holidays);
    setError(null);
    setConflictError(null);
  };

  const validate = (): boolean => {
    if (collectionDays.length === 0) {
      setError("At least one collection day must be selected.");
      return false;
    }

    const savedWeeklyDueDay = initialSettings.calendar.weeklyDueDay;
    if (!collectionDays.includes(savedWeeklyDueDay)) {
      setError(
        `Weekly due day (${WEEKDAY_NAMES[savedWeeklyDueDay]}) must be one of your active collection days.`
      );
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = await updateSettings({
        patches: {
          calendar: {
            collectionDays,
            holidays,
          },
        },
        versions: {
          calendar: initialSettings.versions.calendar,
        },
      });

      if (!res.success) {
        if (res.error?.includes("changed elsewhere")) {
          setConflictError("Settings changed elsewhere. Refreshing with latest calendar.");
        }
        showToast(res.error || "Failed to save calendar changes.", "error");
        if (res.settings) {
          setCollectionDays(res.settings.calendar.collectionDays);
          setHolidays(res.settings.calendar.holidays);
        }
        return;
      }

      setConflictError(null);
      showToast("Calendar settings saved", "success");
      router.refresh();
    });
  };

  // Preview card merges saved rules from General with currently staged collection days & holidays
  const previewCalendar = {
    ...initialSettings.calendar,
    collectionDays,
    holidays,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {guardModal}

      {conflictError && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"
        >
          {conflictError}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"
        >
          {error}
        </div>
      )}

      {/* Card 1: Collection Days */}
      <CollectionDaysCard
        collectionDays={collectionDays}
        onChange={(days) => {
          setCollectionDays(days);
          if (error) setError(null);
        }}
      />

      {/* Card 2: Holidays */}
      <HolidaysCard
        holidays={holidays}
        onChange={(updatedHolidays) => setHolidays(updatedHolidays)}
      />

      {/* Card 3: Preview */}
      <CalendarPreviewCard calendar={previewCalendar} />

      {/* Sticky PageFooterBar */}
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

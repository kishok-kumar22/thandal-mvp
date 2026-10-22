"use client";

import React, { useState, useTransition } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { CollectionCalendarCard } from "./CollectionCalendarCard";
import { Button } from "@/components/ui/Button";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { useToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateSettings } from "@/app/(admin)/admin/settings/actions";
import type { AppSettings, LoanDefaultSettings, CalendarSettingsModel } from "@/data/mockSettings";
import type { Frequency } from "@/lib/calendar";

interface LoanDefaultsFormProps {
  initialSettings: AppSettings;
}

export function LoanDefaultsForm({ initialSettings }: LoanDefaultsFormProps) {
  const { showToast } = useToast();

  const [loanDefaults, setLoanDefaults] = useState<LoanDefaultSettings>(
    initialSettings.loanDefaults
  );
  const [calendar, setCalendar] = useState<CalendarSettingsModel>(
    initialSettings.calendar
  );
  const [versions, setVersions] = useState(initialSettings.versions);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Determine dirty state
  const isDirty =
    JSON.stringify(loanDefaults) !== JSON.stringify(initialSettings.loanDefaults) ||
    JSON.stringify(calendar) !== JSON.stringify(initialSettings.calendar);

  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setLoanDefaults(initialSettings.loanDefaults);
    setCalendar(initialSettings.calendar);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!calendar.collectionDays.includes(calendar.weeklyDueDay)) {
      newErrors.weeklyDueDay = "Weekly due day must be a collection day.";
    }

    if (calendar.monthlyDueDay < 1 || calendar.monthlyDueDay > 31) {
      newErrors.monthlyDueDay = "Monthly due day must be between 1 and 31.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      // 1. Update loanDefaults
      const res1 = await updateSettings({
        section: "loanDefaults",
        values: loanDefaults,
        version: versions.loanDefaults,
      });

      if (!res1.success) {
        showToast(res1.error || "Failed to update loan defaults.", "error");
        if (res1.settings) {
          setLoanDefaults(res1.settings.loanDefaults);
          setVersions(res1.settings.versions);
        }
        return;
      }

      // 2. Update calendar
      const res2 = await updateSettings({
        section: "calendar",
        values: calendar,
        version: versions.calendar,
      });

      if (!res2.success) {
        showToast(res2.error || "Failed to update calendar.", "error");
        if (res2.settings) {
          setCalendar(res2.settings.calendar);
          setVersions(res2.settings.versions);
        }
        return;
      }

      showToast("Settings saved successfully.", "success");
      if (res2.settings) {
        setVersions(res2.settings.versions);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {guardModal}

      {/* CARD 1: Loan default settings */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
            Loan default settings
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            These settings will be used as defaults when creating new loans. You can change them for individual loans if needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repayment Frequency */}
          <div className="space-y-2">
            <label
              htmlFor="default-repayment-frequency"
              className="block text-sm font-semibold text-[#0B1B3F]"
            >
              Repayment frequency
            </label>
            <div className="relative">
              <select
                id="default-repayment-frequency"
                value={loanDefaults.repaymentFrequency}
                onChange={(e) =>
                  setLoanDefaults((prev) => ({
                    ...prev,
                    repaymentFrequency: e.target.value as Frequency,
                  }))
                }
                className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <ChevronDown
                className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Interest Calculation Method */}
          <div className="space-y-2">
            <label
              htmlFor="default-interest-method"
              className="block text-sm font-semibold text-[#0B1B3F]"
            >
              Interest calculation method
            </label>
            <div className="relative">
              <select
                id="default-interest-method"
                value={loanDefaults.interestMethod}
                disabled
                className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-slate-50 border border-[#D9E1EC] appearance-none text-[#0B1B3F] opacity-90 cursor-not-allowed"
              >
                <option value="flat">Flat rate</option>
                <option value="reducing" disabled>
                  Reducing balance (coming soon)
                </option>
              </select>
              <ChevronDown
                className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Interest Basis */}
          <div className="space-y-2">
            <label
              htmlFor="default-interest-basis"
              className="block text-sm font-semibold text-[#0B1B3F]"
            >
              Interest basis
            </label>
            <div className="relative">
              <select
                id="default-interest-basis"
                value={loanDefaults.interestBasis}
                disabled
                className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-slate-50 border border-[#D9E1EC] appearance-none text-[#0B1B3F] opacity-90 cursor-not-allowed"
              >
                <option value="entire_term">Entire term</option>
                <option value="per_period" disabled>
                  Per period (coming soon)
                </option>
              </select>
              <ChevronDown
                className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: Default collection calendar (Reusable component) */}
      <CollectionCalendarCard
        values={calendar}
        onChange={(updates) => setCalendar((prev) => ({ ...prev, ...updates }))}
        errors={errors}
      />

      {/* Info Notice */}
      <InfoPanel>
        Changes apply to new loans only. Existing repayment schedules are not changed.
      </InfoPanel>

      {/* Sticky Bottom Actions Bar */}
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

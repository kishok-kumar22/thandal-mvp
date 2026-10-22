"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { AppSettings, BusinessSettings, LoanDefaultSettings, CalendarSettingsModel } from "@/data/mockSettings";
import { BusinessDetailsCard } from "./BusinessDetailsCard";
import { LoanDefaultsCard } from "./LoanDefaultsCard";
import { CollectionCalendarCard } from "./CollectionCalendarCard";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateSettings } from "@/app/(admin)/admin/settings/actions";
import type { SettingsPatches } from "@/lib/settings";

interface GeneralSettingsFormProps {
  initialSettings: AppSettings;
}

export function GeneralSettingsForm({ initialSettings }: GeneralSettingsFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [business, setBusiness] = useState<BusinessSettings>(initialSettings.business);
  const [loanDefaults, setLoanDefaults] = useState<LoanDefaultSettings>(initialSettings.loanDefaults);
  const [calendar, setCalendar] = useState<CalendarSettingsModel>(initialSettings.calendar);

  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Dirty detection comparing against initial
  const isBusinessDirty = JSON.stringify(business) !== JSON.stringify(initialSettings.business);
  const isLoanDefaultsDirty = JSON.stringify(loanDefaults) !== JSON.stringify(initialSettings.loanDefaults);
  // In General, calendar checks weeklyDueDay, monthlyDueDay, monthEndRule, holidayRule
  const isCalendarDirty =
    calendar.weeklyDueDay !== initialSettings.calendar.weeklyDueDay ||
    calendar.monthlyDueDay !== initialSettings.calendar.monthlyDueDay ||
    calendar.monthEndRule !== initialSettings.calendar.monthEndRule ||
    calendar.holidayRule !== initialSettings.calendar.holidayRule;

  const isDirty = isBusinessDirty || isLoanDefaultsDirty || isCalendarDirty;
  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setBusiness(initialSettings.business);
    setLoanDefaults(initialSettings.loanDefaults);
    setCalendar(initialSettings.calendar);
    setErrors({});
    setConflictError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Business Validation
    const nameTrimmed = business.name.trim();
    if (nameTrimmed.length < 2 || nameTrimmed.length > 80) {
      newErrors.name = "Business name must be between 2 and 80 characters.";
    }

    if (business.contactPhone) {
      const digits = business.contactPhone.replace(/\D/g, "");
      if (!/^[6-9]\d{9}$/.test(digits)) {
        newErrors.contactPhone = "Contact phone must be a 10-digit mobile number starting with 6, 7, 8, or 9.";
      }
    }

    if (business.contactEmail) {
      const emailTrimmed = business.contactEmail.trim();
      if (emailTrimmed.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
        newErrors.contactEmail = "Enter a valid email address (max 120 characters).";
      }
    }

    if (business.licenceNo) {
      const licTrimmed = business.licenceNo.trim();
      if (licTrimmed.length < 4 || licTrimmed.length > 30) {
        newErrors.licenceNo = "Licence number must be between 4 and 30 characters.";
      }
    }

    if (business.receiptFooter && business.receiptFooter.length > 120) {
      newErrors.receiptFooter = "Receipt footer cannot exceed 120 characters.";
    }

    if (business.address && business.address.length > 200) {
      newErrors.address = "Address cannot exceed 200 characters.";
    }

    // 2. Calendar Validation
    // Weekly due day must be in saved collection days
    if (!initialSettings.calendar.collectionDays.includes(calendar.weeklyDueDay)) {
      newErrors.weeklyDueDay = "Weekly due day must be a collection day.";
    }

    setErrors(newErrors);

    // If any contact detail failed, auto-expand the collapsible
    const contactFields = ["contactPhone", "contactEmail", "licenceNo", "receiptFooter", "address"];
    const hasContactError = contactFields.some((f) => Boolean(newErrors[f]));
    if (hasContactError) {
      setIsContactExpanded(true);
    }

    const firstInvalidKey = Object.keys(newErrors)[0];
    if (firstInvalidKey) {
      // Find matching input element and focus
      setTimeout(() => {
        let el = document.getElementById(`setting-${firstInvalidKey}`);
        if (!el && firstInvalidKey === "name") el = document.getElementById("setting-business-name");
        if (!el && firstInvalidKey === "weeklyDueDay") el = document.getElementById("calendar-weekly-day");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }, 50);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const patches: SettingsPatches = {};
      const versions: Partial<Record<"business" | "loanDefaults" | "calendar", number>> = {};

      if (isBusinessDirty) {
        patches.business = business;
        versions.business = initialSettings.versions.business;
      }
      if (isLoanDefaultsDirty) {
        patches.loanDefaults = loanDefaults;
        versions.loanDefaults = initialSettings.versions.loanDefaults;
      }
      if (isCalendarDirty) {
        patches.calendar = {
          weeklyDueDay: calendar.weeklyDueDay,
          monthlyDueDay: calendar.monthlyDueDay,
          monthEndRule: calendar.monthEndRule,
          holidayRule: calendar.holidayRule,
        };
        versions.calendar = initialSettings.versions.calendar;
      }

      const res = await updateSettings({ patches, versions });

      if (!res.success) {
        if (res.error?.includes("changed elsewhere")) {
          setConflictError("Settings changed elsewhere. Refreshing with latest values.");
        }
        showToast(res.error || "Failed to save settings.", "error");
        if (res.settings) {
          setBusiness(res.settings.business);
          setLoanDefaults(res.settings.loanDefaults);
          setCalendar(res.settings.calendar);
        }
        return;
      }

      setConflictError(null);
      showToast("Settings saved", "success");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      {guardModal}

      {/* Conflict Error Notice */}
      {conflictError && (
        <div
          role="alert"
          tabIndex={-1}
          className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"
        >
          {conflictError}
        </div>
      )}

      {/* CARD 1: Business details */}
      <BusinessDetailsCard
        values={business}
        onChange={(updates) => {
          setBusiness((prev) => ({ ...prev, ...updates }));
          if (errors.name && updates.name) setErrors((e) => ({ ...e, name: "" }));
        }}
        errors={errors}
        isContactExpanded={isContactExpanded}
        setIsContactExpanded={setIsContactExpanded}
      />

      {/* CARD 2: Loan defaults */}
      <LoanDefaultsCard
        values={loanDefaults}
        onChange={(updates) => setLoanDefaults((prev) => ({ ...prev, ...updates }))}
        errors={errors}
      />

      {/* CARD 3: Collection calendar */}
      <CollectionCalendarCard
        values={calendar}
        onChange={(updates) => {
          setCalendar((prev) => ({ ...prev, ...updates }));
          if (errors.weeklyDueDay && updates.weeklyDueDay !== undefined) {
            setErrors((e) => ({ ...e, weeklyDueDay: "" }));
          }
        }}
        errors={errors}
      />

      {/* Muted line under card 3 */}
      <p className="text-xs sm:text-sm text-[#64748B] px-1 font-normal">
        Changes apply to new loans only. Existing repayment schedules are not changed.
      </p>

      {/* STICKY PageFooterBar */}
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

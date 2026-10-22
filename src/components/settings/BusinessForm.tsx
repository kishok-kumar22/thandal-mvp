"use client";

import React, { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { useToast } from "@/components/ui/Toast";
import { useUnsavedChangesGuard } from "@/lib/useUnsavedChangesGuard";
import { updateSettings } from "@/app/(admin)/admin/settings/actions";
import type { BusinessSettings } from "@/data/mockSettings";

interface BusinessFormProps {
  initialBusiness: BusinessSettings;
  version: number;
}

export function BusinessForm({ initialBusiness, version: initialVersion }: BusinessFormProps) {
  const { showToast } = useToast();

  const [business, setBusiness] = useState<BusinessSettings>(initialBusiness);
  const [version, setVersion] = useState(initialVersion);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const isDirty = JSON.stringify(business) !== JSON.stringify(initialBusiness);
  const { guardModal } = useUnsavedChangesGuard(isDirty);

  const handleReset = () => {
    setBusiness(initialBusiness);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!business.name || business.name.trim().length < 2 || business.name.trim().length > 80) {
      newErrors.name = "Business name must be between 2 and 80 characters.";
    }

    if (business.licenceNo && (business.licenceNo.length < 4 || business.licenceNo.length > 30)) {
      newErrors.licenceNo = "Licence number must be between 4 and 30 characters.";
    }

    const cleanPhone = business.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit Indian contact phone number.";
    }

    if (!business.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!business.address || business.address.trim().length < 10 || business.address.trim().length > 200) {
      newErrors.address = "Business address must be between 10 and 200 characters.";
    }

    if (business.receiptFooter && business.receiptFooter.length > 120) {
      newErrors.receiptFooter = "Receipt footer cannot exceed 120 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = await updateSettings({
        section: "business",
        values: business,
        version,
      });

      if (!res.success) {
        showToast(res.error || "Failed to update business settings.", "error");
        if (res.settings) {
          setBusiness(res.settings.business);
          setVersion(res.settings.versions.business);
        }
        return;
      }

      showToast("Business settings saved successfully.", "success");
      if (res.settings) {
        setVersion(res.settings.versions.business);
      }
    });
  };

  const footerLen = (business.receiptFooter || "").length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {guardModal}

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
            Business profile
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            General company branding, licensing, and contact details used on printed receipts and public contact pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="biz-name" className="block text-sm font-semibold text-[#0B1B3F]">
              Business name <span className="text-red-500">*</span>
            </label>
            <input
              id="biz-name"
              type="text"
              value={business.name}
              onChange={(e) => setBusiness((prev) => ({ ...prev, name: e.target.value }))}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "biz-name-error" : undefined}
              className={`w-full h-12 px-4 text-base rounded-lg border bg-white text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.name ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.name && (
              <p id="biz-name-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Licence Number */}
          <div className="space-y-1.5">
            <label htmlFor="biz-licence" className="block text-sm font-semibold text-[#0B1B3F]">
              Licence / registration number <span className="text-[#94A3B8] font-normal">(optional)</span>
            </label>
            <input
              id="biz-licence"
              type="text"
              value={business.licenceNo || ""}
              onChange={(e) => setBusiness((prev) => ({ ...prev, licenceNo: e.target.value }))}
              aria-invalid={Boolean(errors.licenceNo)}
              aria-describedby={errors.licenceNo ? "biz-licence-error" : undefined}
              placeholder="e.g. TN-MFI-2024-8849"
              className={`w-full h-12 px-4 text-base rounded-lg border bg-white text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.licenceNo ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.licenceNo && (
              <p id="biz-licence-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.licenceNo}
              </p>
            )}
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <label htmlFor="biz-phone" className="block text-sm font-semibold text-[#0B1B3F]">
              Contact phone <span className="text-red-500">*</span>
            </label>
            <input
              id="biz-phone"
              type="tel"
              value={business.phone}
              onChange={(e) => setBusiness((prev) => ({ ...prev, phone: e.target.value }))}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "biz-phone-error" : undefined}
              className={`w-full h-12 px-4 text-base rounded-lg border bg-white text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.phone ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.phone && (
              <p id="biz-phone-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="biz-email" className="block text-sm font-semibold text-[#0B1B3F]">
              Contact email <span className="text-red-500">*</span>
            </label>
            <input
              id="biz-email"
              type="email"
              value={business.email}
              onChange={(e) => setBusiness((prev) => ({ ...prev, email: e.target.value }))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "biz-email-error" : undefined}
              className={`w-full h-12 px-4 text-base rounded-lg border bg-white text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.email ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.email && (
              <p id="biz-email-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label htmlFor="biz-address" className="block text-sm font-semibold text-[#0B1B3F]">
              Physical address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="biz-address"
              rows={3}
              value={business.address}
              onChange={(e) => setBusiness((prev) => ({ ...prev, address: e.target.value }))}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "biz-address-error" : undefined}
              className={`w-full p-4 text-base rounded-lg border bg-white text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.address ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.address && (
              <p id="biz-address-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.address}
              </p>
            )}
          </div>

          {/* Receipt Footer */}
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <label htmlFor="biz-footer" className="block text-sm font-semibold text-[#0B1B3F]">
                Receipt footer note <span className="text-[#94A3B8] font-normal">(optional)</span>
              </label>
              <span className={`text-xs ${footerLen > 120 ? "text-red-600 font-bold" : "text-[#94A3B8]"}`}>
                {footerLen} / 120
              </span>
            </div>
            <input
              id="biz-footer"
              type="text"
              maxLength={120}
              value={business.receiptFooter || ""}
              onChange={(e) => setBusiness((prev) => ({ ...prev, receiptFooter: e.target.value }))}
              placeholder="e.g. Thank you for prompt repayment. Retain for your records."
              className="w-full h-12 px-4 text-base rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF]"
            />
          </div>

          {/* Read-only Currency & Timezone */}
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
            <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block">
              Default Currency
            </span>
            <span className="text-sm font-bold text-[#0B1B3F]">
              Indian rupee (₹)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-1">
            <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block">
              Time Zone
            </span>
            <span className="text-sm font-bold text-[#0B1B3F]">
              Asia/Kolkata (IST)
            </span>
          </div>
        </div>
      </div>

      <InfoPanel>
        Contact phone and email are published on borrower receipts and public customer support pages.
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

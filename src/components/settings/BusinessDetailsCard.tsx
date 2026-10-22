"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { BusinessSettings } from "@/data/mockSettings";
import { Collapsible } from "@/components/ui/Collapsible";

interface BusinessDetailsCardProps {
  values: BusinessSettings;
  onChange: (updates: Partial<BusinessSettings>) => void;
  errors?: Record<string, string>;
  isContactExpanded: boolean;
  setIsContactExpanded: (expanded: boolean) => void;
}

export function BusinessDetailsCard({
  values,
  onChange,
  errors = {},
  isContactExpanded,
  setIsContactExpanded,
}: BusinessDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
          Business details
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Set your business information and regional preferences.
        </p>
      </div>

      {/* Row 1: 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Name */}
        <div className="space-y-2">
          <label htmlFor="setting-business-name" className="block text-sm font-semibold text-[#0B1B3F]">
            Business name
          </label>
          <input
            id="setting-business-name"
            type="text"
            value={values.name}
            onChange={(e) => onChange({ name: e.target.value })}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "setting-business-name-error" : undefined}
            className={`w-full h-14 px-4 text-base rounded-lg bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.name ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
          {errors.name && (
            <p id="setting-business-name-error" className="text-xs text-[#E5252A] font-medium" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label htmlFor="setting-business-currency" className="block text-sm font-semibold text-[#0B1B3F]">
            Currency
          </label>
          <div className="relative">
            <select
              id="setting-business-currency"
              value={values.currency}
              onChange={(e) => onChange({ currency: e.target.value as "INR" })}
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
            >
              <option value="INR">INR</option>
              <option value="USD" disabled>
                USD (coming soon)
              </option>
              <option value="EUR" disabled>
                EUR (coming soon)
              </option>
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label htmlFor="setting-business-timezone" className="block text-sm font-semibold text-[#0B1B3F]">
            Timezone
          </label>
          <div className="relative">
            <select
              id="setting-business-timezone"
              value={values.timezone}
              onChange={(e) => onChange({ timezone: e.target.value as "Asia/Kolkata" })}
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="UTC" disabled>
                UTC (coming soon)
              </option>
              <option value="Asia/Dubai" disabled>
                Asia/Dubai (coming soon)
              </option>
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Collapsible Row: Contact & receipt details (optional) */}
      <Collapsible
        id="contact-details-collapsible"
        title="Contact & receipt details (optional)"
        isOpen={isContactExpanded}
        onToggle={setIsContactExpanded}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Contact Phone */}
          <div className="space-y-2">
            <label htmlFor="setting-contact-phone" className="block text-sm font-semibold text-[#0B1B3F]">
              Contact phone
            </label>
            <input
              id="setting-contact-phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={values.contactPhone || ""}
              onChange={(e) => onChange({ contactPhone: e.target.value })}
              aria-invalid={Boolean(errors.contactPhone)}
              aria-describedby={errors.contactPhone ? "setting-contact-phone-error" : undefined}
              className={`w-full h-14 px-4 text-base rounded-lg bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.contactPhone ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.contactPhone && (
              <p id="setting-contact-phone-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.contactPhone}
              </p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <label htmlFor="setting-contact-email" className="block text-sm font-semibold text-[#0B1B3F]">
              Contact email
            </label>
            <input
              id="setting-contact-email"
              type="email"
              placeholder="e.g. info@thandal.com"
              value={values.contactEmail || ""}
              onChange={(e) => onChange({ contactEmail: e.target.value })}
              aria-invalid={Boolean(errors.contactEmail)}
              aria-describedby={errors.contactEmail ? "setting-contact-email-error" : undefined}
              className={`w-full h-14 px-4 text-base rounded-lg bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.contactEmail ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.contactEmail && (
              <p id="setting-contact-email-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.contactEmail}
              </p>
            )}
          </div>

          {/* Licence / Registration Number */}
          <div className="space-y-2">
            <label htmlFor="setting-licence-no" className="block text-sm font-semibold text-[#0B1B3F]">
              Licence / registration number
            </label>
            <input
              id="setting-licence-no"
              type="text"
              placeholder="e.g. TN-ML-2024-001"
              value={values.licenceNo || ""}
              onChange={(e) => onChange({ licenceNo: e.target.value })}
              aria-invalid={Boolean(errors.licenceNo)}
              aria-describedby={errors.licenceNo ? "setting-licence-no-error" : undefined}
              className={`w-full h-14 px-4 text-base rounded-lg bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.licenceNo ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.licenceNo && (
              <p id="setting-licence-no-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.licenceNo}
              </p>
            )}
          </div>

          {/* Receipt Footer Note (max 120, counter) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="setting-receipt-footer" className="block text-sm font-semibold text-[#0B1B3F]">
                Receipt footer note
              </label>
              <span className="text-xs text-[#64748B]">
                {(values.receiptFooter || "").length}/120
              </span>
            </div>
            <input
              id="setting-receipt-footer"
              type="text"
              maxLength={120}
              placeholder="e.g. Simple Loans. Stronger Communities."
              value={values.receiptFooter || ""}
              onChange={(e) => onChange({ receiptFooter: e.target.value })}
              aria-invalid={Boolean(errors.receiptFooter)}
              aria-describedby={errors.receiptFooter ? "setting-receipt-footer-error" : undefined}
              className={`w-full h-14 px-4 text-base rounded-lg bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.receiptFooter ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.receiptFooter && (
              <p id="setting-receipt-footer-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.receiptFooter}
              </p>
            )}
          </div>

          {/* Address (textarea, max 200, counter, full width) */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="setting-address" className="block text-sm font-semibold text-[#0B1B3F]">
                Address
              </label>
              <span className="text-xs text-[#64748B]">
                {(values.address || "").length}/200
              </span>
            </div>
            <textarea
              id="setting-address"
              rows={3}
              maxLength={200}
              placeholder="e.g. 123 Anna Salai, Thousand Lights, Chennai - 600006"
              value={values.address || ""}
              onChange={(e) => onChange({ address: e.target.value })}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "setting-address-error" : undefined}
              className={`w-full p-4 text-base rounded-lg bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.address ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            {errors.address && (
              <p id="setting-address-error" className="text-xs text-[#E5252A] font-medium" role="alert">
                {errors.address}
              </p>
            )}
          </div>
        </div>
      </Collapsible>
    </div>
  );
}

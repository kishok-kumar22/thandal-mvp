"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import type { LoanDefaultSettings } from "@/data/mockSettings";

interface LoanDefaultsCardProps {
  values: LoanDefaultSettings;
  onChange: (updates: Partial<LoanDefaultSettings>) => void;
  errors?: Record<string, string>;
}

export function LoanDefaultsCard({
  values,
  onChange,
  errors = {},
}: LoanDefaultsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
          Loan defaults
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          These settings will be used as defaults when creating new loans. You can change them for individual loans if needed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repayment Frequency */}
        <div className="space-y-2">
          <label htmlFor="setting-repayment-frequency" className="block text-sm font-semibold text-[#0B1B3F]">
            Repayment frequency
          </label>
          <div className="relative">
            <select
              id="setting-repayment-frequency"
              value={values.repaymentFrequency}
              onChange={(e) =>
                onChange({ repaymentFrequency: e.target.value as "daily" | "weekly" | "monthly" })
              }
              aria-invalid={Boolean(errors.repaymentFrequency)}
              aria-describedby={errors.repaymentFrequency ? "setting-frequency-error" : undefined}
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer capitalize"
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
          {errors.repaymentFrequency && (
            <p id="setting-frequency-error" className="text-xs text-[#E5252A] font-medium" role="alert">
              {errors.repaymentFrequency}
            </p>
          )}
        </div>

        {/* Interest Calculation Method */}
        <div className="space-y-2">
          <label htmlFor="setting-interest-method" className="block text-sm font-semibold text-[#0B1B3F]">
            Interest calculation method
          </label>
          <div className="relative">
            <select
              id="setting-interest-method"
              value={values.interestMethod}
              onChange={(e) => onChange({ interestMethod: e.target.value as "flat" })}
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
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
          <label htmlFor="setting-interest-basis" className="block text-sm font-semibold text-[#0B1B3F]">
            Interest basis
          </label>
          <div className="relative">
            <select
              id="setting-interest-basis"
              value={values.interestBasis || "entire_term"}
              onChange={(e) => onChange({ interestBasis: e.target.value as "entire_term" })}
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
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
  );
}

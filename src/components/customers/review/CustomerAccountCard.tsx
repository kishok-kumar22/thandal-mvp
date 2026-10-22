"use client";

import React from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { Checkbox } from "@/components/ui/Checkbox";

interface CustomerAccountCardProps {
  isReadyForActivation: boolean;
  portalAccess: boolean;
  onPortalAccessChange: (enabled: boolean) => void;
  consentGiven: boolean;
  onConsentChange: (consent: boolean) => void;
}

export function CustomerAccountCard({
  isReadyForActivation,
  portalAccess,
  onPortalAccessChange,
  consentGiven,
  onConsentChange,
}: CustomerAccountCardProps) {
  return (
    <Card className="p-6 flex flex-col justify-between h-full space-y-4">
      <div>
        {/* Header */}
        <div className="pb-3 border-b border-[#E6ECF5]">
          <h2 className="text-base font-bold text-[#0B1B3F]">Customer account</h2>
        </div>

        {/* Status Row */}
        <div className="py-2.5 flex items-center justify-between border-b border-[#E6ECF5]/70">
          <span className="text-xs font-medium text-[#334155]">Status</span>
          {isReadyForActivation ? (
            <Badge variant="ready" label="Ready for activation" />
          ) : (
            <Badge variant="pending" label="Documents pending" />
          )}
        </div>

        {/* Enable Customer Portal Access Toggle */}
        <div className="py-3 flex items-center justify-between border-b border-[#E6ECF5]/70">
          <span className="text-xs font-semibold text-[#0B1B3F]">
            Enable customer portal access
          </span>
          <Toggle
            checked={portalAccess}
            onChange={onPortalAccessChange}
            aria-label="Enable customer portal access"
          />
        </div>

        {/* Activation Method Field */}
        <div className="pt-3 pb-2 space-y-1.5">
          <label className="block text-xs font-semibold text-[#64748B]">
            Activation method
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              disabled
              value="Send one-time activation link to verified mobile"
              className="w-full h-10 px-3.5 pr-10 text-xs rounded-lg bg-[#F8FAFC] border border-[#D9E1EC] text-[#475569] font-medium cursor-not-allowed select-none"
            />
            <Lock className="absolute right-3.5 w-3.5 h-3.5 text-[#94A3B8]" />
          </div>
        </div>

        {/* Notes Grey Box */}
        <div className="bg-[#EEF1F5] rounded-xl p-3.5 mt-3 space-y-1 text-xs text-[#475569] leading-relaxed">
          <p className="font-medium text-[#334155]">
            The customer sets their own password after verifying their mobile.
          </p>
          <p className="text-[11px] text-[#64748B]">
            No public registration is available.
          </p>
        </div>
      </div>

      {/* Customer Record Consent Checkbox */}
      <div className="pt-3 border-t border-[#E6ECF5]">
        <Checkbox
          id="customer-consent"
          checked={consentGiven}
          onChange={onConsentChange}
          label={
            <span className="text-xs font-medium text-[#334155] leading-snug block">
              Customer has acknowledged data collection and account setup.
            </span>
          }
        />
      </div>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";

export interface GuarantorValues {
  name: string;
  mobile: string;
  relationship: string;
  address: string;
}

export interface GuarantorProps {
  values: GuarantorValues;
  onChange: (field: keyof GuarantorValues, value: string) => void;
  errors: Record<string, string | undefined>;
}

export function GuarantorSection({ values, onChange, errors }: GuarantorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const relationshipOptions = [
    { value: "Spouse", label: "Spouse" },
    { value: "Parent", label: "Parent" },
    { value: "Sibling", label: "Sibling" },
    { value: "Friend", label: "Friend" },
    { value: "Other", label: "Other" },
  ];

  const isAnyFieldFilled = Boolean(
    values.name || values.mobile || values.relationship || values.address
  );

  return (
    <Card className="rounded-xl border border-[#E6ECF5] overflow-hidden">
      {/* Collapsible Header Button */}
      <button
        type="button"
        id="guarantor-header-btn"
        aria-expanded={isOpen}
        aria-controls="guarantor-section-content"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
          )}
          <span className="text-base font-bold text-[#0B1B3F]">Guarantor</span>
          <span className="text-xs text-[#94A3B8] font-normal">(optional)</span>
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        id="guarantor-section-content"
        role="region"
        aria-labelledby="guarantor-header-btn"
        className={`transition-all duration-300 ease-in-out px-5 pb-5 pt-1 ${
          isOpen ? "block opacity-100" : "hidden opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Guarantor Name */}
          <FormField
            label="Guarantor name"
            htmlFor="field-guarantorName"
            required={isAnyFieldFilled}
            optional={!isAnyFieldFilled}
            error={errors.guarantorName}
          >
            <input
              id="field-guarantorName"
              type="text"
              placeholder="Full name of guarantor"
              value={values.name}
              onChange={(e) => onChange("name", e.target.value)}
              className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.guarantorName ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
          </FormField>

          {/* Guarantor Mobile */}
          <FormField
            label="Guarantor mobile"
            htmlFor="field-guarantorMobile"
            required={isAnyFieldFilled}
            optional={!isAnyFieldFilled}
            error={errors.guarantorMobile}
          >
            <input
              id="field-guarantorMobile"
              type="tel"
              inputMode="tel"
              placeholder="+91 9XXX XXX XXX"
              value={values.mobile ? (values.mobile.startsWith("+91") ? values.mobile : `+91 ${values.mobile}`) : ""}
              onChange={(e) => {
                let cleaned = e.target.value.replace(/\s+/g, "");
                if (cleaned.startsWith("+91")) cleaned = cleaned.slice(3);
                cleaned = cleaned.replace(/\D/g, "").slice(0, 10);
                onChange("mobile", cleaned);
              }}
              className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.guarantorMobile ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
          </FormField>

          {/* Relationship */}
          <FormField
            label="Relationship"
            htmlFor="field-guarantorRelationship"
            required={isAnyFieldFilled}
            optional={!isAnyFieldFilled}
            error={errors.guarantorRelationship}
          >
            <Select
              id="field-guarantorRelationship"
              placeholder="Select relationship"
              value={values.relationship}
              onChange={(e) => onChange("relationship", e.target.value)}
              options={relationshipOptions}
            />
          </FormField>
        </div>

        {/* Guarantor Address */}
        <FormField
          label="Guarantor address"
          htmlFor="field-guarantorAddress"
          required={isAnyFieldFilled}
          optional={!isAnyFieldFilled}
          error={errors.guarantorAddress}
        >
          <textarea
            id="field-guarantorAddress"
            rows={2}
            placeholder="Residential address of guarantor"
            value={values.address}
            onChange={(e) => onChange("address", e.target.value)}
            className={`w-full p-3 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] resize-none ${
              errors.guarantorAddress ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>
      </div>
    </Card>
  );
}

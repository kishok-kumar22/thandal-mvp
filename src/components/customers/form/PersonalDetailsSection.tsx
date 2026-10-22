"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";

export interface PersonalDetailsProps {
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  dob?: string;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string | undefined>;
}

export function PersonalDetailsSection({
  fullName,
  mobile,
  alternateMobile = "",
  dob = "",
  onChange,
  errors,
}: PersonalDetailsProps) {
  const handleMobileChange = (field: string, val: string) => {
    // Auto-strip spaces and +91
    let cleaned = val.replace(/\s+/g, "");
    if (cleaned.startsWith("+91")) {
      cleaned = cleaned.slice(3);
    }
    cleaned = cleaned.replace(/\D/g, "").slice(0, 10);
    onChange(field, cleaned);
  };

  return (
    <Card className="p-5 md:p-6 rounded-xl border border-[#E6ECF5]">
      <h2 className="text-base font-bold text-[#0B1B3F] mb-4">Personal details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Full Name */}
        <FormField
          label="Full name"
          htmlFor="field-fullName"
          required
          error={errors.fullName}
        >
          <input
            id="field-fullName"
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.fullName ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* Mobile Number */}
        <FormField
          label="Mobile number"
          htmlFor="field-mobile"
          required
          error={errors.mobile}
        >
          <input
            id="field-mobile"
            type="tel"
            inputMode="tel"
            placeholder="+91 9XXX XXX XXX"
            value={mobile ? (mobile.startsWith("+91") ? mobile : `+91 ${mobile}`) : ""}
            onChange={(e) => handleMobileChange("mobile", e.target.value)}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.mobile ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* Alternate Mobile Number */}
        <FormField
          label="Alternate number"
          htmlFor="field-alternateMobile"
          optional
          error={errors.alternateMobile}
        >
          <input
            id="field-alternateMobile"
            type="tel"
            inputMode="tel"
            placeholder="+91 9XXX XXX XXX"
            value={alternateMobile ? (alternateMobile.startsWith("+91") ? alternateMobile : `+91 ${alternateMobile}`) : ""}
            onChange={(e) => handleMobileChange("alternateMobile", e.target.value)}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.alternateMobile ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* Date of Birth */}
        <FormField
          label="Date of birth"
          htmlFor="field-dob"
          optional
          error={errors.dob}
        >
          <div className="relative flex items-center">
            <input
              id="field-dob"
              type="date"
              value={dob}
              onChange={(e) => onChange("dob", e.target.value)}
              className={`w-full h-11 px-3.5 pr-10 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                errors.dob ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            <Calendar className="absolute right-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          </div>
        </FormField>
      </div>
    </Card>
  );
}

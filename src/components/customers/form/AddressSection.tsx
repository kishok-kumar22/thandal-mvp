"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";

export interface AddressProps {
  streetAddress: string;
  area: string;
  city: string;
  postalCode: string;
  onChange: (field: string, value: string) => void;
  errors: Record<string, string | undefined>;
}

export function AddressSection({
  streetAddress,
  area,
  city,
  postalCode,
  onChange,
  errors,
}: AddressProps) {
  return (
    <Card className="p-5 md:p-6 rounded-xl border border-[#E6ECF5]">
      <h2 className="text-base font-bold text-[#0B1B3F] mb-4">Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1.2fr_1.2fr] gap-4">
        {/* Street Address */}
        <FormField
          label="Street address"
          htmlFor="field-streetAddress"
          required
          error={errors.streetAddress}
        >
          <input
            id="field-streetAddress"
            type="text"
            placeholder="e.g. 123, Lake View Road"
            value={streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.streetAddress ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* Area */}
        <FormField
          label="Area"
          htmlFor="field-area"
          required
          error={errors.area}
        >
          <input
            id="field-area"
            type="text"
            placeholder="e.g. Anna Nagar"
            value={area}
            onChange={(e) => onChange("area", e.target.value)}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.area ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* City */}
        <FormField
          label="City"
          htmlFor="field-city"
          required
          error={errors.city}
        >
          <input
            id="field-city"
            type="text"
            placeholder="e.g. Chennai"
            value={city}
            onChange={(e) => onChange("city", e.target.value)}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.city ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* Postal Code */}
        <FormField
          label="Postal code"
          htmlFor="field-postalCode"
          required
          error={errors.postalCode}
        >
          <input
            id="field-postalCode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 600040"
            value={postalCode}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange("postalCode", cleaned);
            }}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.postalCode ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>
      </div>
    </Card>
  );
}

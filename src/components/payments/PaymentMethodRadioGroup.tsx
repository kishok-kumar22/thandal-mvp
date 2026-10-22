"use client";

import React from "react";
import { PAYMENT_METHODS, type PaymentMethod } from "@/config/payments";

interface PaymentMethodRadioGroupProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodRadioGroup({
  value,
  onChange,
}: PaymentMethodRadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Payment method"
      className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-3"
    >
      {PAYMENT_METHODS.map((method) => {
        const Icon = method.icon;
        const isSelected = value === method.id;

        return (
          <label
            key={method.id}
            className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
              isSelected
                ? "border-2 border-[#1F6BFF] bg-[#F3F7FF] shadow-xs"
                : "border border-[#E6ECF5] bg-white hover:border-[#CBD5E1]"
            }`}
          >
            {/* Visually hidden native radio for accessibility & arrow keys */}
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={isSelected}
              onChange={() => onChange(method.id)}
              className="sr-only focus-visible:outline-none"
            />

            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isSelected ? "text-[#1F6BFF]" : "text-[#64748B]"
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-sm font-semibold truncate ${
                  isSelected ? "text-[#0B1B3F]" : "text-[#334155]"
                }`}
              >
                {method.label}
              </span>
            </div>

            {/* Custom Styled Radio Indicator */}
            <div
              className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                isSelected
                  ? "border-[#1F6BFF] bg-white"
                  : "border-[#CBD5E1] bg-white"
              }`}
              aria-hidden="true"
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#1F6BFF]" />
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

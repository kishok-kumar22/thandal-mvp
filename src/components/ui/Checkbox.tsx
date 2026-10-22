"use client";

import React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps {
  id: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
  className?: string;
  "aria-describedby"?: string;
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
  "aria-describedby": ariaDescribedBy,
}: CheckboxProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <button
        type="button"
        role="checkbox"
        id={id}
        aria-checked={checked}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-4.5 h-4.5 rounded-[5px] flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] focus-visible:ring-offset-1 shrink-0 ${
          checked
            ? "bg-[#1F6BFF] border border-[#1F6BFF] text-white"
            : "bg-white border border-[#CBD5E1] hover:border-[#94A3B8]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>
      <label
        htmlFor={id}
        className={`text-sm text-[#334155] cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
}

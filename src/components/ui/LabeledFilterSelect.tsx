import React from "react";
import { ChevronDown } from "lucide-react";
import type { FilterOption } from "./FilterSelect";

interface LabeledFilterSelectProps {
  label: string;
  value: string;
  options: (string | FilterOption)[];
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

/**
 * Standard select with a normal label ABOVE the input box.
 * Used on the Loans list and other forms.
 */
export function LabeledFilterSelect({
  label,
  value,
  options,
  onChange,
  className = "",
  id,
}: LabeledFilterSelectProps) {
  const selectId = id || `labeled-select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const normalizedOptions: FilterOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={selectId}
        className="text-xs font-semibold text-[#0B1B3F] mb-1.5"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-medium text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
        >
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[#334155]">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

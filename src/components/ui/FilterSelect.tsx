import React from "react";
import { ChevronDown } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: (string | FilterOption)[];
  onChange: (value: string) => void;
  className?: string;
  id?: string;
}

/**
 * Floating-style filter select with a small muted label above the value
 * and a chevron-down inside one bordered box. Accessible native select.
 */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className = "",
  id,
}: FilterSelectProps) {
  const selectId = id || `filter-select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const normalizedOptions: FilterOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div
      className={`relative flex flex-col justify-center border border-[#E2E8F0] hover:border-[#CBD5E1] focus-within:border-[#1F6BFF] focus-within:ring-2 focus-within:ring-[#1F6BFF]/20 rounded-xl bg-white px-3.5 py-1.5 transition-all cursor-pointer ${className}`}
    >
      <label
        htmlFor={selectId}
        className="text-[11px] font-medium text-[#64748B] tracking-tight leading-none mb-0.5 cursor-pointer"
      >
        {label}
      </label>

      <div className="flex items-center justify-between gap-2">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-[#0B1B3F] focus:outline-none cursor-pointer appearance-none pr-6 z-10"
        >
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-[#334155] font-normal">
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

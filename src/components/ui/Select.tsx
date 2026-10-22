import React from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, error, helperText, placeholder, className = "", ...props }, ref) => {
    const selectId = id || props.name || "select-field";
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#0B1B3F]">
            {label}
            {props.required && <span className="text-[#E5252A] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`w-full h-11 pl-3.5 pr-10 text-sm rounded-lg bg-white border appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] disabled:bg-slate-50 disabled:text-slate-500 cursor-pointer ${
              error ? "border-[#E5252A] focus:border-[#E5252A]" : "border-[#D9E1EC]"
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>

        {error && (
          <p id={errorId} className="text-xs text-[#E5252A] mt-1 font-medium">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="text-xs text-[#64748B] mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

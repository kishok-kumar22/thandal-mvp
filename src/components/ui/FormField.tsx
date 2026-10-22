import React from "react";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  requiredMarker?: "asterisk" | "none";
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  optional,
  requiredMarker = "asterisk",
  hint,
  error,
  children,
  className = "",
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;

  const showAsterisk = required && requiredMarker === "asterisk";

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#0B1B3F]">
            {label}
            {showAsterisk && (
              <span className="text-[#E5252A] ml-1" aria-hidden="true">
                *
              </span>
            )}
            {optional && (
              <span className="text-[#94A3B8] font-normal ml-1.5">(optional)</span>
            )}
          </label>
        </div>
      )}

      {children}

      {error && (
        <p id={errorId} className="text-xs text-[#E5252A] font-medium" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={hintId} className="text-xs text-[#64748B]">
          {hint}
        </p>
      )}
    </div>
  );
}

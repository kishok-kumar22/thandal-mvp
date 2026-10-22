import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, error, helperText, showCount = false, maxLength, value, className = "", ...props }, ref) => {
    const textareaId = id || props.name || "textarea-field";
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#0B1B3F]">
            {label}
            {props.required && <span className="text-[#E5252A] ml-1">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={`w-full p-3 text-sm rounded-lg bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] disabled:bg-slate-50 disabled:text-slate-500 resize-none ${
            error ? "border-[#E5252A] focus:border-[#E5252A]" : "border-[#D9E1EC]"
          } ${className}`}
          {...props}
        />

        <div className="flex items-center justify-between text-xs">
          <div>
            {error && (
              <p id={errorId} className="text-[#E5252A] font-medium">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-[#64748B]">
                {helperText}
              </p>
            )}
          </div>

          {showCount && maxLength && (
            <span className="text-[#94A3B8] font-mono ml-auto">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

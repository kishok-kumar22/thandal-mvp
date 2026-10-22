"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  inputClassName?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Password",
      id = "password",
      error,
      className = "",
      inputClassName = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const errorId = `${id}-error`;

    return (
      <div className={`w-full space-y-1.5 ${className}`}>
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-[#0B1B3F]">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none text-[#94A3B8]">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>

          <input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`w-full h-14 pl-12 pr-12 text-base rounded-xl bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              error ? "border-[#E5252A] focus:border-[#E5252A]" : "border-[#D9E1EC]"
            } ${inputClassName}`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute right-3.5 flex items-center text-[#94A3B8] hover:text-[#0B1B3F] p-2 transition-colors cursor-pointer rounded-lg"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Eye className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {error && (
          <p id={errorId} className="text-xs text-[#E5252A] mt-1 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

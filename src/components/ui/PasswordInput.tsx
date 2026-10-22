"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
}

export function PasswordInput({
  id,
  label,
  error,
  className = "",
  autoComplete,
  value,
  onChange,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-[#0B1B3F]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-12 pl-4 pr-11 text-base rounded-xl bg-white border transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
            error ? "border-[#E5252A]" : "border-[#D9E1EC]"
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#0B1B3F] transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5 shrink-0" aria-hidden="true" />
          ) : (
            <Eye className="w-5 h-5 shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-[#E5252A] font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

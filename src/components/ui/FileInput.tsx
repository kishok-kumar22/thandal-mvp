"use client";

import React, { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

export interface SelectedFileMeta {
  name: string;
  size: number;
  type: string;
}

interface FileInputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: SelectedFileMeta | null;
  onChange?: (file: SelectedFileMeta | null) => void;
  accept?: string;
  maxSizeMb?: number;
  error?: string;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const DEFAULT_MAX_MB = 5;

export function FileInput({
  id = "file-attachment",
  name = "attachment",
  value = null,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png",
  maxSizeMb = DEFAULT_MAX_MB,
  error: externalError,
  className = "",
  disabled = false,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = externalError || internalError;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalError(null);
    const file = e.target.files?.[0];

    if (!file) {
      if (onChange) onChange(null);
      return;
    }

    // Validate size
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the ${maxSizeMb} MB limit.`;
      setInternalError(err);
      if (inputRef.current) inputRef.current.value = "";
      if (onChange) onChange(null);
      return;
    }

    // Validate type
    const isAllowedType =
      DEFAULT_ALLOWED_TYPES.includes(file.type) ||
      /\.(pdf|jpg|jpeg|png)$/i.test(file.name);

    if (!isAllowedType) {
      const err = "Invalid file type. Only PDF, JPG, and PNG files are accepted.";
      setInternalError(err);
      if (inputRef.current) inputRef.current.value = "";
      if (onChange) onChange(null);
      return;
    }

    if (onChange) {
      onChange({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setInternalError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={id}
        className={`group relative flex items-center justify-between h-12 w-full rounded-lg border bg-white transition-colors cursor-pointer select-none overflow-hidden ${
          displayError
            ? "border-red-400 focus-within:ring-2 focus-within:ring-red-300"
            : "border-[#D9E1EC] hover:border-[#1F6BFF] focus-within:ring-2 focus-within:ring-[#1F6BFF]/20 focus-within:border-[#1F6BFF]"
        } ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}`}
      >
        {/* Visually hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          id={id}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={displayError ? `${id}-error` : undefined}
          aria-invalid={Boolean(displayError)}
        />

        {/* Left Side: Paperclip icon and text / filename */}
        <div className="flex items-center gap-2.5 px-3 min-w-0 flex-1">
          <Paperclip className="w-4 h-4 text-[#64748B] shrink-0" aria-hidden="true" />
          <span
            className={`text-sm truncate ${
              value ? "text-[#0B1B3F] font-medium" : "text-[#94A3B8]"
            }`}
          >
            {value ? value.name : "Choose a file"}
          </span>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded hover:bg-slate-100 text-[#64748B] hover:text-[#0B1B3F] transition-colors ml-auto shrink-0"
              title="Remove file"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Side: Browse segment */}
        <div className="h-full px-5 flex items-center justify-center bg-[#E9EEF6] border-l border-[#D9E1EC] text-sm font-semibold text-[#1F6BFF] group-hover:bg-[#DFE7F3] transition-colors shrink-0">
          Browse
        </div>
      </label>

      {/* Inline validation error */}
      {displayError && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600 font-medium" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}

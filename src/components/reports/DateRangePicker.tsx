"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { formatDateRange, formatDateKolkata } from "@/lib/dates";

interface DateRangePickerProps {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  onChange: (from: string, to: string) => void;
  id?: string;
}

export function DateRangePicker({
  from,
  to,
  onChange,
  id = "report-date-range",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedFrom, setStagedFrom] = useState(from);
  const [stagedTo, setStagedTo] = useState(to);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if props change
  useEffect(() => {
    setStagedFrom(from);
    setStagedTo(to);
  }, [from, to]);

  // Click outside and Esc listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const applyPreset = (presetFrom: string, presetTo: string) => {
    setStagedFrom(presetFrom);
    setStagedTo(presetTo);
    setError(null);
    onChange(presetFrom, presetTo);
    setIsOpen(false);
  };

  const validateAndApplyCustom = () => {
    if (!stagedFrom || !stagedTo) {
      setError("Both From and To dates are required.");
      return;
    }
    if (stagedFrom > stagedTo) {
      setError("Start date cannot be after end date.");
      return;
    }
    if (stagedTo > "2026-10-22") {
      setError("End date cannot exceed today (22 Oct 2026).");
      return;
    }

    // Max span check: 366 days
    const diffDays =
      (new Date(stagedTo).getTime() - new Date(stagedFrom).getTime()) /
      (1000 * 60 * 60 * 24);
    if (diffDays > 366) {
      setError("Date span cannot exceed 366 days.");
      return;
    }

    setError(null);
    onChange(stagedFrom, stagedTo);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button Styled as an Input */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="w-full h-11 px-3.5 bg-white border border-[#D9E1EC] hover:border-[#CBD5E1] rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer text-left"
      >
        <CalendarIcon className="w-4 h-4 text-[#1F6BFF] shrink-0" aria-hidden="true" />
        <span className="truncate">{formatDateRange(from, to) || "Select dates"}</span>
      </button>

      {/* Popover / Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose date range"
          className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E6ECF5] p-4 text-xs space-y-4 animate-in fade-in zoom-in-95"
        >
          {/* Quick Presets */}
          <div>
            <span className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset("2026-10-22", "2026-10-22")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:bg-[#EAF1FE] hover:text-[#1F6BFF] text-left transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyPreset("2026-10-21", "2026-10-21")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:bg-[#EAF1FE] hover:text-[#1F6BFF] text-left transition-colors cursor-pointer"
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => applyPreset("2026-10-16", "2026-10-22")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:bg-[#EAF1FE] hover:text-[#1F6BFF] text-left transition-colors cursor-pointer"
              >
                Last 7 days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("2026-09-23", "2026-10-22")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:bg-[#EAF1FE] hover:text-[#1F6BFF] text-left transition-colors cursor-pointer"
              >
                Last 30 days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("2026-10-01", "2026-10-22")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:bg-[#EAF1FE] hover:text-[#1F6BFF] text-left transition-colors cursor-pointer"
              >
                This month
              </button>
              <button
                type="button"
                onClick={() => applyPreset("2026-10-21", "2026-10-22")}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-[#EAF1FE] text-[#1F6BFF] text-left transition-colors cursor-pointer"
              >
                Default (21-22 Oct)
              </button>
            </div>
          </div>

          <div className="border-t border-[#F1F5F9] pt-3 space-y-3">
            <span className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Custom Range
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="custom-from" className="block text-[11px] font-medium text-[#64748B] mb-1">
                  From
                </label>
                <input
                  id="custom-from"
                  type="date"
                  value={stagedFrom}
                  max={stagedTo || "2026-10-22"}
                  onChange={(e) => {
                    setStagedFrom(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-9 px-2.5 bg-slate-50 border border-[#D9E1EC] rounded-lg text-xs font-semibold text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF]"
                />
              </div>

              <div>
                <label htmlFor="custom-to" className="block text-[11px] font-medium text-[#64748B] mb-1">
                  To
                </label>
                <input
                  id="custom-to"
                  type="date"
                  value={stagedTo}
                  min={stagedFrom}
                  max="2026-10-22"
                  onChange={(e) => {
                    setStagedTo(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-9 px-2.5 bg-slate-50 border border-[#D9E1EC] rounded-lg text-xs font-semibold text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF]"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-[#E5252A] font-medium">{error}</p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0B1B3F] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={validateAndApplyCustom}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1F6BFF] hover:bg-[#1A5CD6] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

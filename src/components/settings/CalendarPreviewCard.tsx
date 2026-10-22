"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, ArrowRight, Info } from "lucide-react";
import {
  buildDueDates,
  addDays,
  resolveMonthDay,
  parseDateParts,
  type CalendarSettings,
  type Frequency,
} from "@/lib/calendar";
import { todayIso } from "@/lib/clock";

interface CalendarPreviewCardProps {
  calendar: CalendarSettings;
}

export function CalendarPreviewCard({ calendar }: CalendarPreviewCardProps) {
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("weekly");
  const [firstDueDate, setFirstDueDate] = useState("2026-10-26");

  // Calculate nominal vs adjusted dates for the first 6 instalments
  const term = 6;
  const adjustedDates = buildDueDates({
    firstDue: firstDueDate,
    frequency,
    term,
    calendar,
  });

  const previewItems: { instalment: number; nominal: string; adjusted: string; moved: boolean }[] = [];
  const { year, month, day } = parseDateParts(firstDueDate);

  for (let i = 0; i < term; i++) {
    let nominal: string;
    if (frequency === "weekly") {
      nominal = addDays(firstDueDate, i * 7);
    } else {
      const targetMonthIndex = month + i;
      const y = year + Math.floor((targetMonthIndex - 1) / 12);
      const m = ((targetMonthIndex - 1) % 12) + 1;
      nominal = resolveMonthDay(y, m, day, calendar.monthEndRule);
    }

    const adjusted = adjustedDates[i] || nominal;
    previewItems.push({
      instalment: i + 1,
      nominal,
      adjusted,
      moved: adjusted !== nominal,
    });
  }

  const movedCount = previewItems.filter((p) => p.moved).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3F]">
            Repayment schedule preview
          </h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Live preview of the first 6 due dates based on your active collection days and holiday rules.
          </p>
        </div>

        {/* Live controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as "weekly" | "monthly")}
            aria-label="Preview frequency"
            className="h-10 px-3 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] font-semibold cursor-pointer"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <input
            type="date"
            value={firstDueDate}
            onChange={(e) => setFirstDueDate(e.target.value)}
            aria-label="Preview first due date"
            className="h-10 px-3 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] font-semibold cursor-pointer"
          />
        </div>
      </div>

      {/* Moved count notice */}
      {movedCount > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
          <span>
            {movedCount} due date{movedCount > 1 ? "s" : ""} moved because of holidays or non-collection days.
          </span>
        </div>
      )}

      {/* Schedule grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {previewItems.map((item) => (
          <div
            key={item.instalment}
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
              item.moved
                ? "bg-amber-50/70 border-amber-200"
                : "bg-slate-50 border-[#E2E8F0]"
            }`}
          >
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Instalment #{item.instalment}
            </div>

            <div className="my-2">
              <span className="text-base font-bold text-[#0B1B3F] block">
                {item.adjusted}
              </span>
              {item.moved && (
                <span className="text-[11px] font-medium text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded mt-1 inline-block">
                  moved from {item.nominal}
                </span>
              )}
            </div>

            <div className="text-[11px] text-[#94A3B8] font-medium">
              {item.moved ? "Shifted by rule" : "Nominal date"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

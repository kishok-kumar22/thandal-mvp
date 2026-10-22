"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import {
  type CalendarSettingsModel,
} from "@/data/mockSettings";
import { WEEKDAY_NAMES, type Weekday, type MonthEndRule, type HolidayRule } from "@/lib/calendar";

interface CollectionCalendarCardProps {
  values: CalendarSettingsModel;
  onChange: (updates: Partial<CalendarSettingsModel>) => void;
  errors?: Record<string, string>;
}

export function CollectionCalendarCard({
  values,
  onChange,
  errors = {},
}: CollectionCalendarCardProps) {
  const isShorterMonthNotice = values.monthlyDueDay >= 29;

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight">
          Default collection calendar
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Used to set default due dates for repayment schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Due Day */}
        <div className="space-y-2">
          <label
            htmlFor="calendar-weekly-day"
            className="block text-sm font-semibold text-[#0B1B3F]"
          >
            Weekly due day
          </label>
          <div className="relative">
            <select
              id="calendar-weekly-day"
              value={values.weeklyDueDay}
              onChange={(e) =>
                onChange({ weeklyDueDay: parseInt(e.target.value, 10) as Weekday })
              }
              aria-invalid={Boolean(errors.weeklyDueDay)}
              aria-describedby={errors.weeklyDueDay ? "weekly-day-error" : undefined}
              className={`w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer ${
                errors.weeklyDueDay ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            >
              {WEEKDAY_NAMES.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.weeklyDueDay && (
            <p id="weekly-day-error" className="text-xs text-[#E5252A] font-medium" role="alert">
              {errors.weeklyDueDay}
            </p>
          )}
        </div>

        {/* Monthly Due Day */}
        <div className="space-y-2">
          <label
            htmlFor="calendar-monthly-day"
            className="block text-sm font-semibold text-[#0B1B3F]"
          >
            Monthly due day
          </label>
          <div className="relative">
            <select
              id="calendar-monthly-day"
              value={values.monthlyDueDay}
              onChange={(e) =>
                onChange({ monthlyDueDay: parseInt(e.target.value, 10) })
              }
              aria-invalid={Boolean(errors.monthlyDueDay)}
              aria-describedby={
                errors.monthlyDueDay
                  ? "monthly-day-error"
                  : isShorterMonthNotice
                  ? "monthly-day-hint"
                  : undefined
              }
              className={`w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer ${
                errors.monthlyDueDay ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.monthlyDueDay ? (
            <p id="monthly-day-error" className="text-xs text-[#E5252A] font-medium" role="alert">
              {errors.monthlyDueDay}
            </p>
          ) : isShorterMonthNotice ? (
            <p id="monthly-day-hint" className="text-xs text-[#64748B]">
              In shorter months the month-end rule applies.
            </p>
          ) : null}
        </div>

        {/* Month-End Rule */}
        <div className="space-y-2">
          <label
            htmlFor="calendar-month-end-rule"
            className="block text-sm font-semibold text-[#0B1B3F]"
          >
            Month-end rule
          </label>
          <div className="relative">
            <select
              id="calendar-month-end-rule"
              value={values.monthEndRule}
              onChange={(e) =>
                onChange({ monthEndRule: e.target.value as MonthEndRule })
              }
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
            >
              <option value="last_valid_day">Last valid day</option>
              <option value="first_of_next_month">First day of next month</option>
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Holiday Rule */}
        <div className="space-y-2">
          <label
            htmlFor="calendar-holiday-rule"
            className="block text-sm font-semibold text-[#0B1B3F]"
          >
            Holiday rule
          </label>
          <div className="relative">
            <select
              id="calendar-holiday-rule"
              value={values.holidayRule}
              onChange={(e) =>
                onChange({ holidayRule: e.target.value as HolidayRule })
              }
              className="w-full h-14 pl-4 pr-10 text-base rounded-lg bg-white border border-[#D9E1EC] appearance-none transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
            >
              <option value="next_collection_day">Move to next collection day</option>
              <option value="previous_collection_day">Move to previous collection day</option>
              <option value="no_adjustment">Keep on holiday (no adjustment)</option>
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

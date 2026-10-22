"use client";

import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { WEEKDAY_NAMES, type Weekday } from "@/lib/calendar";

interface CollectionDaysCardProps {
  collectionDays: Weekday[];
  onChange: (days: Weekday[]) => void;
  error?: string;
}

// Order from Monday (1) to Sunday (0)
const ORDERED_WEEKDAYS: { day: Weekday; label: string }[] = [
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" },
  { day: 0, label: "Sunday" },
];

export function CollectionDaysCard({
  collectionDays,
  onChange,
  error,
}: CollectionDaysCardProps) {
  const handleToggle = (day: Weekday, checked: boolean) => {
    if (checked) {
      if (!collectionDays.includes(day)) {
        onChange([...collectionDays, day]);
      }
    } else {
      // Must keep at least one collection day
      if (collectionDays.length > 1) {
        onChange(collectionDays.filter((d) => d !== day));
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3F]">
          Collection days
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Days of the week when field agents actively collect repayments. Non-collection days automatically adjust due dates according to the holiday rule.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
        {ORDERED_WEEKDAYS.map(({ day, label }) => {
          const isChecked = collectionDays.includes(day);
          const isOnlyOne = isChecked && collectionDays.length === 1;

          return (
            <div
              key={day}
              className={`p-3.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                isChecked
                  ? "bg-[#EFF6FF] border-[#BFDBFE] text-[#0B1B3F]"
                  : "bg-slate-50 border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              <Checkbox
                id={`collection-day-${day}`}
                checked={isChecked}
                disabled={isOnlyOne}
                onChange={(checked) => handleToggle(day, checked)}
                label={
                  <span className="text-sm font-semibold select-none cursor-pointer">
                    {label}
                  </span>
                }
              />
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-[#E5252A] font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Trash2, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { HolidayItem } from "@/lib/calendar";
import { todayIso } from "@/lib/clock";

interface HolidaysCardProps {
  holidays: HolidayItem[];
  onChange: (holidays: HolidayItem[]) => void;
  error?: string;
}

export function HolidaysCard({ holidays, onChange, error }: HolidaysCardProps) {
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = newName.trim();
    if (!newDate) {
      setFormError("Please select a date for the holiday.");
      return;
    }

    if (newDate < todayIso()) {
      setFormError("Holiday date cannot be in the past.");
      return;
    }

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 60) {
      setFormError("Holiday name must be between 2 and 60 characters.");
      return;
    }

    if (holidays.some((h) => h.date === newDate)) {
      setFormError(`A holiday is already scheduled on ${newDate}.`);
      return;
    }

    if (holidays.length >= 100) {
      setFormError("Maximum of 100 holidays can be configured.");
      return;
    }

    const newItem: HolidayItem = {
      id: `HOL-${Date.now()}`,
      date: newDate,
      name: trimmedName,
    };

    onChange([...holidays, newItem]);
    setNewDate("");
    setNewName("");
  };

  const handleRemove = (id: string) => {
    onChange(holidays.filter((h) => h.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3F]">
          Holidays
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Calendar holidays when collections will not take place. Repayments falling on these dates will shift based on your holiday rule.
        </p>
      </div>

      {/* Inline Add Holiday Form */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4 space-y-1">
            <label
              htmlFor="holiday-date-input"
              className="block text-xs font-semibold text-[#0B1B3F]"
            >
              Holiday date
            </label>
            <input
              id="holiday-date-input"
              type="date"
              min={todayIso()}
              value={newDate}
              onChange={(e) => {
                setNewDate(e.target.value);
                if (formError) setFormError(null);
              }}
              className="w-full h-11 px-3 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF]"
            />
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label
              htmlFor="holiday-name-input"
              className="block text-xs font-semibold text-[#0B1B3F]"
            >
              Holiday name (e.g. Diwali, Pongal)
            </label>
            <input
              id="holiday-name-input"
              type="text"
              placeholder="Enter holiday description"
              value={newName}
              maxLength={60}
              onChange={(e) => {
                setNewName(e.target.value);
                if (formError) setFormError(null);
              }}
              className="w-full h-11 px-3 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF]"
            />
          </div>

          <div className="sm:col-span-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <Plus className="w-4 h-4 text-[#1F6BFF]" />
              <span>Add holiday</span>
            </Button>
          </div>
        </div>

        {formError && (
          <p className="text-xs text-[#E5252A] font-medium mt-2" role="alert">
            {formError}
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#E5252A] font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Holidays List / Table */}
      {sortedHolidays.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-[#CBD5E1] rounded-xl text-center">
          <CalendarOff className="w-8 h-8 text-[#94A3B8] mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#0B1B3F]">No holidays added</p>
          <p className="text-xs text-[#64748B] mt-0.5">
            Use the form above to register bank holidays and festive dates.
          </p>
        </div>
      ) : (
        <div className="border border-[#E6ECF5] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm" aria-label="Configured holidays">
            <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
              <tr>
                <th scope="col" className="py-3 px-4">
                  Date
                </th>
                <th scope="col" className="py-3 px-4">
                  Holiday name
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {sortedHolidays.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-[#0B1B3F] whitespace-nowrap">
                    {h.date}
                  </td>
                  <td className="py-3 px-4 text-[#334155]">{h.name}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(h.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#E5252A] hover:bg-red-50 transition-colors cursor-pointer"
                      title={`Remove ${h.name}`}
                      aria-label={`Remove holiday ${h.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

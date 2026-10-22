"use client";

import React, { useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useLoanDraft, defaultLoanDraft } from "./LoanDraftContext";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { calculateLoan, buildSchedule } from "@/lib/loan";
import { formatINR, formatNumberIN } from "@/lib/format";
import { buildDueDates, addDays, resolveMonthDay, parseDateParts } from "@/lib/calendar";
import { getSettings } from "@/lib/settings";

export function SchedulePage() {
  const router = useRouter();
  const { draft, updateDraft } = useLoanDraft();

  // If draft is incomplete, fall back to seeded demo draft
  const activeDraft = draft.customerId && draft.principal ? draft : defaultLoanDraft;

  const calc = useMemo(
    () =>
      calculateLoan({
        principal: activeDraft.principal,
        ratePercent: activeDraft.ratePercent,
        term: activeDraft.term,
        frequency: activeDraft.frequency,
        collectFirstAtDisbursement: activeDraft.collectFirstAtDisbursement,
      }),
    [activeDraft]
  );

  const scheduleDates = useMemo(() => {
    return buildDueDates({
      firstDue: activeDraft.firstDueDate,
      frequency: activeDraft.frequency,
      term: activeDraft.term,
      calendar: getSettings().calendar,
    });
  }, [activeDraft]);

  // Persist scheduleDates into draft
  useEffect(() => {
    updateDraft({ scheduleDates });
  }, [scheduleDates]);

  const movedDatesCount = useMemo(() => {
    let count = 0;
    const { year, month, day } = parseDateParts(activeDraft.firstDueDate);
    for (let i = 0; i < activeDraft.term; i++) {
      let nominal: string;
      if (activeDraft.frequency === "daily") {
        nominal = addDays(activeDraft.firstDueDate, i);
      } else if (activeDraft.frequency === "weekly") {
        nominal = addDays(activeDraft.firstDueDate, i * 7);
      } else {
        const targetMonthIndex = month + i;
        const y = year + Math.floor((targetMonthIndex - 1) / 12);
        const m = ((targetMonthIndex - 1) % 12) + 1;
        nominal = resolveMonthDay(y, m, day, getSettings().calendar.monthEndRule);
      }
      if (scheduleDates[i] && scheduleDates[i] !== nominal) {
        count++;
      }
    }
    return count;
  }, [activeDraft, scheduleDates]);

  const schedule = useMemo(
    () =>
      buildSchedule({
        principal: activeDraft.principal,
        ratePercent: activeDraft.ratePercent,
        term: activeDraft.term,
        frequency: activeDraft.frequency,
        firstDueDate: activeDraft.firstDueDate,
        collectFirstAtDisbursement: activeDraft.collectFirstAtDisbursement,
        scheduleDates,
      }),
    [activeDraft, scheduleDates]
  );

  // Assert sum equals totalRepayment
  const totalInstalmentSum = schedule.reduce((sum, item) => sum + item.amount, 0);
  if (process.env.NODE_ENV !== "production") {
    if (totalInstalmentSum !== calc.totalRepayment) {
      console.error(
        `Assertion failed: Schedule total ${totalInstalmentSum} !== totalRepayment ${calc.totalRepayment}`
      );
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* 4 StatCards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Principal" value={formatINR(calc.principal)} />
        <StatCard
          label="Interest"
          value={formatINR(calc.totalInterest)}
          subtext={`(${activeDraft.ratePercent}% Flat)`}
        />
        <StatCard label="Total Repayment" value={formatINR(calc.totalRepayment)} />
        <StatCard
          label="Instalment"
          value={formatINR(calc.instalment)}
          subtext={`× ${calc.term} ${activeDraft.frequency}`}
        />
      </div>

      {/* Repayment Schedule Card */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E6ECF5] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0B1B3F]">Repayment schedule</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Breakdown of {activeDraft.term} scheduled instalments for {activeDraft.frequency}{" "}
              collections.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1F6BFF] bg-[#EFF6FF] px-2.5 py-1 rounded-full">
            {activeDraft.frequency.toUpperCase()}
          </span>
        </div>

        {movedDatesCount > 0 && (
          <div className="px-5 py-3 bg-[#FFF9E6] border-b border-[#FEEA9A] text-xs font-medium text-[#8A5B00] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>
              {movedDatesCount} due {movedDatesCount === 1 ? "date" : "dates"} moved because of holidays or non-collection days.
            </span>
          </div>
        )}

        {/* Scrollable table with sticky header */}
        <div className="max-h-[480px] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead className="sticky top-0 bg-[#F8FAFC] z-10 border-b border-[#E6ECF5] shadow-2xs">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-16"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
                >
                  Due date
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right"
                >
                  Instalment amount
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider"
                >
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {schedule.map((item) => (
                <tr key={item.instalmentNumber} className="hover:bg-[#F8FAFC]/60 transition-colors">
                  <td className="py-3 px-4 text-xs font-semibold text-[#64748B]">
                    {item.instalmentNumber}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-[#0B1B3F] whitespace-nowrap">
                    {item.dueDate}
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-[#0B1B3F] text-right tabular-nums whitespace-nowrap">
                    ₹{formatNumberIN(item.amount)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {item.status === "Paid at disbursement" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" aria-hidden="true" />
                        Paid at disbursement
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1F6BFF]" aria-hidden="true" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#64748B] whitespace-nowrap">
                    {item.remarks || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total of all instalments under table */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E6ECF5] flex items-center justify-between text-sm">
          <span className="font-semibold text-[#64748B]">Total of all instalments</span>
          <span className="text-base font-extrabold text-[#0B1B3F] tabular-nums">
            {formatINR(totalInstalmentSum)}
          </span>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div
        className="fixed bottom-0 sm:bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6ECF5] py-3.5 px-4 sm:px-8 shadow-lg"
        style={{
          bottom: "var(--bottom-nav-h, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/admin/loans/new" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full sm:w-auto px-6 flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => router.push("/admin/loans/new/disburse")}
            className="w-full sm:w-auto px-6 flex items-center justify-center gap-2"
          >
            Continue to disbursement
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

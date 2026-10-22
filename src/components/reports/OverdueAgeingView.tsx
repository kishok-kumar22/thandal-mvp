"use client";

import React from "react";
import { formatNumberIN } from "@/lib/format";
import { ReportActions } from "./ReportActions";
import type { AgeingBucketRow } from "@/lib/reports";

interface OverdueAgeingViewProps {
  buckets: AgeingBucketRow[];
  totals: AgeingBucketRow;
  from: string;
  to: string;
  branch?: string;
  agent?: string;
}

export function OverdueAgeingView({
  buckets,
  totals,
  from,
  to,
  branch = "All",
  agent = "All",
}: OverdueAgeingViewProps) {
  const csvHeader = ["Ageing Bucket", "Loans Count", "Customers Count", "Arrears (INR)", "Penalty (INR)", "Total (INR)"];
  const csvRows = buckets.map((b) => [
    b.bucket,
    b.loansCount,
    b.customersCount,
    b.arrears,
    b.penalty,
    b.total,
  ]);
  csvRows.push(["Total", totals.loansCount, totals.customersCount, totals.arrears, totals.penalty, totals.total]);

  return (
    <div className="space-y-6" data-print-area="true">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Overdue ageing
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Default risk distribution grouped by days past due date as of {to}.
          </p>
        </div>

        <ReportActions
          reportName="Overdue ageing"
          from={from}
          to={to}
          branch={branch}
          agent={agent}
          csvHeader={csvHeader}
          csvRows={csvRows}
          filenamePrefix="overdue-ageing"
        />
      </div>

      {/* Ageing Table Card */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#D9E1EC]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F]">Bucket</th>
                <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-right">Loans</th>
                <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-right">Customers</th>
                <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-right">Arrears (₹)</th>
                <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-right">Penalty (₹)</th>
                <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {buckets.map((b) => (
                <tr key={b.bucket} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#0B1B3F]">{b.bucket}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{b.loansCount}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{b.customersCount}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{formatNumberIN(b.arrears)}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{formatNumberIN(b.penalty)}</td>
                  <td className="py-3 px-4 text-right tabular-nums font-bold text-[#0B1B3F]">
                    {formatNumberIN(b.total)}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-[#F8FAFC] font-bold border-t-2 border-[#D9E1EC]">
                <td className="py-3 px-4 text-[#0B1B3F] font-bold">Total</td>
                <td className="py-3 px-4 text-right tabular-nums font-bold">{totals.loansCount}</td>
                <td className="py-3 px-4 text-right tabular-nums font-bold">{totals.customersCount}</td>
                <td className="py-3 px-4 text-right tabular-nums font-bold">{formatNumberIN(totals.arrears)}</td>
                <td className="py-3 px-4 text-right tabular-nums font-bold">{formatNumberIN(totals.penalty)}</td>
                <td className="py-3 px-4 text-right tabular-nums font-extrabold text-[#1F6BFF]">
                  {formatNumberIN(totals.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

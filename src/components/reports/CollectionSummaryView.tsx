"use client";

import React from "react";
import { formatINR, formatNumberIN, formatPercent } from "@/lib/format";
import { formatDateRange, formatDateTime24 } from "@/lib/dates";
import { HighlightPanel } from "@/components/ui/HighlightPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { BarChart } from "./BarChart";
import { ReportActions } from "./ReportActions";
import type { CollectionsReportData } from "@/lib/reports";

interface CollectionSummaryViewProps {
  data: CollectionsReportData;
  branch?: string;
  agent?: string;
}

export function CollectionSummaryView({
  data,
  branch = "All",
  agent = "All",
}: CollectionSummaryViewProps) {
  const { total, byMethod, excludedWithheld, from, to } = data;

  const chartData = byMethod.map((m) => ({
    label: m.label,
    value: m.amount,
  }));

  const csvHeader = ["Payment Mode", "Amount (INR)", "Percentage"];
  const csvRows = byMethod.map((m) => [m.label, m.amount, `${m.percentage.toFixed(2)}%`]);
  csvRows.push(["Total", total, "100.00%"]);

  return (
    <div className="space-y-6" data-print-area="true">
      {/* Print-Only Header */}
      <div className="hidden print:block border-b border-black pb-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-wider">THANDAL</span>
          <span className="text-xs text-slate-500">
            Generated: {formatDateTime24("2026-10-22T10:30:00+05:30")}
          </span>
        </div>
        <h1 className="text-2xl font-bold mt-2">Collection Summary Report</h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Period: {formatDateRange(from, to)} | Branch: {branch} | Agent: {agent}
        </p>
      </div>

      {/* Screen Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
          Collection summary
        </h2>

        <ReportActions
          reportName="Collection summary"
          from={from}
          to={to}
          branch={branch}
          agent={agent}
          csvHeader={csvHeader}
          csvRows={csvRows}
          filenamePrefix="collection-summary"
        />
      </div>

      {total <= 0 ? (
        <div className="py-12 bg-white rounded-xl border border-[#E6ECF5]">
          <EmptyState
            title="No collections in this period"
            description="There are no cash, UPI, or bank collections matching the selected date range and filters."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* TOTAL PANEL (HighlightPanel, p-6): muted label "Total collections" and value in bold ~48px PRIMARY BLUE (₹4,200) */}
          <HighlightPanel className="p-6 bg-[#EAF1FE] rounded-xl border border-[#C9DBFB]/40">
            <span className="text-xs sm:text-sm font-semibold text-[#64748B] block">
              Total collections
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold text-[#1F6BFF] mt-1 block tabular-nums tracking-tight">
              {formatINR(total)}
            </span>
          </HighlightPanel>

          {/* Two cards side by side (lg:grid-cols-2 gap-6, stacked on mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* TABLE CARD */}
            <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1B3F] mb-4">
                  Collections by payment mode
                </h3>

                <div className="overflow-x-auto rounded-lg border border-[#D9E1EC]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                        <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F]">
                          Payment mode
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right"
                        >
                          Amount (₹)
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right"
                        >
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] bg-white">
                      {byMethod.map((row) => (
                        <tr key={row.method} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3.5 font-medium text-[#0B1B3F]">
                            {row.label}
                          </td>
                          <td className="py-3 px-3.5 font-semibold text-[#0B1B3F] text-right tabular-nums">
                            {formatNumberIN(row.amount)}
                          </td>
                          <td className="py-3 px-3.5 text-[#475569] text-right tabular-nums">
                            {formatPercent(row.percentage)}
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-[#F8FAFC] font-bold border-t-2 border-[#D9E1EC]">
                        <td className="py-3 px-3.5 text-[#0B1B3F]">Total</td>
                        <td className="py-3 px-3.5 text-[#0B1B3F] text-right tabular-nums font-bold">
                          {formatNumberIN(total)}
                        </td>
                        <td className="py-3 px-3.5 text-[#0B1B3F] text-right tabular-nums font-bold">
                          100%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CHART CARD */}
            <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-[#0B1B3F] mb-2">
                Collections by payment mode
              </h3>

              <div className="flex-1 flex items-center justify-center pt-2">
                <BarChart data={chartData} title="Amount by payment mode" />
              </div>
            </div>
          </div>

          {/* Muted caption when report excludes withheld amounts */}
          {excludedWithheld > 0 && (
            <p className="text-xs text-[#64748B] italic pt-1">
              Excludes {formatINR(excludedWithheld)} withheld from disbursements.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { formatINR, formatNumberIN } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { ReportActions } from "./ReportActions";
import type { LoanPortfolioReportData } from "@/lib/reports";

interface LoanPortfolioViewProps {
  data: LoanPortfolioReportData;
  from: string;
  to: string;
  branch?: string;
  agent?: string;
}

export function LoanPortfolioView({
  data,
  from,
  to,
  branch = "All",
  agent = "All",
}: LoanPortfolioViewProps) {
  const {
    activeLoansCount,
    outstandingPrincipal,
    disbursedInPeriod,
    overdueLoansCount,
    byStatus,
    byFrequency,
  } = data;

  const csvHeader = ["Category", "Status / Frequency", "Loan Count", "Total Principal (INR)", "Remaining (INR)"];
  const csvRows = [
    ...byStatus.map((s) => ["By Status", s.status, s.count, s.totalAmount, s.remainingAmount]),
    ...byFrequency.map((f) => ["By Frequency", f.frequency, f.count, f.totalAmount, f.remainingAmount]),
  ];

  return (
    <div className="space-y-6" data-print-area="true">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Loan portfolio
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active borrower principal, risk exposure, and disbursement distribution.
          </p>
        </div>

        <ReportActions
          reportName="Loan portfolio"
          from={from}
          to={to}
          branch={branch}
          agent={agent}
          csvHeader={csvHeader}
          csvRows={csvRows}
          filenamePrefix="loan-portfolio"
        />
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active loans" value={String(activeLoansCount)} />
        <StatCard label="Outstanding principal" value={formatINR(outstandingPrincipal)} />
        <StatCard label="Disbursed in period" value={formatINR(disbursedInPeriod)} />
        <StatCard label="Overdue loans" value={String(overdueLoansCount)} />
      </div>

      {/* Table: Breakdown by status */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#0B1B3F]">Loans by status</h3>
        <div className="overflow-x-auto rounded-lg border border-[#D9E1EC]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                <th scope="col" className="py-2.5 px-3">Status</th>
                <th scope="col" className="py-2.5 px-3 text-right">Count</th>
                <th scope="col" className="py-2.5 px-3 text-right">Total Principal (₹)</th>
                <th scope="col" className="py-2.5 px-3 text-right">Remaining (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {byStatus.map((row) => (
                <tr key={row.status} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-[#0B1B3F] capitalize">{row.status}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{row.count}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatNumberIN(row.totalAmount)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold">{formatNumberIN(row.remainingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table: Breakdown by frequency */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#0B1B3F]">Loans by repayment frequency</h3>
        <div className="overflow-x-auto rounded-lg border border-[#D9E1EC]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                <th scope="col" className="py-2.5 px-3">Frequency</th>
                <th scope="col" className="py-2.5 px-3 text-right">Count</th>
                <th scope="col" className="py-2.5 px-3 text-right">Total Principal (₹)</th>
                <th scope="col" className="py-2.5 px-3 text-right">Remaining (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {byFrequency.map((row) => (
                <tr key={row.frequency} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-[#0B1B3F] capitalize">{row.frequency}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{row.count}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{formatNumberIN(row.totalAmount)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold">{formatNumberIN(row.remainingAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

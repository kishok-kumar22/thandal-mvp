"use client";

import React from "react";
import { formatINR } from "@/lib/format";
import { StatCard } from "@/components/ui/StatCard";
import { ReportActions } from "./ReportActions";
import type { InterestPenaltiesData } from "@/lib/reports";

interface InterestPenaltiesViewProps {
  data: InterestPenaltiesData;
  from: string;
  to: string;
  branch?: string;
  agent?: string;
}

export function InterestPenaltiesView({
  data,
  from,
  to,
  branch = "All",
  agent = "All",
}: InterestPenaltiesViewProps) {
  const {
    interestDue,
    interestCollected,
    penaltiesAssessed,
    penaltiesWaived,
    penaltiesCollected,
  } = data;

  const csvHeader = ["Metric", "Amount (INR)"];
  const csvRows = [
    ["Interest Due", interestDue],
    ["Interest Collected", interestCollected],
    ["Penalties Assessed", penaltiesAssessed],
    ["Penalties Waived", penaltiesWaived],
    ["Penalties Collected", penaltiesCollected],
  ];

  return (
    <div className="space-y-6" data-print-area="true">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Interest & penalties
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Accrued interest earnings, penalty fee realization, and approved waiver totals.
          </p>
        </div>

        <ReportActions
          reportName="Interest & penalties"
          from={from}
          to={to}
          branch={branch}
          agent={agent}
          csvHeader={csvHeader}
          csvRows={csvRows}
          filenamePrefix="interest-penalties"
        />
      </div>

      {/* 5 Metric StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard label="Interest due" value={formatINR(interestDue)} />
        <StatCard label="Interest collected" value={formatINR(interestCollected)} />
        <StatCard label="Penalties assessed" value={formatINR(penaltiesAssessed)} />
        <StatCard label="Penalties waived" value={formatINR(penaltiesWaived)} />
        <StatCard label="Penalties collected" value={formatINR(penaltiesCollected)} />
      </div>

      {/* Summary Highlights */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#0B1B3F]">Earnings realization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-[#E6ECF5] space-y-1">
            <span className="text-[#64748B] block">Net Penalty Revenue</span>
            <span className="text-xl font-bold text-emerald-700 block tabular-nums">
              {formatINR(penaltiesCollected)}
            </span>
            <span className="text-[11px] text-[#64748B] block">
              After {formatINR(penaltiesWaived)} managerial waivers
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-[#E6ECF5] space-y-1">
            <span className="text-[#64748B] block">Total Financial Income</span>
            <span className="text-xl font-bold text-[#1F6BFF] block tabular-nums">
              {formatINR(interestCollected + penaltiesCollected)}
            </span>
            <span className="text-[11px] text-[#64748B] block">
              Interest + Realized penalty charges
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

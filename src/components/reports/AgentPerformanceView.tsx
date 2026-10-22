"use client";

import React from "react";
import { formatNumberIN } from "@/lib/format";
import { ReportActions } from "./ReportActions";
import type { AgentPerformanceRow } from "@/lib/reports";

interface AgentPerformanceViewProps {
  rows: AgentPerformanceRow[];
  total: AgentPerformanceRow;
  from: string;
  to: string;
  branch?: string;
  agent?: string;
}

export function AgentPerformanceView({
  rows,
  total,
  from,
  to,
  branch = "All",
  agent = "All",
}: AgentPerformanceViewProps) {
  const csvHeader = [
    "Agent ID",
    "Agent Name",
    "Assigned Customers",
    "Receipts Count",
    "Total Collected (INR)",
    "Cash Collected (INR)",
    "Non-cash Collected (INR)",
    "Overdue Customers",
  ];
  const csvRows = rows.map((r) => [
    r.agentId,
    r.agentName,
    r.customersCount,
    r.receiptsCount,
    r.collectedAmount,
    r.cashAmount,
    r.nonCashAmount,
    r.overdueCustomers,
  ]);
  csvRows.push([
    "ALL",
    "Total",
    total.customersCount,
    total.receiptsCount,
    total.collectedAmount,
    total.cashAmount,
    total.nonCashAmount,
    total.overdueCustomers,
  ]);

  return (
    <div className="space-y-6" data-print-area="true">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Agent performance
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Field collection productivity, cash custody volume, and recovery success.
          </p>
        </div>

        <ReportActions
          reportName="Agent performance"
          from={from}
          to={to}
          branch={branch}
          agent={agent}
          csvHeader={csvHeader}
          csvRows={csvRows}
          filenamePrefix="agent-performance"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#D9E1EC]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F]">Agent</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Customers</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Receipts</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Collected (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Cash (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Non-cash (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {rows.map((r) => (
                <tr key={r.agentId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3.5 font-semibold text-[#0B1B3F]">
                    {r.agentName}{" "}
                    <span className="text-[10px] text-[#64748B] font-normal">({r.agentId})</span>
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums">{r.customersCount}</td>
                  <td className="py-3 px-3.5 text-right tabular-nums">{r.receiptsCount}</td>
                  <td className="py-3 px-3.5 text-right tabular-nums font-bold text-[#0B1B3F]">
                    {formatNumberIN(r.collectedAmount)}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums text-emerald-700">
                    {formatNumberIN(r.cashAmount)}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums text-[#1F6BFF]">
                    {formatNumberIN(r.nonCashAmount)}
                  </td>
                  <td className="py-3 px-3.5 text-right tabular-nums font-semibold text-amber-700">
                    {r.overdueCustomers}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-[#F8FAFC] font-bold border-t-2 border-[#D9E1EC]">
                <td className="py-3 px-3.5 text-[#0B1B3F]">Total</td>
                <td className="py-3 px-3.5 text-right tabular-nums font-bold">{total.customersCount}</td>
                <td className="py-3 px-3.5 text-right tabular-nums font-bold">{total.receiptsCount}</td>
                <td className="py-3 px-3.5 text-right tabular-nums font-extrabold text-[#1F6BFF]">
                  {formatNumberIN(total.collectedAmount)}
                </td>
                <td className="py-3 px-3.5 text-right tabular-nums font-bold text-emerald-800">
                  {formatNumberIN(total.cashAmount)}
                </td>
                <td className="py-3 px-3.5 text-right tabular-nums font-bold text-[#1F6BFF]">
                  {formatNumberIN(total.nonCashAmount)}
                </td>
                <td className="py-3 px-3.5 text-right tabular-nums font-bold text-amber-900">
                  {total.overdueCustomers}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

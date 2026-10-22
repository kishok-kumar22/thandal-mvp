"use client";

import React from "react";
import { formatNumberIN } from "@/lib/format";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { ReportActions } from "./ReportActions";
import type { CashReconRow } from "@/lib/reports";

interface CashReconciliationViewProps {
  rows: CashReconRow[];
  allMatch: boolean;
  date: string;
  from: string;
  to: string;
  branch?: string;
  agent?: string;
}

export function CashReconciliationView({
  rows,
  allMatch,
  date,
  from,
  to,
  branch = "All",
  agent = "All",
}: CashReconciliationViewProps) {
  const csvHeader = [
    "Agent ID",
    "Agent Name",
    "Opening Cash (INR)",
    "Cash Collected (INR)",
    "Accepted Handovers (INR)",
    "Pending Handovers (INR)",
    "Outstanding Cash (INR)",
    "Reconciliation Check",
  ];
  const csvRows = rows.map((r) => [
    r.agentId,
    r.agentName,
    r.openingCash,
    r.cashCollected,
    r.acceptedHandovers,
    r.pendingHandovers,
    r.outstanding,
    r.checkStatus,
  ]);

  return (
    <div className="space-y-6" data-print-area="true">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Cash reconciliation
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cross-checks physical cash collected against immutable cashbook ledger entries as of {date}.
          </p>
        </div>

        <ReportActions
          reportName="Cash reconciliation"
          from={from}
          to={to}
          branch={branch}
          agent={agent}
          csvHeader={csvHeader}
          csvRows={csvRows}
          filenamePrefix="cash-reconciliation"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#D9E1EC]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F]">Agent</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Opening (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Collected (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Accepted (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Pending (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-right">Outstanding (₹)</th>
                <th scope="col" className="py-3 px-3.5 font-bold text-[#0B1B3F] text-center">Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] bg-white">
              {rows.map((r) => {
                const isMatch = r.checkStatus === "Matches";
                return (
                  <tr key={r.agentId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3.5 font-semibold text-[#0B1B3F]">
                      {r.agentName}{" "}
                      <span className="text-[10px] text-[#64748B] font-normal">({r.agentId})</span>
                    </td>
                    <td className="py-3 px-3.5 text-right tabular-nums">{formatNumberIN(r.openingCash)}</td>
                    <td className="py-3 px-3.5 text-right tabular-nums font-semibold text-[#0B1B3F]">
                      {formatNumberIN(r.cashCollected)}
                    </td>
                    <td className="py-3 px-3.5 text-right tabular-nums text-slate-600">
                      {formatNumberIN(r.acceptedHandovers)}
                    </td>
                    <td className="py-3 px-3.5 text-right tabular-nums text-amber-700">
                      {formatNumberIN(r.pendingHandovers)}
                    </td>
                    <td className="py-3 px-3.5 text-right tabular-nums font-bold text-[#1F6BFF]">
                      {formatNumberIN(r.outstanding)}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isMatch
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {isMatch ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
                        )}
                        <span>{r.checkStatus}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2">
          {allMatch ? (
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All cash ledger collections reconcile with recorded cash payment receipts.</span>
            </p>
          ) : (
            <p className="text-xs text-red-600 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Discrepancies detected between cash receipts and cash ledger entries.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

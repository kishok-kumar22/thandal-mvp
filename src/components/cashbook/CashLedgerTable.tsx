import React from "react";
import Link from "next/link";
import { formatNumberIN } from "@/lib/format";
import { formatTime12h } from "@/lib/clock";
import type { LedgerRowView } from "@/lib/cashbook";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";

interface CashLedgerTableProps {
  rows: LedgerRowView[];
  totalIn: number;
  totalOut: number;
}

export function CashLedgerTable({ rows, totalIn, totalOut }: CashLedgerTableProps) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-8 shadow-xs">
        <EmptyState
          title="No cash entries for this date"
          description="There are no cash collections, handovers, or ledger adjustments recorded."
          actionLabel="View all handovers"
          onAction={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F6]">
        <h3 className="text-lg font-bold text-[#0B1B3F]">Cash ledger</h3>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto min-w-[760px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-b border-[#E6ECF5]">
              <th scope="col" className="py-3 px-4">Time</th>
              <th scope="col" className="py-3 px-4">Agent</th>
              <th scope="col" className="py-3 px-4">Type</th>
              <th scope="col" className="py-3 px-4">Reference</th>
              <th scope="col" className="py-3 px-4 text-right">In (₹)</th>
              <th scope="col" className="py-3 px-4 text-right">Out (₹)</th>
              <th scope="col" className="py-3 px-4 text-right">Balance (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6ECF5]">
            {rows.map((row) => {
              const timeDisplay = formatTime12h(row.at);
              const refHref = row.refId?.startsWith("RC-")
                ? `/admin/receipts/${row.refId}`
                : `/admin/cashbook/handovers?handover=${row.refId}`;

              const typeBadge =
                row.kind === "collection"
                  ? "bg-[#DBEAFE] text-[#1D4ED8]"
                  : row.kind === "handover"
                  ? "bg-[#FEF3C7] text-[#B45309]"
                  : "bg-[#F1F5F9] text-[#475569]";

              return (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#0B1B3F]">
                    {timeDisplay}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#0B1B3F]">
                    {row.agentName || row.agentId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize ${typeBadge}`}
                    >
                      {row.kind}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.refId ? (
                      <Link
                        href={refHref}
                        className="font-mono text-xs font-semibold text-[#1F6BFF] hover:underline"
                      >
                        {row.refId}
                      </Link>
                    ) : (
                      <span className="text-[#94A3B8]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-[#0B1B3F] tabular-nums">
                    {row.inAmount > 0 ? formatNumberIN(row.inAmount) : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-[#B91C1C] tabular-nums">
                    {row.outAmount > 0 ? formatNumberIN(row.outAmount) : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0B1B3F] tabular-nums">
                    {formatNumberIN(row.runningBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#F8FAFC] text-[#0B1B3F] font-bold border-t-2 border-[#E6ECF5]">
              <td colSpan={4} className="py-3.5 px-4 text-xs uppercase tracking-wider">
                Total for date
              </td>
              <td className="py-3.5 px-4 text-right tabular-nums text-sm font-bold">
                ₹{formatNumberIN(totalIn)}
              </td>
              <td className="py-3.5 px-4 text-right tabular-nums text-sm font-bold text-[#B91C1C]">
                ₹{formatNumberIN(totalOut)}
              </td>
              <td className="py-3.5 px-4 text-right tabular-nums text-sm font-extrabold text-[#1F6BFF]">
                ₹{formatNumberIN(rows[rows.length - 1]?.runningBalance || 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Stacked Cards (<640px) */}
      <div className="sm:hidden divide-y divide-[#EEF2F6]">
        {rows.map((row) => (
          <div key={row.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0B1B3F]">
                {formatTime12h(row.at)} &bull; {row.agentName}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded capitalize bg-slate-100 text-[#475569]">
                {row.kind}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>Ref: {row.refId || "—"}</span>
              <span className="font-mono text-sm font-bold text-[#0B1B3F] tabular-nums">
                Balance: ₹{formatNumberIN(row.runningBalance)}
              </span>
            </div>

            <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-[#15803D] font-semibold">
                In: {row.inAmount > 0 ? `₹${formatNumberIN(row.inAmount)}` : "—"}
              </span>
              <span className="text-[#B91C1C] font-semibold">
                Out: {row.outAmount > 0 ? `₹${formatNumberIN(row.outAmount)}` : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

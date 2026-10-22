import React from "react";
import { formatINR } from "@/lib/format";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Handover } from "@/data/mockHandovers";

interface MyHandoversTableProps {
  handovers: Handover[];
}

export function MyHandoversTable({ handovers }: MyHandoversTableProps) {
  if (handovers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-8 shadow-xs">
        <EmptyState
          title="No handovers yet"
          description="Physical cash deposits submitted to the cashier or main office will be listed here."
          actionLabel="Refresh"
          onAction={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#EEF2F6]">
        <h3 className="text-lg font-bold text-[#0B1B3F]">My handovers</h3>
      </div>

      {/* Desktop Table (>=640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-b border-[#E6ECF5]">
              <th scope="col" className="py-3 px-4">Handover ID</th>
              <th scope="col" className="py-3 px-4">Date &amp; Time</th>
              <th scope="col" className="py-3 px-4">Recipient</th>
              <th scope="col" className="py-3 px-4 text-right">Amount</th>
              <th scope="col" className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6ECF5]">
            {handovers.map((h) => {
              const dateObj = new Date(h.submittedAt);
              const dateStr = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "22 Oct 2026";

              return (
                <tr key={h.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B1B3F]">
                    {h.id}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155] font-medium">
                    {dateStr}
                  </td>
                  <td className="py-3.5 px-4 text-[#334155]">
                    {h.recipient || "Main office"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0B1B3F] tabular-nums">
                    {formatINR(h.actualAmount ?? h.reportedAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <StatusChip status={h.status} />
                      {h.status === "rejected" && h.rejectionReason && (
                        <span className="text-[11px] text-[#E5252A] max-w-xs truncate font-medium">
                          Reason: {h.rejectionReason}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (<640px) */}
      <div className="sm:hidden divide-y divide-[#EEF2F6]">
        {handovers.map((h) => (
          <div key={h.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#0B1B3F]">
                {h.id}
              </span>
              <StatusChip status={h.status} />
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B]">
              <span>To: {h.recipient || "Main office"}</span>
              <span className="text-base font-extrabold text-[#0B1B3F] tabular-nums">
                {formatINR(h.actualAmount ?? h.reportedAmount)}
              </span>
            </div>

            {h.status === "rejected" && h.rejectionReason && (
              <p className="text-xs text-[#E5252A] bg-[#FEE2E2]/50 p-2 rounded-md">
                Reason: {h.rejectionReason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

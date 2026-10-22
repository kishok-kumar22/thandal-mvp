import React from "react";
import { formatINR } from "@/lib/format";
import { StatusChip } from "@/components/ui/StatusChip";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Handover } from "@/data/mockHandovers";

interface PendingHandoversTableProps {
  handovers: Handover[];
  selectedId: string | null;
  onSelect: (handover: Handover) => void;
}

export function PendingHandoversTable({
  handovers,
  selectedId,
  onSelect,
}: PendingHandoversTableProps) {
  if (handovers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-8 shadow-xs">
        <EmptyState
          title="No pending handovers"
          description="Handovers submitted by agents will appear here for physical verification and ledger crediting."
          actionLabel="View cash ledger"
          onAction={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden flex flex-col justify-between">
      <div>
        <div className="p-5 border-b border-[#EEF2F6]">
          <h3 className="text-lg font-bold text-[#0B1B3F]">
            Pending handovers ({handovers.length})
          </h3>
        </div>

        {/* Desktop Table (>=768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-b border-[#E6ECF5]">
                <th scope="col" className="py-3 px-4">Handover ID</th>
                <th scope="col" className="py-3 px-4">Agent</th>
                <th scope="col" className="py-3 px-4">Amount</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {handovers.map((h) => {
                const isSelected = h.id === selectedId;

                return (
                  <tr
                    key={h.id}
                    aria-selected={isSelected}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-[#FFF8EB] hover:bg-[#FFF3DB]"
                        : "hover:bg-slate-50/60"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#0B1B3F] font-mono">
                      {h.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#0B1B3F]">
                      {h.agentName || "Selvam"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0B1B3F] tabular-nums">
                      {formatINR(h.reportedAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusChip status="pending_review" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={`Review handover ${h.id}`}
                        onClick={() => onSelect(h)}
                        className={`text-xs font-semibold ${
                          isSelected
                            ? "bg-[#1F6BFF] text-white border-[#1F6BFF] hover:bg-[#1757D6]"
                            : "text-[#1F6BFF] border-[#BFDBFE] hover:bg-[#F3F7FF]"
                        }`}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards (<768px) */}
        <div className="md:hidden divide-y divide-[#EEF2F6]">
          {handovers.map((h) => {
            const isSelected = h.id === selectedId;

            return (
              <div
                key={h.id}
                aria-selected={isSelected}
                className={`p-4 space-y-3 transition-colors ${
                  isSelected ? "bg-[#FFF8EB]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0B1B3F] font-mono text-base block">
                      {h.id}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {h.agentName || "Selvam"}
                    </span>
                  </div>
                  <StatusChip status="pending_review" />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xl font-extrabold text-[#0B1B3F] tabular-nums">
                    {formatINR(h.reportedAmount)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={`Review handover ${h.id}`}
                    onClick={() => onSelect(h)}
                    className="text-xs font-semibold text-[#1F6BFF] border-[#BFDBFE]"
                  >
                    Review
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Small muted caption at bottom of card */}
      <div className="p-3 bg-[#F8FAFC] border-t border-[#EEF2F6] text-center">
        <p className="text-xs text-[#64748B]">
          Showing all pending handovers regardless of date.
        </p>
      </div>
    </div>
  );
}

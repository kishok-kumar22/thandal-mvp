import React from "react";
import { User, Calendar } from "lucide-react";
import { formatINR } from "@/lib/format";
import { HighlightPanel } from "@/components/ui/HighlightPanel";
import { SummaryRow } from "@/components/ui/SummaryRow";

interface HandoverSummaryCardProps {
  agentName: string;
  dateStr: string;
  openingCash: number;
  cashCollected: number;
  acceptedHandovers: number;
  pendingReview?: number;
  availableCash: number;
}

export function HandoverSummaryCard({
  agentName,
  dateStr,
  openingCash,
  cashCollected,
  acceptedHandovers,
  pendingReview = 0,
  availableCash,
}: HandoverSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-4">
      {/* Top row: Agent & Date icon tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#EEF2F7] rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/80 border border-[#D9E1EC] flex items-center justify-center text-[#1F6BFF] shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-[#64748B] block truncate">Agent</span>
            <span className="text-sm font-bold text-[#0B1B3F] block truncate">{agentName}</span>
          </div>
        </div>

        <div className="bg-[#EEF2F7] rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/80 border border-[#D9E1EC] flex items-center justify-center text-[#1F6BFF] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-medium text-[#64748B] block truncate">Date</span>
            <span className="text-sm font-bold text-[#0B1B3F] block truncate">{dateStr}</span>
          </div>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="divide-y divide-[#F1F5F9] text-sm">
        <SummaryRow
          label="Opening cash"
          value={formatINR(openingCash)}
          className="py-2.5 text-[15px]"
        />
        <SummaryRow
          label="Cash collected"
          value={formatINR(cashCollected)}
          className="py-2.5 text-[15px]"
        />
        <SummaryRow
          label="Accepted handovers"
          value={formatINR(acceptedHandovers)}
          className="py-2.5 text-[15px]"
        />
        {pendingReview > 0 && (
          <div className="flex items-center justify-between py-2.5 text-[15px] text-amber-700 bg-amber-50/50 px-2 rounded-lg my-1">
            <span className="font-medium text-amber-800">Pending review</span>
            <span className="font-bold tabular-nums text-amber-900">{formatINR(pendingReview)}</span>
          </div>
        )}
      </div>

      {/* Hairline + Available Cash Panel */}
      <div className="pt-2">
        <HighlightPanel className="flex items-center justify-between px-4 py-3.5 bg-[#EAF1FE] rounded-lg">
          <span className="text-sm font-bold text-[#0B1B3F]">Available cash</span>
          <span className="text-xl font-extrabold text-[#1F6BFF] tabular-nums">
            {formatINR(availableCash)}
          </span>
        </HighlightPanel>
      </div>
    </div>
  );
}

import React from "react";
import { formatINR } from "@/lib/format";
import { HighlightPanel } from "@/components/ui/HighlightPanel";
import { InfoPanel } from "@/components/ui/InfoPanel";

interface HandoverReviewCardProps {
  afterBalance: number;
}

export function HandoverReviewCard({ afterBalance }: HandoverReviewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-[#0B1B3F]">Review</h3>

      <HighlightPanel className="flex items-center justify-between px-4 py-3 bg-[#EAF1FE] rounded-lg">
        <span className="text-sm font-medium text-[#0B1B3F]">
          After acceptance cash balance
        </span>
        <span
          className="text-base font-bold text-[#0B1B3F] tabular-nums"
          aria-live="polite"
        >
          {formatINR(Math.max(0, afterBalance))}
        </span>
      </HighlightPanel>

      <InfoPanel>
        Submission awaits admin acknowledgement.
      </InfoPanel>
    </div>
  );
}

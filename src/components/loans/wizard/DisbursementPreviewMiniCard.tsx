import React from "react";
import { formatINR } from "@/lib/format";
import type { LoanCalculation } from "@/lib/loan";

interface DisbursementPreviewMiniCardProps {
  calc: LoanCalculation;
  toggleOn: boolean;
}

export function DisbursementPreviewMiniCard({
  calc,
  toggleOn,
}: DisbursementPreviewMiniCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs">
      <h2 className="text-base font-bold text-[#0B1B3F] mb-4">
        Disbursement preview
      </h2>

      <div
        aria-live="polite"
        className="bg-[#F3F6FB] rounded-xl p-4.5 space-y-3.5 border border-[#E2E8F0]/60"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B]">Cash released</span>
          <span className="font-bold text-[#0B1B3F] tabular-nums">
            {formatINR(calc.netCash)}
          </span>
        </div>

        <div className="border-t border-[#CBD5E1]/60" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B]">
            {toggleOn ? "Remaining after first payment" : "Remaining balance"}
          </span>
          <span className="font-bold text-[#0B1B3F] tabular-nums">
            {formatINR(calc.remainingToCollect)}
          </span>
        </div>
      </div>
    </div>
  );
}

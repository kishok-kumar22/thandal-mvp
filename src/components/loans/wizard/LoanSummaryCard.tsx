import React from "react";
import { formatINR } from "@/lib/format";
import type { LoanCalculation } from "@/lib/loan";

interface LoanSummaryCardProps {
  calc: LoanCalculation;
}

export function LoanSummaryCard({ calc }: LoanSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs">
      <h2 className="text-base font-bold text-[#0B1B3F] mb-4">Loan summary</h2>

      <div
        aria-live="polite"
        className="bg-[#F3F6FB] rounded-xl p-4.5 space-y-3.5 border border-[#E2E8F0]/60"
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B]">Principal amount</span>
          <span className="font-bold text-[#0B1B3F] tabular-nums">
            {formatINR(calc.principal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B]">
            Total interest ({calc.ratePercent}%)
          </span>
          <span className="font-bold text-[#0B1B3F] tabular-nums">
            {formatINR(calc.totalInterest)}
          </span>
        </div>

        <div className="border-t border-[#CBD5E1]/60" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#0B1B3F]">Total repayment</span>
          <span className="text-base font-extrabold text-[#0B1B3F] tabular-nums">
            {formatINR(calc.totalRepayment)}
          </span>
        </div>

        <div className="border-t border-[#CBD5E1]/60" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-[#64748B]">Instalment amount</span>
          <span className="font-bold text-[#0B1B3F] tabular-nums">
            {formatINR(calc.instalment)}
          </span>
        </div>
      </div>
    </div>
  );
}

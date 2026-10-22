import React from "react";
import Link from "next/link";
import type { LoanItem } from "@/data/mockLoans";
import { LoanStatusChip } from "../LoanStatusChip";
import { formatNumberIN } from "@/lib/format";

interface LoanCardProps {
  loan: LoanItem;
}

export function LoanCard({ loan }: LoanCardProps) {
  const capFrequency =
    loan.frequency.charAt(0).toUpperCase() + loan.frequency.slice(1);

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-4 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#0B1B3F] text-base">{loan.id}</span>
        <LoanStatusChip status={loan.status} />
      </div>

      <div>
        <div className="text-xs text-[#64748B]">Customer Name</div>
        <div className="text-sm font-semibold text-[#0B1B3F]">{loan.customerName}</div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#EEF2F6]">
        <div>
          <span className="text-[11px] text-[#64748B] block">Principal (₹)</span>
          <span className="text-sm font-bold text-[#0B1B3F] tabular-nums">
            {formatNumberIN(loan.principal)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#64748B] block">Interest (₹)</span>
          <span className="text-sm font-bold text-[#0B1B3F] tabular-nums">
            {formatNumberIN(loan.interest)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#64748B] block">Remaining (₹)</span>
          <span className="text-sm font-bold text-[#0B1B3F] tabular-nums">
            {formatNumberIN(loan.remaining)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#64748B] block">Frequency</span>
          <span className="text-sm font-semibold text-[#0B1B3F]">{capFrequency}</span>
        </div>
      </div>

      <Link
        href={`/admin/loans/${loan.id}`}
        className="w-full h-9 flex items-center justify-center rounded-lg border border-[#1F6BFF] text-[#1F6BFF] font-semibold text-xs hover:bg-[#1F6BFF]/5 active:bg-[#1F6BFF]/10 transition-colors"
      >
        View
      </Link>
    </div>
  );
}

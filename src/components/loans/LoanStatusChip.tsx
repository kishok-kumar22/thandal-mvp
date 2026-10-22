import React from "react";
import type { LoanStatus } from "@/lib/loan";

interface LoanStatusChipProps {
  status: LoanStatus | string;
  className?: string;
}

export function LoanStatusChip({ status, className = "" }: LoanStatusChipProps) {
  const normalized = (status || "active").toLowerCase() as LoanStatus;

  switch (normalized) {
    case "active":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#1F6BFF] shrink-0" aria-hidden="true" />
          Active
        </span>
      );

    case "pending":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" aria-hidden="true" />
          Pending
        </span>
      );

    case "overdue":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" aria-hidden="true" />
          Overdue
        </span>
      );

    case "completed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0" aria-hidden="true" />
          Completed
        </span>
      );

    case "closed":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#94A3B8] shrink-0" aria-hidden="true" />
          Closed
        </span>
      );
  }
}

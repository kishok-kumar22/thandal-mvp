"use client";

import React from "react";
import { formatINR } from "@/lib/format";
import { StatusChip } from "@/components/ui/StatusChip";
import type { AllocationResult } from "@/lib/payments";

interface AllocationPreviewCardProps {
  allocation: AllocationResult | null;
  isValid: boolean;
}

export function AllocationPreviewCard({
  allocation,
  isValid,
}: AllocationPreviewCardProps) {
  const isPartial = allocation?.status === "partial";
  const isPaid = allocation?.status === "paid";

  // Dynamic panel styles
  let panelBg = "bg-[#F8FAFC] border-[#E2E8F0]";
  if (isValid && allocation) {
    if (isPartial) {
      panelBg = "bg-[#FFF4DC] border-[#F5C26B]";
    } else if (isPaid) {
      panelBg = "bg-[#EAF1FE] border-[#BFDBFE]";
    }
  }

  const hasSpecialAllocations =
    allocation &&
    (allocation.toPenalty > 0 || allocation.toArrears > 0);

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs space-y-3">
      <h3 className="text-base font-bold text-[#0B1B3F]">
        Allocation preview
      </h3>

      {/* Main 3-column Panel */}
      <div
        aria-live="polite"
        className={`rounded-xl border p-4 transition-colors ${panelBg}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10 gap-y-3 sm:gap-y-0 text-center">
          {/* Col 1: Amount paid */}
          <div className="px-2 flex flex-col justify-center">
            <span className="text-xs font-medium text-[#64748B] block truncate">
              Amount paid
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#0B1B3F] tabular-nums mt-1 leading-tight">
              {isValid && allocation ? formatINR(allocation.applied) : "—"}
            </span>
          </div>

          {/* Col 2: Remaining instalment balance */}
          <div className="px-2 flex flex-col justify-center">
            <span className="text-xs font-medium text-[#64748B] block truncate">
              Remaining instalment balance
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#0B1B3F] tabular-nums mt-1 leading-tight">
              {isValid && allocation
                ? formatINR(allocation.remainingBalance)
                : "—"}
            </span>
          </div>

          {/* Col 3: Status */}
          <div className="px-2 flex flex-col justify-center items-center">
            <span className="text-xs font-medium text-[#64748B] block truncate mb-1">
              Status
            </span>
            {isValid && allocation ? (
              <StatusChip status={allocation.status} size="lg" />
            ) : (
              <span className="text-base font-medium text-[#94A3B8]">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown list if penalties or arrears are involved */}
      {isValid && hasSpecialAllocations && allocation && (
        <div className="pt-2 text-xs border-t border-[#EEF2F6] space-y-1.5">
          <span className="font-semibold text-[#64748B] block uppercase tracking-wider text-[11px]">
            Applied to:
          </span>
          <div className="flex items-center justify-between text-[#334155]">
            <span>Penalty</span>
            <span className="font-semibold tabular-nums text-[#B91C1C]">
              {formatINR(allocation.toPenalty)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#334155]">
            <span>Arrears</span>
            <span className="font-semibold tabular-nums text-[#B45309]">
              {formatINR(allocation.toArrears)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#334155]">
            <span>Scheduled instalment</span>
            <span className="font-semibold tabular-nums text-[#1F6BFF]">
              {formatINR(allocation.toScheduled)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

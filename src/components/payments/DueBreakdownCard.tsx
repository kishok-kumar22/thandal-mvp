import React from "react";
import { formatINR } from "@/lib/format";

interface DueBreakdownCardProps {
  scheduledDue: number;
  arrears: number;
  penalty: number;
  totalDue: number;
}

export function DueBreakdownCard({
  scheduledDue,
  arrears,
  penalty,
  totalDue,
}: DueBreakdownCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-3 sm:p-4 shadow-xs">
      <div className="grid grid-cols-2 min-[420px]:grid-cols-4 divide-y min-[420px]:divide-y-0 min-[420px]:divide-x divide-[#E6ECF5] gap-y-3 min-[420px]:gap-y-0">
        {/* Cell 1: Scheduled due */}
        <div className="p-3 text-center flex flex-col justify-center">
          <span className="text-xs font-medium text-[#64748B] block truncate">
            Scheduled due
          </span>
          <span className="text-2xl sm:text-[30px] font-bold text-[#0B1B3F] tabular-nums mt-1 leading-tight">
            {formatINR(scheduledDue)}
          </span>
        </div>

        {/* Cell 2: Arrears */}
        <div className="p-3 text-center flex flex-col justify-center">
          <span className="text-xs font-medium text-[#64748B] block truncate">
            Arrears
          </span>
          <span
            className={`text-2xl sm:text-[30px] font-bold tabular-nums mt-1 leading-tight ${
              arrears > 0 ? "text-[#B91C1C]" : "text-[#0B1B3F]"
            }`}
          >
            {formatINR(arrears)}
          </span>
        </div>

        {/* Cell 3: Penalty */}
        <div className="p-3 text-center flex flex-col justify-center">
          <span className="text-xs font-medium text-[#64748B] block truncate">
            Penalty
          </span>
          <span
            className={`text-2xl sm:text-[30px] font-bold tabular-nums mt-1 leading-tight ${
              penalty > 0 ? "text-[#B91C1C]" : "text-[#0B1B3F]"
            }`}
          >
            {formatINR(penalty)}
          </span>
        </div>

        {/* Cell 4: Total due (highlighted panel) */}
        <div className="p-2 sm:p-2.5 flex flex-col justify-center">
          <div className="bg-[#EAF1FE] rounded-lg p-3 text-center h-full flex flex-col justify-center border border-[#BFDBFE]/40">
            <span className="text-xs font-semibold text-[#1F6BFF] block truncate">
              Total due
            </span>
            <span className="text-2xl sm:text-[30px] font-extrabold text-[#1F6BFF] tabular-nums mt-0.5 leading-tight">
              {formatINR(totalDue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

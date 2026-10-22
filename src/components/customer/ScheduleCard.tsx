import React from "react";
import type { ScheduleRow } from "@/lib/schedule";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatNumberIN } from "@/lib/format";

interface ScheduleCardProps {
  row: ScheduleRow;
  isToday?: boolean;
}

export function ScheduleCard({ row, isToday = false }: ScheduleCardProps) {
  return (
    <div
      aria-current={isToday ? "date" : undefined}
      className={`bg-white rounded-xl border p-4 space-y-3 transition-colors ${
        isToday ? "border-[#1F6BFF] ring-1 ring-[#1F6BFF] bg-[#F8FAFF]" : "border-[#E6ECF5]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748B] w-6">#{row.instalmentNumber}</span>
          <span className="text-sm font-bold text-[#0B1B3F]">{row.dueDate}</span>
        </div>
        <StatusChip status={row.status} detailed />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#EEF2F6]">
        <div>
          <span className="text-[#64748B] block">Principal</span>
          <span className="font-semibold text-[#0B1B3F] tabular-nums">
            {formatNumberIN(row.principal)}
          </span>
        </div>
        <div>
          <span className="text-[#64748B] block">Interest</span>
          <span className="font-semibold text-[#0B1B3F] tabular-nums">
            {formatNumberIN(row.interest)}
          </span>
        </div>
        <div>
          <span className="text-[#64748B] block">Due Amount</span>
          <span className="font-bold text-[#0B1B3F] tabular-nums">
            {formatNumberIN(row.dueAmount)}
          </span>
        </div>
        <div>
          <span className="text-[#64748B] block">Paid Amount</span>
          <span className="font-bold text-[#1F6BFF] tabular-nums">
            {formatNumberIN(row.paidAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}

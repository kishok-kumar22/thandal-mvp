import React from "react";
import { Coins, ClipboardList, Clock } from "lucide-react";
import { formatINR } from "@/lib/format";
import { getCashSummary, type CashSummary } from "@/lib/cashbook";

interface CashSummaryCardsProps {
  date?: string;
  agentId?: string;
}

export function CashSummaryCards({ date, agentId }: CashSummaryCardsProps) {
  const summary: CashSummary = getCashSummary({ date, agentId });

  const stats = [
    {
      label: "Cash received",
      value: formatINR(summary.cashReceived),
      icon: Coins,
      tileBg: "bg-[#E8F0FE]",
      iconColor: "text-[#1F6BFF]",
    },
    {
      label: "Accepted handovers",
      value: formatINR(summary.acceptedHandovers),
      icon: ClipboardList,
      tileBg: "bg-[#E8F0FE]",
      iconColor: "text-[#1F6BFF]",
    },
    {
      label: "Cash outstanding",
      value: formatINR(summary.cashOutstanding),
      icon: Clock,
      tileBg: "bg-[#FFF1D6]",
      iconColor: "text-[#B45309]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs flex items-center gap-4.5"
          >
            <div
              className={`w-16 h-16 rounded-full ${stat.tileBg} ${stat.iconColor} flex items-center justify-center shrink-0`}
              aria-hidden="true"
            >
              <Icon className="w-7 h-7" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#64748B] truncate">
                {stat.label}
              </span>
              <span className="text-2xl sm:text-[34px] font-extrabold text-[#0B1B3F] tracking-tight leading-tight tabular-nums mt-1 truncate">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

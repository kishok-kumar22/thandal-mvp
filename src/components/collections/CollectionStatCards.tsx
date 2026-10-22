import React from "react";
import { Calendar, Coins, FileText } from "lucide-react";
import { formatINR } from "@/lib/format";
import type { CollectionSummary } from "@/lib/collections";

interface CollectionStatCardsProps {
  summary: CollectionSummary;
}

export function CollectionStatCards({ summary }: CollectionStatCardsProps) {
  const cards = [
    {
      label: "Due today",
      value: formatINR(summary.dueToday),
      icon: Calendar,
    },
    {
      label: "Received today",
      value: formatINR(summary.receivedToday),
      icon: Coins,
    },
    {
      label: "Remaining today",
      value: formatINR(summary.remainingToday),
      icon: FileText,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs flex items-center gap-4.5"
          >
            <div
              className="w-16 h-16 rounded-full bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Icon className="w-7 h-7" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#64748B] truncate">
                {card.label}
              </span>
              <span className="text-2xl sm:text-[34px] font-bold text-[#1F6BFF] tracking-tight leading-tight tabular-nums mt-0.5 truncate">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

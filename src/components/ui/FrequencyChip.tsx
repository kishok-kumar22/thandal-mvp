import React from "react";
import type { Frequency } from "@/lib/loan";

interface FrequencyChipProps {
  frequency: Frequency | string;
  className?: string;
}

export function FrequencyChip({ frequency, className = "" }: FrequencyChipProps) {
  const norm = (frequency || "daily").toLowerCase() as Frequency;

  switch (norm) {
    case "weekly":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#FDE9C8] text-[#B45309] ${className}`}
        >
          Weekly
        </span>
      );

    case "monthly":
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#EDE9FE] text-[#6D28D9] ${className}`}
        >
          Monthly
        </span>
      );

    case "daily":
    default:
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8] ${className}`}
        >
          Daily
        </span>
      );
  }
}

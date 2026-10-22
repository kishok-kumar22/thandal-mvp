import React from "react";

interface SummaryRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  strong?: boolean;
  className?: string;
  valueClassName?: string;
}

export function SummaryRow({
  label,
  value,
  strong = false,
  className = "",
  valueClassName = "",
}: SummaryRowProps) {
  return (
    <div
      className={`flex items-center justify-between text-sm py-2 ${
        strong ? "font-bold text-[#0B1B3F]" : "text-[#475569]"
      } ${className}`}
    >
      <span className={strong ? "text-[#0B1B3F]" : "text-[#64748B]"}>{label}</span>
      <span className={`tabular-nums ${strong ? "text-[#0B1B3F] text-base font-bold" : "text-[#0B1B3F] font-semibold"} ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

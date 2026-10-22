import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  className?: string;
}

export function StatCard({ label, value, subtext, className = "" }: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E6ECF5] p-4.5 shadow-xs flex flex-col justify-between ${className}`}
    >
      <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <div className="text-2xl font-bold text-[#0B1B3F] tracking-tight tabular-nums">
        {value}
      </div>
      {subtext && <p className="text-xs text-[#94A3B8] mt-1">{subtext}</p>}
    </div>
  );
}

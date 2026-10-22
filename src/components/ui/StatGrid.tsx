import React from "react";

export interface StatCellProps {
  label: React.ReactNode;
  value: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
}

export function StatCell({ label, value, caption, className = "" }: StatCellProps) {
  return (
    <div className={`p-4 md:p-5 flex flex-col justify-center min-w-0 ${className}`}>
      <span className="text-xs font-medium text-[#64748B] tracking-tight truncate">
        {label}
      </span>
      <div className="mt-1.5 text-2xl md:text-3xl font-bold text-[#0B1B3F] tracking-tight tabular-nums flex items-baseline gap-1.5 flex-wrap">
        <span>{value}</span>
      </div>
      {caption && (
        <div className="mt-1 text-xs font-medium text-[#64748B]">
          {caption}
        </div>
      )}
    </div>
  );
}

export interface StatGridProps {
  children: React.ReactNode;
  columns?: 3 | 4 | 5;
  className?: string;
}

export function StatGrid({ children, columns = 5, className = "" }: StatGridProps) {
  const colClass =
    columns === 5
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
      : columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <div
      className={`grid ${colClass} divide-y sm:divide-y-0 sm:divide-x divide-[#EEF2F6] border-y border-[#EEF2F6] ${className}`}
    >
      {children}
    </div>
  );
}

import React from "react";

interface CustomerPageHeaderProps {
  title: string;
  customerName?: string;
  customerId?: string;
  badge?: React.ReactNode;
}

export function CustomerPageHeader({
  title,
  customerName = "R. Kumar",
  customerId = "C-001",
  badge,
}: CustomerPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
      <div>
        <h1 className="text-2xl sm:text-[32px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-[#0B1B3F]">{customerName}</span>
          <span className="text-[#94A3B8]">&bull;</span>
          <span className="text-sm font-medium text-[#64748B] font-mono">{customerId}</span>
        </div>
      </div>

      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  );
}

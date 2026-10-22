import React from "react";

export function LoanLegend() {
  return (
    <div className="flex items-center gap-4 text-xs font-medium text-[#64748B]">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1F6BFF]" aria-hidden="true" />
        <span>Active</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" aria-hidden="true" />
        <span>Pending</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" aria-hidden="true" />
        <span>Overdue</span>
      </div>
    </div>
  );
}

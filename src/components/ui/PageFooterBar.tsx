import React from "react";

interface PageFooterBarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function PageFooterBar({ left, right, className = "" }: PageFooterBarProps) {
  return (
    <div
      className={`sticky bottom-0 md:bottom-0 max-md:bottom-[var(--bottom-nav-h)] left-0 right-0 z-20 bg-white border-t border-[#E6ECF5] px-4 sm:px-6 py-3.5 shadow-sm transition-all ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-sm text-[#64748B] font-medium min-w-0">
          {left}
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {right}
        </div>
      </div>
    </div>
  );
}

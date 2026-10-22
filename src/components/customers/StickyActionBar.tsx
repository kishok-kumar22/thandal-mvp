import React from "react";

interface StickyActionBarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export function StickyActionBar({ left, right, className = "" }: StickyActionBarProps) {
  return (
    <div
      className={`fixed bottom-[var(--bottom-nav-h,64px)] md:bottom-0 left-0 right-0 md:left-[260px] z-20 bg-white border-t border-[#E6ECF5] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-[0_-4px_12px_rgba(11,27,63,0.04)] transition-all ${className}`}
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">{left}</div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">{right}</div>
    </div>
  );
}

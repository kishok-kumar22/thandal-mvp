import React from "react";

interface HighlightPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function HighlightPanel({
  children,
  className = "",
}: HighlightPanelProps) {
  return (
    <div
      className={`bg-[#EAF1FE] rounded-lg p-3.5 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

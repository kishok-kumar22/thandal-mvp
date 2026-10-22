import React from "react";
import { Info, type LucideIcon } from "lucide-react";

interface InfoPanelProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function InfoPanel({
  children,
  icon: Icon = Info,
  className = "",
}: InfoPanelProps) {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 p-3.5 bg-[#E8F0FE] border border-[#C9DBFB] rounded-lg text-xs text-[#1E3A8A] leading-relaxed ${className}`}
    >
      <Icon className="w-4 h-4 text-[#1F6BFF] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 font-medium">{children}</div>
    </div>
  );
}

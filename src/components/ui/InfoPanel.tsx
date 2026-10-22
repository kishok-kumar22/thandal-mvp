import React from "react";
import { Info, AlertTriangle, AlertCircle, CheckCircle2, type LucideIcon } from "lucide-react";

export type InfoPanelVariant = "info" | "warning" | "error" | "success";

interface InfoPanelProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: InfoPanelVariant;
  className?: string;
}

export function InfoPanel({
  children,
  icon,
  variant = "info",
  className = "",
}: InfoPanelProps) {
  let defaultIcon: LucideIcon = Info;
  let colorClasses = "bg-[#E8F0FE] border-[#C9DBFB] text-[#1E3A8A]";
  let iconColor = "text-[#1F6BFF]";

  if (variant === "warning") {
    defaultIcon = AlertTriangle;
    colorClasses = "bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]";
    iconColor = "text-[#D97706]";
  } else if (variant === "error") {
    defaultIcon = AlertCircle;
    colorClasses = "bg-[#FEE2E2] border-[#FECACA] text-[#991B1B]";
    iconColor = "text-[#DC2626]";
  } else if (variant === "success") {
    defaultIcon = CheckCircle2;
    colorClasses = "bg-[#DCFCE7] border-[#BBF7D0] text-[#166534]";
    iconColor = "text-[#16A34A]";
  }

  const IconComponent = icon || defaultIcon;

  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 p-3.5 border rounded-xl text-xs leading-relaxed ${colorClasses} ${className}`}
    >
      <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
      <div className="flex-1 font-medium">{children}</div>
    </div>
  );
}

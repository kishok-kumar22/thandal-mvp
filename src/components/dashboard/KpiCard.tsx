import React from "react";
import { Card } from "@/components/ui/Card";

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "primary" | "danger";
}

export function KpiCard({ label, value, icon, variant = "primary" }: KpiCardProps) {
  const isDanger = variant === "danger";

  return (
    <Card className="p-5 flex items-center gap-4 transition-all hover:border-[#1F6BFF]/30 hover:shadow-md">
      <div
        className={`w-13 h-13 rounded-xl flex items-center justify-center shrink-0 ${
          isDanger ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#EFF6FF] text-[#1F6BFF]"
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-[#64748B] truncate">{label}</span>
        <span
          className={`text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight mt-0.5 ${
            isDanger ? "text-[#E5252A]" : "text-[#0B1B3F]"
          }`}
        >
          {value}
        </span>
      </div>
    </Card>
  );
}

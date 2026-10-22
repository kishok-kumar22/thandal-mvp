import React from "react";

interface SettingsHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function SettingsHeader({ title, subtitle, className = "" }: SettingsHeaderProps) {
  return (
    <div className={`space-y-1 mb-6 ${className}`}>
      <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-[#64748B] font-normal leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

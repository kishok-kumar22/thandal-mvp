import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[12px] border border-[#E6ECF5] shadow-[0_1px_3px_0_rgba(11,27,63,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between pb-4 border-b border-[#E6ECF5]/60 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        {icon && <span className="text-[#1F6BFF]">{icon}</span>}
        <div>
          {title && <h3 className="font-semibold text-[#0B1B3F] text-base">{title}</h3>}
          {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
      {children}
    </div>
  );
}

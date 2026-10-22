import React from "react";
import { SearchX, LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  actionLabel,
  onAction,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#EEF2F7] flex items-center justify-center text-[#64748B] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#0B1B3F] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#64748B] max-w-sm mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {action && action}
    </div>
  );
}

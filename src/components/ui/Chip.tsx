import React from "react";

export type ChipVariant =
  | "solid_active"
  | "active"
  | "inactive"
  | "today_due"
  | "overdue"
  | "pending";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  className?: string;
  dot?: boolean;
}

export function Chip({
  label,
  variant = "active",
  className = "",
  dot = false,
}: ChipProps) {
  let variantStyles = "";

  switch (variant) {
    case "solid_active":
      variantStyles = "bg-[#1F6BFF] text-white rounded-md font-semibold text-xs px-2.5 py-0.5";
      break;

    case "today_due":
      variantStyles =
        "bg-[#FDE7C2] text-[#9A4B00] font-semibold text-xs px-2.5 py-0.5 rounded-md";
      break;

    case "overdue":
      variantStyles =
        "bg-[#FEE2E2] text-[#B91C1C] font-bold text-xs px-2.5 py-0.5 rounded-md";
      break;

    case "pending":
      variantStyles =
        "bg-[#FEF3C7] text-[#B45309] font-medium text-xs px-2.5 py-0.5 rounded-md";
      break;

    case "inactive":
      variantStyles =
        "bg-[#F1F5F9] text-[#475569] font-medium text-xs px-2.5 py-0.5 rounded-md";
      break;

    case "active":
    default:
      variantStyles =
        "bg-[#EFF6FF] text-[#1D4ED8] font-semibold text-xs px-3 py-1 rounded-full border border-[#BFDBFE]";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 select-none ${variantStyles} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            variant === "solid_active"
              ? "bg-white"
              : variant === "overdue"
              ? "bg-[#EF4444]"
              : variant === "today_due" || variant === "pending"
              ? "bg-[#F59E0B]"
              : "bg-[#1F6BFF]"
          }`}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}

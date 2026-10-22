import React from "react";
import { Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export type StatusChipKind =
  | "pending"
  | "overdue"
  | "paid"
  | "partial"
  | "part_paid"
  | "upcoming"
  | "pending_review"
  | "accepted"
  | "rejected"
  | "waiver_pending"
  | "waived"
  | "approved"
  | "active"
  | "inactive";

export type StatusChipSize = "sm" | "md" | "lg";

interface StatusChipProps {
  status: StatusChipKind | string;
  label?: string;
  size?: StatusChipSize;
  className?: string;
}

export function StatusChip({
  status,
  label,
  size = "sm",
  className = "",
}: StatusChipProps) {
  const norm = (status || "").toLowerCase().replace(/\s+/g, "_") as StatusChipKind;

  let bg = "bg-[#F1F5F9]";
  let text = "text-[#475569]";
  let border = "border-[#E2E8F0]";
  let defaultLabel = "Status";
  let icon: React.ReactNode = null;

  switch (norm) {
    case "partial":
    case "part_paid":
      bg = "bg-[#FDE9C8]";
      text = "text-[#B45309]";
      border = "border-[#F5C26B]";
      defaultLabel = "Part paid";
      if (size === "lg") {
        icon = <Clock className="w-4 h-4 text-[#B45309] shrink-0" aria-hidden="true" />;
      }
      break;

    case "pending":
      bg = "bg-[#FEF3C7]";
      text = "text-[#B45309]";
      border = "border-[#FDE68A]";
      defaultLabel = "Pending";
      break;

    case "pending_review":
      bg = "bg-[#FEF3C7]";
      text = "text-[#B45309]";
      border = "border-[#FDE68A]";
      defaultLabel = "Pending review";
      break;

    case "waiver_pending":
      bg = "bg-[#FEF3C7]";
      text = "text-[#B45309]";
      border = "border-[#FDE68A]";
      defaultLabel = "Waiver pending";
      break;

    case "overdue":
      bg = "bg-[#FEE2E2]";
      text = "text-[#B91C1C]";
      border = "border-[#FECACA]";
      defaultLabel = "Overdue";
      break;

    case "paid":
      bg = "bg-[#DBEAFE]";
      text = "text-[#1D4ED8]";
      border = "border-[#BFDBFE]";
      defaultLabel = "Paid";
      break;

    case "accepted":
      bg = "bg-[#DCFCE7]";
      text = "text-[#166534]";
      border = "border-[#BBF7D0]";
      defaultLabel = "Accepted";
      if (size === "lg") {
        icon = <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" aria-hidden="true" />;
      }
      break;

    case "waived":
    case "approved":
      bg = "bg-[#DCFCE7]";
      text = "text-[#15803D]";
      border = "border-[#BBF7D0]";
      defaultLabel = norm === "waived" ? "Waived" : "Approved";
      break;

    case "rejected":
      bg = "bg-[#FEE2E2]";
      text = "text-[#B91C1C]";
      border = "border-[#FECACA]";
      defaultLabel = "Rejected";
      if (size === "lg") {
        icon = <XCircle className="w-4 h-4 text-[#B91C1C] shrink-0" aria-hidden="true" />;
      }
      break;

    case "upcoming":
      bg = "bg-[#EEF2F7]";
      text = "text-[#475569]";
      border = "border-[#CBD5E1]";
      defaultLabel = "Upcoming";
      break;

    case "active":
      bg = "bg-[#EFF6FF]";
      text = "text-[#1D4ED8]";
      border = "border-[#BFDBFE]";
      defaultLabel = "Active";
      break;

    case "inactive":
      bg = "bg-[#F1F5F9]";
      text = "text-[#64748B]";
      border = "border-[#E2E8F0]";
      defaultLabel = "Inactive";
      break;

    default:
      defaultLabel = status;
      break;
  }

  const display = label || defaultLabel;

  // Size styling
  let sizeStyles = "text-xs font-semibold px-2.5 py-0.5 rounded-md";
  if (size === "lg") {
    sizeStyles = "text-sm font-bold px-3.5 py-1.5 rounded-lg";
  } else if (size === "md") {
    sizeStyles = "text-xs font-bold px-3 py-1 rounded-md";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 select-none border ${bg} ${text} ${border} ${sizeStyles} ${className}`}
    >
      {icon}
      <span>{display}</span>
    </span>
  );
}

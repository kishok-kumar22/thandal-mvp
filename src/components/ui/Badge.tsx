import React from "react";
import { CheckCircle2, Clock, Upload, AlertCircle, FileText } from "lucide-react";

export type BadgeVariant =
  | "pending"
  | "pending-review"
  | "verified"
  | "uploaded"
  | "ready"
  | "rejected"
  | "paid"
  | "overdue"
  | "active"
  | "payment"
  | "disbursement"
  | "penalty";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export function Badge({ variant, label, className = "" }: BadgeProps) {
  const configs: Record<
    BadgeVariant,
    { bg: string; text: string; icon: React.ReactNode; defaultLabel: string }
  > = {
    pending: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#B45309]",
      icon: <Clock className="w-3.5 h-3.5" />,
      defaultLabel: "Pending",
    },
    "pending-review": {
      bg: "bg-[#FEF3C7]",
      text: "text-[#B45309]",
      icon: <Clock className="w-3.5 h-3.5" />,
      defaultLabel: "Pending review",
    },
    verified: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#1D4ED8]" />,
      defaultLabel: "Verified",
    },
    uploaded: {
      bg: "bg-[#EEF2F7]",
      text: "text-[#475569]",
      icon: <Upload className="w-3.5 h-3.5 text-[#475569]" />,
      defaultLabel: "Uploaded",
    },
    ready: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      icon: null,
      defaultLabel: "Ready for activation",
    },
    rejected: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      defaultLabel: "Rejected",
    },
    paid: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      icon: null,
      defaultLabel: "Paid",
    },
    overdue: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      icon: null,
      defaultLabel: "Overdue",
    },
    active: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      icon: null,
      defaultLabel: "Active",
    },
    payment: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      icon: null,
      defaultLabel: "Payment",
    },
    disbursement: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#15803D]",
      icon: null,
      defaultLabel: "Disbursement",
    },
    penalty: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      icon: null,
      defaultLabel: "Penalty",
    },
  };

  const current = configs[variant] || configs.pending;
  const displayLabel = label || current.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${current.bg} ${current.text} ${className}`}
    >
      {current.icon}
      <span>{displayLabel}</span>
    </span>
  );
}

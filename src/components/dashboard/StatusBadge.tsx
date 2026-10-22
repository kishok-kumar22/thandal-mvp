import React from "react";
import type { QueueStatus } from "@/data/mock";

interface StatusBadgeProps {
  status: QueueStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<QueueStatus, { bg: string; text: string; dot: string }> = {
    Pending: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#B45309]",
      dot: "bg-[#F59E0B]",
    },
    Paid: {
      bg: "bg-[#DBEAFE]",
      text: "text-[#1D4ED8]",
      dot: "bg-[#1F6BFF]",
    },
    Overdue: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      dot: "bg-[#EF4444]",
    },
  };

  const current = styles[status] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${current.bg} ${current.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
}

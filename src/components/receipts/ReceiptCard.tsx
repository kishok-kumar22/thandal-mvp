import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { Receipt } from "@/data/mockReceipts";
import { formatINR } from "@/lib/format";
import { formatTime12h } from "@/lib/clock";
import { StatusChip } from "@/components/ui/StatusChip";
import { getPublicBusinessInfo } from "@/lib/settings";

interface ReceiptCardProps {
  receipt: Receipt;
  className?: string;
}

export function ReceiptCard({ receipt, className = "" }: ReceiptCardProps) {
  // Format Date (e.g. 22 Oct 2026)
  const dateObj = new Date(receipt.paidAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "22 Oct 2026";

  const formattedTime = formatTime12h(receipt.paidAt);
  const methodLabel =
    receipt.method === "cash"
      ? "Cash"
      : receipt.method === "upi"
      ? "UPI"
      : "Bank transfer";

  return (
    <div
      data-print-area
      className={`bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-xs ${className}`}
    >
      {/* Header Circle & Big Amount */}
      <div className="flex flex-col items-center text-center pb-6">
        <div
          className="w-16 h-16 rounded-full bg-[#1F6BFF] text-white flex items-center justify-center shadow-sm mb-4"
          aria-hidden="true"
        >
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <h2 className="text-2xl sm:text-[32px] font-bold text-[#0B1B3F] tracking-tight">
          Payment recorded
        </h2>

        <div className="text-3xl sm:text-4xl font-extrabold text-[#1F6BFF] tabular-nums mt-1.5">
          {formatINR(receipt.amount)}
        </div>
      </div>

      {/* Section 1: Transaction Meta */}
      <div className="border-t border-[#EEF2F6] py-4">
        <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
          <dt className="text-[#64748B] font-medium">Receipt</dt>
          <dd className="text-right font-semibold text-[#0B1B3F] font-mono">
            {receipt.receiptNo}
          </dd>

          <dt className="text-[#64748B] font-medium">Date</dt>
          <dd className="text-right font-semibold text-[#0B1B3F]">
            {formattedDate}
          </dd>

          <dt className="text-[#64748B] font-medium">Time</dt>
          <dd className="text-right font-semibold text-[#0B1B3F]">
            {formattedTime}
          </dd>
        </dl>
      </div>

      {/* Section 2: Parties & Method */}
      <div className="border-t border-[#EEF2F6] py-4">
        <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
          <dt className="text-[#64748B] font-medium">Customer</dt>
          <dd className="text-right font-semibold text-[#0B1B3F] truncate">
            {receipt.customerName || receipt.customerId}
          </dd>

          <dt className="text-[#64748B] font-medium">Loan</dt>
          <dd className="text-right font-semibold text-[#0B1B3F] font-mono">
            {receipt.loanId}
          </dd>

          <dt className="text-[#64748B] font-medium">Agent</dt>
          <dd className="text-right font-semibold text-[#0B1B3F]">
            {receipt.agentName || "Selvam"}
          </dd>

          <dt className="text-[#64748B] font-medium">Payment method</dt>
          <dd className="text-right font-semibold text-[#0B1B3F]">
            {methodLabel}
          </dd>

          {receipt.reference && (
            <>
              <dt className="text-[#64748B] font-medium">Reference</dt>
              <dd className="text-right font-semibold text-[#0B1B3F] font-mono text-xs">
                {receipt.reference}
              </dd>
            </>
          )}
        </dl>
      </div>

      {/* Section 3: Financial Balances & Allocation */}
      <div className="border-t border-[#EEF2F6] pt-4">
        <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
          <dt className="text-[#64748B] font-medium">Scheduled instalment</dt>
          <dd className="text-right font-semibold text-[#0B1B3F] tabular-nums">
            {formatINR(receipt.scheduledDue)}
          </dd>

          {receipt.allocation.toPenalty > 0 && (
            <>
              <dt className="text-[#64748B] font-medium">Penalty cleared</dt>
              <dd className="text-right font-semibold text-[#B91C1C] tabular-nums">
                {formatINR(receipt.allocation.toPenalty)}
              </dd>
            </>
          )}

          {receipt.allocation.toArrears > 0 && (
            <>
              <dt className="text-[#64748B] font-medium">Arrears cleared</dt>
              <dd className="text-right font-semibold text-[#B45309] tabular-nums">
                {formatINR(receipt.allocation.toArrears)}
              </dd>
            </>
          )}

          <dt className="text-[#64748B] font-medium">Received</dt>
          <dd className="text-right font-bold text-[#0B1B3F] tabular-nums">
            {formatINR(receipt.amount)}
          </dd>

          <dt className="text-[#64748B] font-medium">Remaining instalment</dt>
          <dd className="text-right font-semibold text-[#0B1B3F] tabular-nums">
            {formatINR(receipt.remainingBalance)}
          </dd>

          <dt className="text-[#64748B] font-medium pt-1">Status</dt>
          <dd className="text-right pt-1 flex justify-end">
            <StatusChip
              status={receipt.status}
              size="lg"
            />
          </dd>
        </dl>
      </div>

      {/* Dynamic Receipt Footer Note */}
      <div className="border-t border-[#EEF2F6] pt-4 mt-2 text-center">
        <p className="text-xs text-[#64748B] font-medium leading-relaxed">
          {getPublicBusinessInfo().receiptFooter || "Thank you for prompt repayment. Retain this digital receipt for your records."}
        </p>
      </div>
    </div>
  );
}

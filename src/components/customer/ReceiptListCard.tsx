import React from "react";
import Link from "next/link";
import { Eye, Download } from "lucide-react";
import type { CustomerReceiptSummary } from "@/lib/customerPortal";
import { StatusChip } from "@/components/ui/StatusChip";
import { formatINR } from "@/lib/format";

interface ReceiptListCardProps {
  receipt: CustomerReceiptSummary;
}

export function ReceiptListCard({ receipt }: ReceiptListCardProps) {
  const isPartial = receipt.status === "partial";
  const chipStatus = isPartial ? "partial" : "recorded";

  return (
    <article
      aria-label={`Receipt ${receipt.receiptNo}, ${formatINR(receipt.amount)}, ${receipt.paidDateFormatted}`}
      className="bg-white rounded-2xl border border-[#E6ECF5] shadow-xs p-5 flex flex-col justify-between space-y-4 hover:border-[#CBD5E1] transition-all"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EEF2F6] pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0B1B3F] tracking-tight">
          Receipt {receipt.receiptNo}
        </h2>
        <StatusChip status={chipStatus} detailed />
      </div>

      {/* 2x2 Info Grid with Dividing Hairlines */}
      <div className="grid grid-cols-2 divide-x divide-[#EEF2F6] border-b border-[#EEF2F6] pb-4 text-left">
        {/* Left Column */}
        <div className="pr-3 space-y-3">
          <div>
            <span className="text-xs font-medium text-[#64748B] block">Amount</span>
            <span className="text-lg sm:text-xl font-bold text-[#0B1B3F] tabular-nums block mt-0.5">
              {formatINR(receipt.amount)}
            </span>
          </div>

          <div className="pt-2 border-t border-[#EEF2F6]">
            <span className="text-xs font-medium text-[#64748B] block">Payment type</span>
            <span className="text-sm font-semibold text-[#0B1B3F] block mt-0.5 truncate">
              {receipt.paymentTypeLabel}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="pl-3 space-y-3">
          <div>
            <span className="text-xs font-medium text-[#64748B] block">Date</span>
            <span className="text-sm font-semibold text-[#0B1B3F] block mt-1">
              {receipt.paidDateFormatted}
            </span>
          </div>

          <div className="pt-2 border-t border-[#EEF2F6]">
            <span className="text-xs font-medium text-[#64748B] block">Loan</span>
            <Link
              href={`/customer/schedule?loan=${receipt.loanId}`}
              className="text-sm font-bold text-[#1F6BFF] hover:underline block mt-0.5"
            >
              {receipt.loanId}
            </Link>
          </div>
        </div>
      </div>

      {/* Two Equal-Width Actions Row (48px tall) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Link
          href={`/customer/receipts/${receipt.receiptNo}`}
          aria-label={`View receipt ${receipt.receiptNo}`}
          className="h-12 rounded-xl border border-[#1F6BFF] text-[#1F6BFF] hover:bg-[#EFF6FF] flex items-center justify-center gap-2 text-sm font-semibold transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 shrink-0" />
          <span>View receipt</span>
        </Link>

        <Link
          href={`/customer/receipts/${receipt.receiptNo}?print=1`}
          aria-label={`Download receipt ${receipt.receiptNo}`}
          className="h-12 rounded-xl bg-[#1F6BFF] hover:bg-[#1A5BD8] text-white flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>Download</span>
        </Link>
      </div>
    </article>
  );
}

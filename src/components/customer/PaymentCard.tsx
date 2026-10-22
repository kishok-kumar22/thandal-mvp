import React from "react";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import type { CustomerPaymentRow } from "@/lib/customerPortal";
import { formatINR } from "@/lib/format";

interface PaymentCardProps {
  payment: CustomerPaymentRow;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-sm text-[#0B1B3F]">{payment.receiptNo}</span>
        <span className="font-extrabold text-base text-[#0B1B3F] tabular-nums">
          {formatINR(payment.amount)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#EEF2F6]">
        <div>
          <span className="text-[#64748B] block">Payment Date</span>
          <span className="font-medium text-[#0B1B3F]">{payment.paymentDate}</span>
        </div>
        <div>
          <span className="text-[#64748B] block">Type</span>
          <span className="font-medium text-[#0B1B3F]">{payment.type}</span>
        </div>
      </div>

      <div className="text-xs text-[#64748B] pt-1">
        <span className="font-medium block text-[#334155]">{payment.remarks}</span>
      </div>

      <div className="pt-2 border-t border-[#EEF2F6] flex justify-end">
        <Link
          href={`/customer/receipts/${payment.receiptNo}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View receipt</span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FileText, ArrowRight } from "lucide-react";
import type { CustomerPaymentRow } from "@/lib/customerPortal";
import { PaymentCard } from "./PaymentCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatINR } from "@/lib/format";

interface PaymentsTableProps {
  payments: CustomerPaymentRow[];
  totalPayments: number;
  currentPage?: number;
  pageSize?: number;
  isRecentPreview?: boolean;
  loanId?: string;
}

export function PaymentsTable({
  payments,
  totalPayments,
  currentPage = 1,
  pageSize = 10,
  isRecentPreview = false,
  loanId,
}: PaymentsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalPayments / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalPayments);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments yet"
        description="Recorded payments and disbursement deductions will appear here."
        icon={FileText}
        className="bg-white py-10 border border-[#E6ECF5]"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-3">
        {payments.map((p) => (
          <PaymentCard key={p.receiptNo} payment={p} />
        ))}
      </div>

      {/* Desktop Responsive Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#E6ECF5]">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
              <th scope="col" className="py-3 px-4">Receipt no.</th>
              <th scope="col" className="py-3 px-4">Amount (₹)</th>
              <th scope="col" className="py-3 px-4">Payment date</th>
              <th scope="col" className="py-3 px-4">Type</th>
              <th scope="col" className="py-3 px-4">Remarks</th>
              <th scope="col" className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EEF2F6] text-sm text-[#0B1B3F] bg-white">
            {payments.map((p) => (
              <tr key={p.receiptNo} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#0B1B3F]">
                  {p.receiptNo}
                </td>
                <td className="py-3.5 px-4 font-bold text-[#0B1B3F] tabular-nums">
                  {formatINR(p.amount)}
                </td>
                <td className="py-3.5 px-4 text-[#334155] whitespace-nowrap">
                  {p.paymentDate}
                </td>
                <td className="py-3.5 px-4 text-[#334155] whitespace-nowrap">
                  {p.type}
                </td>
                <td className="py-3.5 px-4 text-[#64748B] text-xs">
                  {p.remarks}
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/customer/receipts/${p.receiptNo}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View receipt</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer controls: either preview link to full history, or pagination */}
      {isRecentPreview ? (
        totalPayments > payments.length && loanId && (
          <div className="pt-2 flex justify-end">
            <Link
              href={`/customer/payments?loan=${loanId}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F6BFF] hover:underline"
            >
              <span>View all payments ({totalPayments})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 px-1">
          <span className="text-xs text-[#64748B] font-medium">
            Showing {totalPayments > 0 ? `${startItem}-${endItem}` : "0"} of {totalPayments}
          </span>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}

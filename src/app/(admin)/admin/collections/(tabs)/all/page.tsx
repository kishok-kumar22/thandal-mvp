import React from "react";
import Link from "next/link";
import { mockReceiptsList } from "@/data/mockReceipts";
import { formatNumberIN, formatINR } from "@/lib/format";
import { formatTime12h } from "@/lib/clock";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    agent?: string;
  }>;
}

export default async function CollectionsAllPaymentsPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const q = (resolved.q || "").trim().toLowerCase();
  const agentId = resolved.agent;

  let receipts = [...mockReceiptsList];

  if (agentId && agentId !== "all") {
    receipts = receipts.filter((r) => r.agentId === agentId);
  }

  if (q) {
    receipts = receipts.filter((r) => {
      const matchCust = r.customerName?.toLowerCase().includes(q) || r.customerId.toLowerCase().includes(q);
      const matchLoan = r.loanId.toLowerCase().includes(q);
      const matchReceipt = r.receiptNo.toLowerCase().includes(q);
      return matchCust || matchLoan || matchReceipt;
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#EEF2F6]">
          <h3 className="text-lg font-bold text-[#0B1B3F]">
            All payment receipts ({receipts.length})
          </h3>
        </div>

        {receipts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No payments found"
              description="No receipts matched your search filters."
              actionLabel="Clear search"
              onAction={() => {}}
            />
          </div>
        ) : (
          <div className="overflow-x-auto min-w-[760px]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-b border-[#E6ECF5]">
                  <th scope="col" className="py-3 px-4">Receipt no.</th>
                  <th scope="col" className="py-3 px-4">Date &amp; Time</th>
                  <th scope="col" className="py-3 px-4">Customer</th>
                  <th scope="col" className="py-3 px-4">Loan No.</th>
                  <th scope="col" className="py-3 px-4 text-right">Amount (₹)</th>
                  <th scope="col" className="py-3 px-4">Method</th>
                  <th scope="col" className="py-3 px-4">Collected by</th>
                  <th scope="col" className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF5]">
                {receipts.map((r) => {
                  const dateObj = new Date(r.paidAt);
                  const dateStr = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "22 Oct 2026";

                  const timeStr = formatTime12h(r.paidAt);

                  return (
                    <tr key={r.receiptNo} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1F6BFF]">
                        <Link href={`/admin/receipts/${r.receiptNo}`} className="hover:underline">
                          {r.receiptNo}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-[#334155] font-medium">
                        {dateStr}, {timeStr}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#0B1B3F]">
                        {r.customerName || r.customerId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#64748B]">
                        {r.loanId}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#0B1B3F] tabular-nums">
                        {formatNumberIN(r.amount)}
                      </td>
                      <td className="py-3.5 px-4 capitalize font-medium text-[#334155]">
                        {r.method.replace("_", " ")}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] font-medium">
                        {r.collectedBy}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/admin/receipts/${r.receiptNo}`}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold text-[#1F6BFF] border-[#BFDBFE] hover:bg-[#F3F7FF] px-4"
                          >
                            Receipt
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

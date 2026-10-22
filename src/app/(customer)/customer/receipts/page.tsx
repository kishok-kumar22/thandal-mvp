import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, FileText } from "lucide-react";
import { requireRole } from "@/lib/session";
import { mockReceiptsList } from "@/data/mockReceipts";
import { formatINR } from "@/lib/format";

export const metadata = {
  title: "My Receipts | THANDAL",
  description: "View and download official digital receipts for your repayments.",
};

export default async function CustomerReceiptsPage() {
  const user = await requireRole("customer", "/customer/receipts");
  const customerId = user.customerId || "C-001";

  // Filter own receipts only
  const ownReceipts = mockReceiptsList.filter((r) => r.customerId === customerId);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <Link
          href="/customer/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to home</span>
        </Link>
        <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
          Payment receipts
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Official receipts for all repayments recorded on your account.
        </p>
      </div>

      {ownReceipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-2xl border border-[#E6ECF5] text-center shadow-sm">
          <FileText className="w-10 h-10 text-[#94A3B8] mb-3" aria-hidden="true" />
          <h3 className="text-lg font-bold text-[#0B1B3F]">No receipts yet</h3>
          <p className="text-xs text-[#64748B] mt-1">
            Receipts will automatically appear here once payments are collected by your agent.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="My receipts">
              <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
                <tr>
                  <th scope="col" className="py-3.5 px-4">
                    Receipt no
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Date
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Amount
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF5]">
                {ownReceipts.map((rc) => (
                  <tr key={rc.receiptNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F6BFF] whitespace-nowrap">
                      {rc.receiptNo}
                    </td>
                    <td className="py-3.5 px-4 text-[#334155] whitespace-nowrap">
                      {rc.paidAt.slice(0, 10)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0B1B3F]">
                      {formatINR(rc.amount)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          rc.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {rc.status === "paid" ? "Paid" : "Partial"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/customer/receipts/${rc.receiptNo}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1F6BFF] hover:underline"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

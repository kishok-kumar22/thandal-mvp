import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMockLoans } from "@/data/mockLoans";
import { buildSchedule } from "@/lib/loan";
import { formatINR } from "@/lib/format";
import { AccessDenied } from "@/components/ui/AccessDenied";

export const metadata = {
  title: "Repayment Schedule | THANDAL",
  description: "View schedule dates and payment status for your active loan.",
};

export default async function CustomerSchedulePage() {
  const user = await requireRole("customer", "/customer/schedule");
  const customerId = user.customerId || "C-001";

  const customerLoans = getMockLoans().filter((l) => l.customerId === customerId);
  const activeLoan = customerLoans.find((l) => l.status === "active") || customerLoans[0];

  if (!activeLoan) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-[#0B1B3F]">Repayment schedule</h1>
        <p className="text-sm text-[#64748B]">You have no active loans registered.</p>
      </div>
    );
  }

  // Security check: customer can only view their own loan
  if (activeLoan.customerId !== customerId) {
    return (
      <AccessDenied
        message="Access Denied"
        description="You do not have permission to view repayment schedules for other borrowers."
        backHref="/customer/home"
      />
    );
  }

  const schedule = buildSchedule({
    principal: activeLoan.principal,
    ratePercent: activeLoan.interest > 0 ? Math.round((activeLoan.interest / activeLoan.principal) * 100) : 5,
    term: activeLoan.term,
    frequency: activeLoan.frequency,
    firstDueDate: activeLoan.firstDueDate,
    collectFirstAtDisbursement: true,
    scheduleDates: activeLoan.scheduleDates,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/customer/home"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Repayment schedule
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Schedule for Loan <span className="font-bold text-[#0B1B3F]">{activeLoan.id}</span> ({activeLoan.frequency} collections)
          </p>
        </div>

        <div className="p-3 bg-white border border-[#E6ECF5] rounded-xl text-xs space-y-1 self-start sm:self-auto shadow-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#64748B]">Principal:</span>
            <span className="font-bold text-[#0B1B3F]">{formatINR(activeLoan.principal)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#64748B]">Remaining:</span>
            <span className="font-bold text-[#1F6BFF]">{formatINR(activeLoan.remaining)}</span>
          </div>
        </div>
      </div>

      {/* Read-Only Schedule Table */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Repayment schedule">
            <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
              <tr>
                <th scope="col" className="py-3 px-4">
                  #
                </th>
                <th scope="col" className="py-3 px-4">
                  Due date
                </th>
                <th scope="col" className="py-3 px-4">
                  Amount
                </th>
                <th scope="col" className="py-3 px-4">
                  Status
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {schedule.map((item) => {
                const isPaid = item.status === "Paid" || item.status === "Paid at disbursement";

                return (
                  <tr key={item.instalmentNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#64748B]">
                      {item.instalmentNumber}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#0B1B3F] whitespace-nowrap">
                      {item.dueDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0B1B3F]">
                      {formatINR(item.amount)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-[#64748B]">
                      {item.remarks || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

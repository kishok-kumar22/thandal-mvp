import React from "react";
import { FileText } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMyLoans, getMyLoan, type CustomerPaymentRow } from "@/lib/customerPortal";
import { LoanScheduleShell } from "@/components/customer/LoanScheduleShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicBusinessInfo } from "@/lib/settings";

export const metadata = {
  title: "Repayment Schedule | THANDAL",
  description: "View scheduled instalments and payment history for your loan.",
};

export const instant = false;

interface SchedulePageProps {
  searchParams?: Promise<{
    loan?: string;
    page?: string;
  }>;
}

export default async function CustomerSchedulePage(props: SchedulePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const user = await requireRole("customer", "/customer/schedule");

  const allLoans = await getMyLoans(user);
  if (allLoans.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <EmptyState
          title="No loans yet"
          description="Your repayment schedule will appear here once your loan is disbursed."
          icon={FileText}
          className="bg-white p-12 border border-[#E6ECF5]"
        />
      </div>
    );
  }

  // Resolve target loan: either requested by query or default to active loan
  const targetLoanId = searchParams.loan
    ? searchParams.loan
    : (allLoans.find((l) => ["active", "overdue"].includes(l.status))?.id || allLoans[0].id);

  const { loan, scheduleRows, receipts } = await getMyLoan(user, targetLoanId);

  // Compute default page: opens on the page containing the nextDue instalment
  let currentPage = 1;
  if (searchParams.page) {
    currentPage = Math.max(1, parseInt(searchParams.page, 10) || 1);
  } else {
    const firstUnpaidIndex = scheduleRows.findIndex((r) => r.paidAmount < r.dueAmount);
    if (firstUnpaidIndex >= 0) {
      currentPage = Math.floor(firstUnpaidIndex / 10) + 1;
    }
  }

  const payments: CustomerPaymentRow[] = receipts.map((r) => ({
    receiptNo: r.receiptNo,
    amount: r.amount,
    paymentDate: r.paidDateFormatted,
    type: r.paymentTypeLabel,
    remarks: r.remark,
  }));

  const publicInfo = getPublicBusinessInfo();

  return (
    <LoanScheduleShell
      currentLoan={loan}
      allLoans={allLoans}
      scheduleRows={scheduleRows}
      payments={payments}
      tab="schedule"
      currentPage={currentPage}
      businessPhone={publicInfo.phone}
    />
  );
}

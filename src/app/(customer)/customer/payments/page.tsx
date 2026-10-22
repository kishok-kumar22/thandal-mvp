import React from "react";
import { FileText } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMyLoans, getMyLoan, type CustomerPaymentRow } from "@/lib/customerPortal";
import { LoanScheduleShell } from "@/components/customer/LoanScheduleShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { getPublicBusinessInfo } from "@/lib/settings";

export const metadata = {
  title: "Payment History | THANDAL",
  description: "View all recorded instalment payments and receipts for your loan.",
};

export const instant = false;

interface PaymentsPageProps {
  searchParams?: Promise<{
    loan?: string;
    page?: string;
  }>;
}

export default async function CustomerPaymentsPage(props: PaymentsPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const user = await requireRole("customer", "/customer/payments");

  const allLoans = await getMyLoans(user);
  if (allLoans.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <EmptyState
          title="No loans yet"
          description="Your payment history will appear here once your loan is disbursed."
          icon={FileText}
          className="bg-white p-12 border border-[#E6ECF5]"
        />
      </div>
    );
  }

  const targetLoanId = searchParams.loan
    ? searchParams.loan
    : (allLoans.find((l) => ["active", "overdue"].includes(l.status))?.id || allLoans[0].id);

  const { loan, scheduleRows, receipts } = await getMyLoan(user, targetLoanId);

  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

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
      tab="payments"
      currentPage={currentPage}
      businessPhone={publicInfo.phone}
    />
  );
}

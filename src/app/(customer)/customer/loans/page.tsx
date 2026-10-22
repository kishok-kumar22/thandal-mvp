import React from "react";
import { FileText } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getMyLoans } from "@/lib/customerPortal";
import { LoanCard } from "@/components/customer/LoanCard";
import { ClosedLoansCard } from "@/components/customer/ClosedLoansCard";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = {
  title: "My Loans | THANDAL",
  description: "View and manage your active and past loans with THANDAL.",
};

export default async function CustomerLoansPage() {
  const user = await requireRole("customer", "/customer/loans");
  const allLoans = await getMyLoans(user);

  const activeLoans = allLoans.filter((l) => ["active", "overdue"].includes(l.status));
  const closedLoans = allLoans.filter((l) => ["completed", "closed"].includes(l.status));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight">
          My loans
        </h1>
        <p className="text-sm font-medium text-[#64748B] mt-1">
          Review your current loan agreement, repayment progress, and past completed loans.
        </p>
      </div>

      {allLoans.length === 0 ? (
        <EmptyState
          title="No loans yet"
          description="Your loans will appear here once they are disbursed."
          icon={FileText}
          className="bg-white p-12 border border-[#E6ECF5] shadow-xs"
        />
      ) : (
        <div className="space-y-8">
          {/* Active / Overdue Loans */}
          {activeLoans.length > 0 ? (
            <div className="space-y-6">
              {activeLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 text-center text-sm font-medium text-[#64748B]">
              You have no active loans right now.
            </div>
          )}

          {/* Closed Loans Section */}
          <ClosedLoansCard closedLoans={closedLoans} />
        </div>
      )}
    </div>
  );
}

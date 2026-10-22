import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { mockLoansList, getLoanById } from "@/data/mockLoans";
import { mockCollectionTasks } from "@/data/mockCollections";
import { RecordPaymentForm } from "@/components/payments/RecordPaymentForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ loanId: string }>;
}

export function generateStaticParams() {
  return mockLoansList.map((l) => ({ loanId: l.id }));
}

export default async function AdminRecordPaymentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const loanId = resolvedParams.loanId.trim().toUpperCase();

  const loan = getLoanById(loanId);
  if (!loan) {
    notFound();
  }

  const task = mockCollectionTasks.find((t) => t.loanId.toUpperCase() === loanId);
  const scheduledDue = task ? task.amountDue : loan.instalment;
  const arrears = task ? task.arrears : 0;
  const penalty = task ? task.penalty : 0;
  const totalDue = scheduledDue + arrears + penalty;

  if (loan.status === "completed" || loan.status === "closed" || totalDue <= 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <EmptyState
          title="No payment due for this loan"
          description={`Loan ${loan.id} has no outstanding instalments or late fees pending.`}
          actionLabel="Back to collections"
          onAction={() => {}}
        />
        <div className="mt-4 text-center">
          <Link href="/admin/collections">
            <Button variant="primary" size="md">
              Back to collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <RecordPaymentForm role="admin" loan={loan} task={task} />;
}

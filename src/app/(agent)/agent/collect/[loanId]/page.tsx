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

export default async function AgentRecordPaymentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const loanId = resolvedParams.loanId.trim().toUpperCase();

  const loan = getLoanById(loanId);
  if (!loan) {
    notFound();
  }

  // Security check: Verify loan belongs to Agent Selvam's assigned routes / tasks
  const task = mockCollectionTasks.find((t) => t.loanId.toUpperCase() === loanId);
  const isAssignedToAgent = task?.agentId === "A-001" || loan.agent === "Selvam";

  if (!isAssignedToAgent) {
    notFound();
  }

  const scheduledDue = task ? task.amountDue : loan.instalment;
  const arrears = task ? task.arrears : 0;
  const penalty = task ? task.penalty : 0;
  const totalDue = scheduledDue + arrears + penalty;

  if (loan.status === "completed" || loan.status === "closed" || totalDue <= 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <EmptyState
          title="No payment due for this loan"
          description={`Customer has no pending dues for loan ${loan.id}.`}
          actionLabel="Back to customers"
          onAction={() => {}}
        />
        <div className="mt-4 text-center">
          <Link href="/agent/customers">
            <Button variant="primary" size="md">
              Back to customers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <RecordPaymentForm role="agent" loan={loan} task={task} />;
}

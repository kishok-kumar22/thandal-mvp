import React from "react";
import Link from "next/link";
import { StatusChip } from "@/components/ui/StatusChip";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";
import type { AgentTaskView } from "@/lib/collections";

interface CustomerTaskCardProps {
  task: AgentTaskView;
  onViewReceipt: (task: AgentTaskView) => void;
}

export function CustomerTaskCard({
  task,
  onViewReceipt,
}: CustomerTaskCardProps) {
  const isPaid = task.state === "due_today_paid";
  const isOverdue = task.state === "overdue";
  const isPartial = task.state === "due_today_partial";

  const ariaDescription = `${task.customerName}, ${
    isOverdue ? "overdue" : isPartial ? "part paid" : "today due"
  }, ${formatINR(task.totalPayable)}, ${
    isPaid ? "paid" : isPartial ? "part paid" : "pending"
  }`;

  return (
    <article
      aria-label={ariaDescription}
      className="bg-white rounded-2xl border border-[#E6ECF5] p-5 shadow-xs flex flex-col justify-between transition-all hover:border-[#CBD5E1]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Zone 1: Name Block */}
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight leading-tight truncate">
            {task.customerName}
          </h2>
          <p className="text-sm font-medium text-[#64748B] font-mono mt-1">
            {task.customerId} &nbsp;|&nbsp; {task.loanId}
          </p>
        </div>

        {/* Zone 2: Amount Block */}
        <div className="flex flex-col sm:items-end justify-center min-w-[130px]">
          {isOverdue ? (
            <div className="space-y-1 w-full sm:w-auto">
              <StatusChip status="overdue" />
              <div className="text-xs text-[#64748B] pt-1">
                <div className="flex justify-between sm:justify-end gap-3">
                  <span>Arrears</span>
                  <span className="font-semibold text-[#0B1B3F] tabular-nums">
                    {formatINR(task.arrears)}
                  </span>
                </div>
                <div className="flex justify-between sm:justify-end gap-3">
                  <span>Penalty</span>
                  <span className="font-semibold text-[#0B1B3F] tabular-nums">
                    {formatINR(task.penalty)}
                  </span>
                </div>
                <div className="border-t border-[#CBD5E1] pt-1 mt-1 flex justify-between sm:justify-end gap-3">
                  <span className="font-bold text-[#0B1B3F]">Total</span>
                  <span className="font-extrabold text-[#0B1B3F] tabular-nums text-base">
                    {formatINR(task.totalPayable)}
                  </span>
                </div>
              </div>
            </div>
          ) : isPartial ? (
            <div className="space-y-1">
              <StatusChip status="partial" />
              <div className="text-2xl font-bold text-[#0B1B3F] tabular-nums mt-1">
                {formatINR(task.amountToCollect)}
              </div>
              <div className="text-xs font-semibold text-[#B45309]">
                Remaining balance
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <StatusChip status={isPaid ? "paid" : "pending"} label={isPaid ? "Paid" : "Today due"} />
              <div className="text-2xl font-bold text-[#0B1B3F] tabular-nums mt-1">
                {formatINR(task.amountToCollect || task.totalPayable)}
              </div>
              <div className="text-xs font-semibold text-[#64748B]">
                {isPaid ? "Paid" : "Pending"}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Action Block */}
        <div className="pt-2 sm:pt-0 shrink-0">
          {isPaid ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              aria-label={`View receipt for ${task.customerName}`}
              onClick={() => onViewReceipt(task)}
              className="w-full sm:w-auto min-h-[44px] px-6 text-sm font-semibold"
            >
              View receipt
            </Button>
          ) : (
            <Link href={`/agent/collect/${task.loanId}`} className="block">
              <Button
                type="button"
                variant="primary"
                size="md"
                aria-label={`Collect from ${task.customerName}`}
                className="w-full sm:w-auto min-h-[44px] px-8 text-sm font-semibold shadow-xs"
              >
                Collect
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

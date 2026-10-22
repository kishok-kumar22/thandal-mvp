"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatNumberIN, formatINR } from "@/lib/format";
import { StatusChip } from "@/components/ui/StatusChip";
import { Button } from "@/components/ui/Button";
import { PageFooterBar } from "@/components/ui/PageFooterBar";
import { BulkCollectModal } from "./BulkCollectModal";
import { ReceiptModal } from "@/components/agent-portal/ReceiptModal";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CollectionRowView, CollectionSummary } from "@/lib/collections";
import { CollectionStatCards } from "./CollectionStatCards";

interface CollectionsBoardProps {
  initialTasks: CollectionRowView[];
  initialSummary: CollectionSummary;
}

export function CollectionsBoard({
  initialTasks,
  initialSummary,
}: CollectionsBoardProps) {
  const [tasks, setTasks] = useState<CollectionRowView[]>(initialTasks);
  const [summary, setSummary] = useState<CollectionSummary>(initialSummary);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [viewingReceiptTaskId, setViewingReceiptTaskId] = useState<string | null>(null);

  // Unpaid tasks eligible for collection
  const unpaidTasks = tasks.filter((t) => t.status !== "paid");
  const isAllUnpaidSelected =
    unpaidTasks.length > 0 &&
    unpaidTasks.every((t) => selectedIds.includes(t.id));

  const isSomeSelected =
    selectedIds.length > 0 && !isAllUnpaidSelected;

  const handleSelectAll = () => {
    if (isAllUnpaidSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unpaidTasks.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkSuccess = (updatedIds: string[]) => {
    const updated = tasks.map((t) => {
      if (updatedIds.includes(t.id)) {
        return {
          ...t,
          status: "paid" as const,
          amountToCollect: 0,
        };
      }
      return t;
    });

    setTasks(updated);
    setSelectedIds([]);

    // Update summary received
    const newlyCollected = updatedIds.reduce((sum, id) => {
      const match = tasks.find((t) => t.id === id);
      return sum + (match?.amountToCollect || 0);
    }, 0);

    setSummary((prev) => ({
      ...prev,
      receivedToday: prev.receivedToday + newlyCollected,
      remainingToday: Math.max(0, prev.remainingToday - newlyCollected),
    }));
  };

  const selectedTasksList = tasks.filter((t) => selectedIds.includes(t.id));
  const activeViewingTask = tasks.find((t) => t.id === viewingReceiptTaskId) || null;

  return (
    <div className="space-y-6">
      {/* 3 Stat Cards */}
      <CollectionStatCards summary={summary} />

      {/* Main Table Card */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E6ECF5] p-8 shadow-xs">
          <EmptyState
            title="No collections found"
            description="Try a different search query or clear the agent filter to see more collection tasks."
            actionLabel="Clear filters"
            onAction={() => {}}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
          {/* Desktop Table (>=768px) */}
          <div className="hidden md:block overflow-x-auto min-w-[980px]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold border-b border-[#E6ECF5]">
                  <th scope="col" className="py-3.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all unpaid collections"
                      checked={isAllUnpaidSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#D9E1EC] text-[#1F6BFF] focus:ring-[#1F6BFF] cursor-pointer"
                    />
                  </th>
                  <th scope="col" className="py-3.5 px-4">Customer</th>
                  <th scope="col" className="py-3.5 px-4">Loan No.</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Scheduled (₹)</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Arrears (₹)</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Penalty (₹)</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Amount to collect (₹)</th>
                  <th scope="col" className="py-3.5 px-4">Status</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF5]">
                {tasks.map((task) => {
                  const isPaid = task.status === "paid";
                  const isChecked = selectedIds.includes(task.id);

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isChecked ? "bg-[#F3F7FF]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          disabled={isPaid}
                          checked={isChecked}
                          onChange={() => handleToggleSelect(task.id)}
                          aria-label={`Select collection for ${task.customerName}`}
                          className="w-4 h-4 rounded border-[#D9E1EC] text-[#1F6BFF] focus:ring-[#1F6BFF] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/customers/${task.customerId}`}
                          className="font-semibold text-[#0B1B3F] hover:text-[#1F6BFF] transition-colors"
                        >
                          {task.customerName}
                        </Link>
                      </td>

                      {/* Loan No. */}
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/loans/${task.loanId}`}
                          className="font-mono text-xs font-semibold text-[#64748B] hover:text-[#1F6BFF] transition-colors"
                        >
                          {task.loanId}
                        </Link>
                      </td>

                      {/* Scheduled */}
                      <td className="py-3.5 px-4 text-right font-medium text-[#0B1B3F] tabular-nums">
                        {formatNumberIN(task.scheduled)}
                      </td>

                      {/* Arrears */}
                      <td className="py-3.5 px-4 text-right font-medium tabular-nums text-[#0B1B3F]">
                        {formatNumberIN(task.arrears)}
                      </td>

                      {/* Penalty */}
                      <td className="py-3.5 px-4 text-right font-medium tabular-nums text-[#0B1B3F]">
                        {formatNumberIN(task.penalty)}
                      </td>

                      {/* Amount to collect */}
                      <td className="py-3.5 px-4 text-right font-bold text-[#1F6BFF] tabular-nums text-base">
                        {task.amountToCollect > 0 ? formatNumberIN(task.amountToCollect) : "0"}
                      </td>

                      {/* Status Chip */}
                      <td className="py-3.5 px-4">
                        <StatusChip status={task.status} />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isPaid ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            aria-label={`View receipt for ${task.customerName}`}
                            onClick={() => setViewingReceiptTaskId(task.id)}
                            className="text-xs font-semibold text-[#1F6BFF] border-[#BFDBFE] hover:bg-[#F3F7FF] px-4"
                          >
                            Receipt
                          </Button>
                        ) : (
                          <Link href={`/admin/collections/pay/${task.loanId}`}>
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              aria-label={`Collect from ${task.customerName}`}
                              className="text-xs font-semibold px-5 shadow-xs"
                            >
                              Collect
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards (<768px) */}
          <div className="md:hidden divide-y divide-[#EEF2F6]">
            {tasks.map((task) => {
              const isPaid = task.status === "paid";
              const isChecked = selectedIds.includes(task.id);

              return (
                <div
                  key={task.id}
                  className={`p-4 space-y-3 transition-colors ${
                    isChecked ? "bg-[#F3F7FF]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        disabled={isPaid}
                        checked={isChecked}
                        onChange={() => handleToggleSelect(task.id)}
                        aria-label={`Select collection for ${task.customerName}`}
                        className="w-4 h-4 rounded border-[#D9E1EC] text-[#1F6BFF] focus:ring-[#1F6BFF] disabled:opacity-30"
                      />
                      <div>
                        <Link
                          href={`/admin/customers/${task.customerId}`}
                          className="font-bold text-[#0B1B3F] text-base block"
                        >
                          {task.customerName}
                        </Link>
                        <span className="text-xs font-mono text-[#64748B]">
                          {task.loanId}
                        </span>
                      </div>
                    </div>

                    <StatusChip status={task.status} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-2.5 rounded-lg text-center text-xs">
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Scheduled</span>
                      <span className="font-semibold text-[#0B1B3F] tabular-nums">
                        ₹{formatNumberIN(task.scheduled)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Arrears</span>
                      <span className="font-semibold text-[#0B1B3F] tabular-nums">
                        ₹{formatNumberIN(task.arrears)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#64748B] block text-[11px]">Penalty</span>
                      <span className="font-semibold text-[#0B1B3F] tabular-nums">
                        ₹{formatNumberIN(task.penalty)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[11px] text-[#64748B] block">To collect</span>
                      <span className="text-xl font-bold text-[#1F6BFF] tabular-nums">
                        ₹{formatNumberIN(task.amountToCollect)}
                      </span>
                    </div>

                    <div>
                      {isPaid ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => setViewingReceiptTaskId(task.id)}
                          className="min-h-[44px] px-6 text-sm font-semibold"
                        >
                          Receipt
                        </Button>
                      ) : (
                        <Link href={`/admin/collections/pay/${task.loanId}`}>
                          <Button
                            type="button"
                            variant="primary"
                            size="md"
                            className="min-h-[44px] px-6 text-sm font-semibold shadow-xs"
                          >
                            Collect
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Page Footer Bar */}
      <PageFooterBar
        left={
          <span>
            Showing <strong className="text-[#0B1B3F]">{tasks.length}</strong> customers
          </span>
        }
        right={
          <>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={selectedIds.length === 0}
              onClick={() => setBulkModalOpen(true)}
              className="text-xs font-semibold px-4 shadow-xs"
            >
              Collect Selected {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </Button>

            <Link href="/admin/reports?type=collections&date=2026-10-22">
              <Button
                type="button"
                variant="outline"
                size="md"
                className="text-xs font-semibold text-[#1F6BFF] border-[#BFDBFE] hover:bg-[#F3F7FF] px-4"
              >
                View Report
              </Button>
            </Link>
          </>
        }
      />

      {/* Bulk Collection Modal */}
      <BulkCollectModal
        isOpen={bulkModalOpen}
        selectedTasks={selectedTasksList}
        onClose={() => setBulkModalOpen(false)}
        onSuccess={handleBulkSuccess}
      />

      {/* Receipt Modal */}
      {activeViewingTask && (
        <ReceiptModal
          task={{
            id: activeViewingTask.id,
            customerId: activeViewingTask.customerId,
            customerName: activeViewingTask.customerName,
            loanId: activeViewingTask.loanId,
            agentId: activeViewingTask.agentId,
            routeId: "RT-001",
            routeName: "Anna Nagar",
            dueOn: activeViewingTask.dueOn,
            amountDue: activeViewingTask.scheduled,
            arrears: activeViewingTask.arrears,
            penalty: activeViewingTask.penalty,
            paid: activeViewingTask.status === "paid",
            receiptNo: activeViewingTask.receiptNo || "RC-0002",
            paidAt: activeViewingTask.paidAt || "2026-10-22T09:30:00+05:30",
            state: "due_today_paid",
            totalPayable: activeViewingTask.scheduled,
            amountToCollect: 0,
            remainingAmount: 0,
          }}
          role="admin"
          onClose={() => setViewingReceiptTaskId(null)}
        />
      )}
    </div>
  );
}

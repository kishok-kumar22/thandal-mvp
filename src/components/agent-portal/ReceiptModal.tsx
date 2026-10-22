"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ReceiptCard } from "@/components/receipts/ReceiptCard";
import { mockReceiptsList, type Receipt } from "@/data/mockReceipts";
import type { AgentTaskView } from "@/lib/collections";

interface ReceiptModalProps {
  task?: AgentTaskView | null;
  receipt?: Receipt | null;
  role?: "admin" | "agent";
  onClose: () => void;
}

export function ReceiptModal({
  task,
  receipt: directReceipt,
  role = "agent",
  onClose,
}: ReceiptModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!task && !directReceipt) return null;

  // Resolve receipt record
  const receiptNo = task?.receiptNo || directReceipt?.receiptNo || "RC-0002";
  const matchedReceipt =
    directReceipt ||
    mockReceiptsList.find((r) => r.receiptNo === receiptNo) || {
      receiptNo,
      paymentId: "PAY-0002",
      loanId: task?.loanId || "LN-1053",
      customerId: task?.customerId || "C-002",
      customerName: task?.customerName || "S.Priya",
      agentId: task?.agentId || "A-001",
      agentName: task?.agentName || "Selvam",
      collectedBy: "Selvam",
      amount: task?.totalPayable || 150,
      method: "cash" as const,
      paidAt: task?.paidAt || "2026-10-22T09:30:00+05:30",
      scheduledDue: task?.amountDue || 150,
      remainingBalance: 0,
      status: "paid" as const,
      allocation: {
        toPenalty: 0,
        toArrears: 0,
        toScheduled: task?.amountDue || 150,
      },
    };

  const fullReceiptUrl =
    role === "agent"
      ? `/agent/receipts/${matchedReceipt.receiptNo}`
      : `/admin/receipts/${matchedReceipt.receiptNo}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Receipt ${matchedReceipt.receiptNo}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1B3F]/60 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl border border-[#E6ECF5] shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEF2F6] bg-[#F8FAFC]">
          <span className="text-xs font-bold text-[#64748B] tracking-wider uppercase">
            Receipt Details
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0B1B3F] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <ReceiptCard receipt={matchedReceipt} className="border-0 shadow-none p-0 sm:p-0" />

          {/* Open full receipt link */}
          <div className="pt-2 text-center">
            <Link
              href={fullReceiptUrl}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
            >
              <span>Open full receipt page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EEF2F6] bg-[#F8FAFC]">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full justify-center h-11"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

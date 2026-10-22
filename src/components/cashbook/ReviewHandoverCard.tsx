"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatINR } from "@/lib/format";
import { RECIPIENTS } from "@/config/cash";
import { handoverDifference } from "@/lib/cashbook";
import { decideHandover } from "@/lib/mockApi";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { RejectHandoverModal } from "./RejectHandoverModal";
import type { Handover } from "@/data/mockHandovers";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ReviewHandoverCardProps {
  handover: Handover | null;
  onDecisionSuccess: (handoverId: string, decision: "accept" | "reject", actualAmount: number) => void;
}

export function ReviewHandoverCard({
  handover,
  onDecisionSuccess,
}: ReviewHandoverCardProps) {
  const actualInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [actualStr, setActualStr] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("Main office");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Sync state when selected handover changes
  useEffect(() => {
    if (handover) {
      setActualStr(String(handover.reportedAmount));
      setRecipient(handover.recipient || "Main office");
      setNotes(handover.notes || "");
      setSubmitError(null);
    } else {
      setActualStr("");
      setNotes("");
      setSubmitError(null);
    }
  }, [handover]);

  if (!handover) {
    return (
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-6 shadow-xs flex flex-col items-center justify-center text-center py-16">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-[#64748B] flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#0B1B3F]">
          Select a handover to review
        </h3>
        <p className="text-xs text-[#64748B] mt-1 max-w-xs">
          Choose a pending handover from the table on the left to verify actual physical cash and submit your decision.
        </p>
      </div>
    );
  }

  const reportedAmount = handover.reportedAmount;
  const actualAmount = parseInt(actualStr, 10) || 0;
  const difference = handoverDifference(actualAmount, reportedAmount);

  // Difference display text
  let differenceText = "₹0";
  let differenceClass = "text-[#0B1B3F]";
  if (difference < 0) {
    differenceText = `-₹${Math.abs(difference)} (short)`;
    differenceClass = "text-[#E5252A]";
  } else if (difference > 0) {
    differenceText = `₹${difference} (excess)`;
    differenceClass = "text-[#B45309]";
  }

  const isNotesRequired = difference !== 0;
  const isNotesValid = !isNotesRequired || notes.trim().length > 0;
  const isActualValid = actualAmount > 0;
  const canAccept = isActualValid && isNotesValid && !isSubmitting;

  const handleActualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "");
    setActualStr(clean);
  };

  const handleAccept = async () => {
    if (!canAccept) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const res = await decideHandover({
      id: handover.id,
      decision: "accept",
      actualAmount,
      recipient,
      notes: notes.trim() || undefined,
      version: handover.version,
      decidedBy: "Admin",
    });

    setIsSubmitting(false);

    if (res.conflict) {
      setSubmitError(res.message || "This handover was already reviewed. Refreshing.");
      return;
    }

    if (res.success) {
      setToastMsg(`Handover ${handover.id} accepted. ${formatINR(actualAmount)} received.`);
      setToastOpen(true);
      onDecisionSuccess(handover.id, "accept", actualAmount);
    } else {
      setSubmitError(res.message || "Failed to accept handover.");
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const res = await decideHandover({
      id: handover.id,
      decision: "reject",
      reason,
      version: handover.version,
      decidedBy: "Admin",
    });

    setIsSubmitting(false);
    setRejectModalOpen(false);

    if (res.conflict) {
      setSubmitError(res.message || "This handover was already reviewed. Refreshing.");
      return;
    }

    if (res.success) {
      setToastMsg(`Handover ${handover.id} rejected.`);
      setToastOpen(true);
      onDecisionSuccess(handover.id, "reject", 0);
    } else {
      setSubmitError(res.message || "Failed to reject handover.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-[#0B1B3F]">Review handover</h3>

      {submitError && (
        <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-xs font-semibold text-[#B91C1C]">
          {submitError}
        </div>
      )}

      {/* Fields with label-left / field-right on desktop */}
      <div className="space-y-4 text-sm divide-y divide-[#F1F5F9]">
        {/* Row 1: Handover ID */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2">
          <label className="text-[#64748B] font-medium sm:w-1/3">
            Handover ID
          </label>
          <div className="sm:w-2/3">
            <input
              type="text"
              readOnly
              value={handover.id}
              className="w-full h-10 px-3 rounded-lg bg-[#EEF1F5] text-[#0B1B3F] font-bold font-mono border-0 cursor-default"
            />
          </div>
        </div>

        {/* Row 2: Agent */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-3">
          <label className="text-[#64748B] font-medium sm:w-1/3">Agent</label>
          <div className="sm:w-2/3">
            <input
              type="text"
              readOnly
              value={handover.agentName || "Selvam"}
              className="w-full h-10 px-3 rounded-lg bg-[#EEF1F5] text-[#0B1B3F] font-semibold border-0 cursor-default"
            />
          </div>
        </div>

        {/* Row 3: Reported amount */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-3">
          <label className="text-[#64748B] font-medium sm:w-1/3">
            Reported amount
          </label>
          <div className="sm:w-2/3">
            <input
              type="text"
              readOnly
              value={formatINR(reportedAmount)}
              className="w-full h-10 px-3 rounded-lg bg-[#EEF1F5] text-[#0B1B3F] font-extrabold tabular-nums border-0 cursor-default"
            />
          </div>
        </div>

        {/* Row 4: Actual received amount (editable) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-3">
          <label
            htmlFor="actual-received-input"
            className="text-[#0B1B3F] font-bold sm:w-1/3"
          >
            Actual received amount *
          </label>
          <div className="sm:w-2/3 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B] pointer-events-none">
              ₹
            </span>
            <input
              id="actual-received-input"
              ref={actualInputRef}
              type="text"
              inputMode="numeric"
              value={actualStr}
              onChange={handleActualChange}
              placeholder="0"
              className="w-full h-10 pl-7 pr-3 rounded-lg border border-[#D9E1EC] font-bold text-[#0B1B3F] tabular-nums focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
            />
          </div>
        </div>

        {/* Row 5: Difference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-3">
          <label className="text-[#64748B] font-medium sm:w-1/3">
            Difference
          </label>
          <div className="sm:w-2/3">
            <input
              type="text"
              readOnly
              value={differenceText}
              className={`w-full h-10 px-3 rounded-lg bg-[#EEF1F5] font-bold tabular-nums border-0 cursor-default ${differenceClass}`}
            />
          </div>
        </div>

        {/* Row 6: Recipient */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-3">
          <label
            htmlFor="recipient-select"
            className="text-[#64748B] font-medium sm:w-1/3"
          >
            Recipient *
          </label>
          <div className="sm:w-2/3">
            <select
              id="recipient-select"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#D9E1EC] font-medium text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
            >
              {RECIPIENTS.map((rec) => (
                <option key={rec} value={rec}>
                  {rec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 7: Notes */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 pt-3">
          <label
            htmlFor="notes-input"
            className={`font-medium sm:w-1/3 ${
              isNotesRequired ? "text-[#B45309] font-bold" : "text-[#64748B]"
            }`}
          >
            {isNotesRequired
              ? "Notes (required when there is a difference) *"
              : "Notes (optional)"}
          </label>
          <div className="sm:w-2/3">
            <textarea
              id="notes-input"
              rows={3}
              maxLength={300}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full p-2.5 rounded-lg border border-[#D9E1EC] text-sm text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 resize-y"
            />
            <span className="text-[11px] text-[#94A3B8] block text-right">
              {notes.length}/300
            </span>
          </div>
        </div>
      </div>

      {/* Difference Warning Panel */}
      {difference !== 0 && (
        <div className="bg-[#FFF4DC] border border-[#F5C26B] rounded-lg p-3 text-xs text-[#B45309] space-y-1">
          <p className="font-semibold">
            The received amount differs from the reported amount by ₹{Math.abs(difference)}.
          </p>
          <p>
            Only the received amount is credited; any shortage stays outstanding for this agent.
          </p>
        </div>
      )}

      {/* Action Buttons: Equal width, side by side */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => setRejectModalOpen(true)}
          disabled={isSubmitting}
          className="w-full justify-center text-[#E5252A] border-[#E5252A] hover:bg-[#FEE2E2]/30 h-11"
        >
          Reject with reason
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleAccept}
          disabled={!canAccept}
          className="w-full justify-center h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              <span>Accepting...</span>
            </>
          ) : (
            <span>Accept handover</span>
          )}
        </Button>
      </div>

      {/* Reject Modal */}
      <RejectHandoverModal
        isOpen={rejectModalOpen}
        handoverId={handover.id}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleRejectConfirm}
        isSubmitting={isSubmitting}
      />

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMsg}
        type="success"
      />
    </div>
  );
}

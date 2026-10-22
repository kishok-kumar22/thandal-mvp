"use client";

import React, { useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { formatINR } from "@/lib/format";
import { RECIPIENTS, type CashRecipient } from "@/config/cash";
import { submitHandover } from "@/lib/mockApi";
import { HandoverSummaryCard } from "./HandoverSummaryCard";
import { HandoverReviewCard } from "./HandoverReviewCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import type { Handover } from "@/data/mockHandovers";
import { formatDateTime24 } from "@/lib/dates";

interface SubmitHandoverFormProps {
  agentName: string;
  openingCash: number;
  cashCollected: number;
  acceptedHandovers: number;
  pendingReview: number;
  availableCash: number;
  handovers: Handover[];
}

export function SubmitHandoverForm({
  agentName,
  openingCash,
  cashCollected,
  acceptedHandovers,
  pendingReview,
  availableCash: initialAvailableCash,
  handovers: initialHandovers,
}: SubmitHandoverFormProps) {
  const router = useRouter();
  const amountHelpId = useId();
  const notesHelpId = useId();

  const [availableCash, setAvailableCash] = useState(initialAvailableCash);
  const [handovers, setHandovers] = useState<Handover[]>(initialHandovers);

  const [amountStr, setAmountStr] = useState(initialAvailableCash > 0 ? String(initialAvailableCash) : "");
  const [recipient, setRecipient] = useState<string>("Main office");
  const [notes, setNotes] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Generate idempotency key once on mount
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      setIdempotencyKey(crypto.randomUUID());
    } else {
      setIdempotencyKey(`idemp-${Date.now()}`);
    }
  }, []);

  const parsedAmount = parseInt(amountStr.replace(/\D/g, ""), 10) || 0;
  const afterBalance = availableCash - parsedAmount;

  // Validation
  let amountError: string | null = null;
  if (!amountStr || parsedAmount <= 0) {
    amountError = "Amount must be at least ₹1.";
  } else if (parsedAmount > availableCash) {
    amountError = `Amount cannot exceed your available cash of ${formatINR(availableCash)}.`;
  }

  const isFormValid = availableCash > 0 && !amountError && !isSubmitting;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setAmountStr(raw);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitHandover({
        idempotencyKey,
        amount: parsedAmount,
        recipient,
        notes: notes.trim() || undefined,
      });

      if (!res.ok) {
        setErrorMessage(res.error || "Submission failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const submittedId = res.handoverId || "H-003";
      setToastMessage(`Handover ${submittedId} submitted for review`);

      // Update local state to reflect submission immediately
      const newHandover: Handover = {
        id: submittedId,
        agentId: "A-001",
        agentName,
        reportedAmount: parsedAmount,
        recipient,
        status: "pending_review",
        submittedAt: "2026-10-22T10:30:00+05:30",
        notes: notes.trim() || undefined,
        version: 1,
      };

      setHandovers((prev) => [newHandover, ...prev]);
      setAvailableCash(0);
      setAmountStr("");
      setNotes("");

      // Trigger server router refresh
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-5 right-5 z-50 bg-[#0B1B3F] text-white px-4 py-3 rounded-xl shadow-xl border border-[#13264F] flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Mobile-first stacked, Desktop 2-columns (1.4fr : 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
        {/* Left Column (Desktop): Form OR EmptyState, then My Handovers */}
        <div className="space-y-6 order-2 lg:order-1">
          {availableCash <= 0 ? (
            <div className="bg-white rounded-xl border border-[#E6ECF5] p-8 shadow-sm">
              <EmptyState
                title="No cash available to hand over"
                description="Cash already submitted is waiting for admin review."
              />
            </div>
          ) : (
            <form
              id="handover-form"
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-4"
            >
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-[#E5252A] flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Amount input */}
              <div>
                <label
                  htmlFor="handover-amount"
                  className="block text-xs font-bold text-[#0B1B3F] uppercase tracking-wider mb-1.5"
                >
                  Amount to hand over <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-[#64748B] pointer-events-none">
                    ₹
                  </span>
                  <input
                    id="handover-amount"
                    type="text"
                    inputMode="numeric"
                    value={amountStr ? parseInt(amountStr, 10).toLocaleString("en-IN") : ""}
                    onChange={handleAmountChange}
                    aria-invalid={Boolean(amountError)}
                    aria-describedby={amountError ? amountHelpId : undefined}
                    placeholder="1,000"
                    className={`w-full h-12 pl-8 pr-4 text-base font-bold text-[#0B1B3F] rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      amountError
                        ? "border-red-400 focus:ring-red-400/20 bg-red-50/20"
                        : "border-[#D9E1EC] focus:border-[#1F6BFF] focus:ring-[#1F6BFF]/20 bg-white"
                    }`}
                  />
                </div>
                {amountError && (
                  <p id={amountHelpId} className="text-xs text-[#E5252A] mt-1.5 font-medium">
                    {amountError}
                  </p>
                )}
              </div>

              {/* Recipient select */}
              <div>
                <label
                  htmlFor="handover-recipient"
                  className="block text-xs font-bold text-[#0B1B3F] uppercase tracking-wider mb-1.5"
                >
                  Recipient <span className="text-red-500">*</span>
                </label>
                <select
                  id="handover-recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full h-11 px-3 text-sm font-semibold text-[#0B1B3F] bg-white rounded-xl border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
                >
                  {RECIPIENTS.map((rec) => (
                    <option key={rec} value={rec}>
                      {rec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="handover-notes"
                    className="block text-xs font-bold text-[#0B1B3F] uppercase tracking-wider"
                  >
                    Notes (optional)
                  </label>
                  <span id={notesHelpId} className="text-[11px] text-[#64748B]">
                    {notes.length}/300
                  </span>
                </div>
                <textarea
                  id="handover-notes"
                  rows={3}
                  maxLength={300}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes (optional)"
                  aria-describedby={notesHelpId}
                  className="w-full p-3 text-sm text-[#0B1B3F] rounded-xl border border-[#D9E1EC] focus:outline-none focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 resize-y min-h-[80px]"
                />
              </div>
            </form>
          )}

          {/* My Handovers Section */}
          <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3F]">My handovers</h3>

            {handovers.length === 0 ? (
              <p className="text-xs text-[#64748B] py-3 text-center">No handover submissions recorded yet.</p>
            ) : (
              <>
                {/* Desktop Table (≥768px) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
                        <th scope="col" className="py-2.5 px-3">Handover ID</th>
                        <th scope="col" className="py-2.5 px-3">Date</th>
                        <th scope="col" className="py-2.5 px-3">Amount</th>
                        <th scope="col" className="py-2.5 px-3">Status</th>
                        <th scope="col" className="py-2.5 px-3">Recipient</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {handovers.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#0B1B3F]">{h.id}</td>
                          <td className="py-3 px-3 text-[#64748B]">{formatDateTime24(h.submittedAt)}</td>
                          <td className="py-3 px-3 font-bold text-[#0B1B3F] tabular-nums">
                            {formatINR(h.reportedAmount)}
                          </td>
                          <td className="py-3 px-3">
                            <StatusChip status={h.status} />
                            {h.status === "rejected" && h.rejectionReason && (
                              <p className="text-[11px] text-red-600 mt-1 italic">
                                Reason: {h.rejectionReason}
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[#475569]">{h.recipient || "Main office"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Cards (<768px) */}
                <div className="md:hidden space-y-2.5">
                  {handovers.map((h) => (
                    <div
                      key={h.id}
                      className="p-3.5 bg-[#F8FAFC] border border-[#E6ECF5] rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0B1B3F] text-sm">{h.id}</span>
                        <StatusChip status={h.status} />
                      </div>
                      <div className="flex items-center justify-between text-[#64748B]">
                        <span>{formatDateTime24(h.submittedAt)}</span>
                        <span className="font-bold text-[#0B1B3F] text-sm tabular-nums">
                          {formatINR(h.reportedAmount)}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#475569]">
                        Recipient: <span className="font-medium">{h.recipient || "Main office"}</span>
                      </div>
                      {h.status === "rejected" && h.rejectionReason && (
                        <div className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg italic">
                          Reason: {h.rejectionReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column (Desktop): Summary Card + Review Card + Desktop Submit Button */}
        <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-20">
          <HandoverSummaryCard
            agentName={agentName}
            dateStr="22 Oct 2026"
            openingCash={openingCash}
            cashCollected={cashCollected}
            acceptedHandovers={acceptedHandovers}
            pendingReview={pendingReview}
            availableCash={availableCash}
          />

          {availableCash > 0 && (
            <HandoverReviewCard afterBalance={afterBalance} />
          )}

          {/* Desktop Submit Button (≥1024px) */}
          <div className="hidden lg:block">
            <button
              type="submit"
              form="handover-form"
              disabled={!isFormValid}
              className="w-full h-12 bg-[#1F6BFF] hover:bg-[#1A5CD6] disabled:bg-[#94A3B8] disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit handover</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar (<1024px) - sits directly above mobile bottom nav */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-[#E6ECF5] p-3 px-4 shadow-[0_-4px_12px_rgba(11,27,63,0.06)]">
        <button
          type="submit"
          form="handover-form"
          disabled={!isFormValid}
          className="w-full h-12 bg-[#1F6BFF] hover:bg-[#1A5CD6] disabled:bg-[#94A3B8] disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit handover</span>
          )}
        </button>
      </div>
    </div>
  );
}

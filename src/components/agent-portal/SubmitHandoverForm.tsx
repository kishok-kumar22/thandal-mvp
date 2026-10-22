"use client";

import React, { useState } from "react";
import { RECIPIENTS } from "@/config/cash";
import { submitHandover } from "@/lib/mockApi";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { FormField } from "@/components/ui/FormField";
import { Loader2 } from "lucide-react";
import type { Handover } from "@/data/mockHandovers";

interface SubmitHandoverFormProps {
  agentId: string;
  availableCash: number;
  onHandoverCreated: (newHandover: Handover) => void;
}

export function SubmitHandoverForm({
  agentId,
  availableCash,
  onHandoverCreated,
}: SubmitHandoverFormProps) {
  const [amountStr, setAmountStr] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("Main office");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const parsedAmount = parseInt(amountStr, 10) || 0;

  let amountError: string | null = null;
  if (amountStr.length > 0) {
    if (parsedAmount <= 0) {
      amountError = "Amount must be greater than ₹0";
    } else if (parsedAmount > availableCash) {
      amountError = `Amount cannot exceed available cash in hand of ${formatINR(availableCash)}`;
    }
  }

  const isValid = parsedAmount > 0 && parsedAmount <= availableCash && !amountError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await submitHandover({
      agentId,
      reportedAmount: parsedAmount,
      recipient,
      notes: notes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      const newHandover: Handover = {
        id: res.handoverId,
        agentId,
        agentName: "Selvam",
        reportedAmount: parsedAmount,
        recipient,
        status: "pending_review",
        submittedAt: "2026-10-22T10:30:00+05:30",
        notes: notes.trim() || undefined,
        version: 1,
      };

      setToastMsg(`Handover ${res.handoverId} submitted for review`);
      setToastOpen(true);
      setAmountStr("");
      setNotes("");
      onHandoverCreated(newHandover);
    } else {
      setErrorMsg(res.message || "Failed to submit handover.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#EEF2F6] pb-3">
        <h2 className="text-lg font-bold text-[#0B1B3F]">Submit handover</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Submit collected physical cash to office or branch cashier for verification.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-xs font-semibold text-[#B91C1C]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="handover-amount" className="text-sm font-bold text-[#0B1B3F]">
              Amount *
            </label>
            <span className="text-xs text-[#64748B]">
              Available: <span className="font-bold text-[#0B1B3F]">{formatINR(availableCash)}</span>
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#64748B] pointer-events-none">
              ₹
            </span>
            <input
              id="handover-amount"
              type="text"
              inputMode="numeric"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className={`w-full h-12 pl-8 pr-4 text-xl font-bold text-[#0B1B3F] rounded-lg border transition-all ${
                amountError
                  ? "border-[#E5252A] focus:ring-2 focus:ring-[#E5252A]/20"
                  : "border-[#D9E1EC] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
              }`}
            />
          </div>

          {amountError && (
            <p className="text-xs font-semibold text-[#E5252A] mt-1.5">
              {amountError}
            </p>
          )}

          {availableCash > 0 && (
            <button
              type="button"
              onClick={() => setAmountStr(String(availableCash))}
              className="text-xs font-semibold text-[#1F6BFF] hover:underline mt-1 cursor-pointer"
            >
              Deposit all available cash ({formatINR(availableCash)})
            </button>
          )}
        </div>

        {/* Recipient Field */}
        <FormField label="Recipient *">
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-[#D9E1EC] text-sm font-medium text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
          >
            {RECIPIENTS.map((rec) => (
              <option key={rec} value={rec}>
                {rec}
              </option>
            ))}
          </select>
        </FormField>

        {/* Notes Field */}
        <div>
          <label htmlFor="handover-notes" className="block text-xs font-semibold text-[#0B1B3F] mb-1">
            Notes (optional)
          </label>
          <textarea
            id="handover-notes"
            rows={2}
            maxLength={300}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add handover notes or receipt bag reference..."
            className="w-full p-2.5 rounded-lg border border-[#D9E1EC] text-sm text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isValid || isSubmitting}
          className="w-full h-12 justify-center font-semibold text-base shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit handover</span>
          )}
        </Button>
      </form>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMsg}
        type="success"
      />
    </div>
  );
}

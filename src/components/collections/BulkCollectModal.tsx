"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { formatINR } from "@/lib/format";
import { recordPayment } from "@/lib/mockApi";
import { todayIso, now, toPaidAtISO } from "@/lib/clock";
import type { CollectionRowView } from "@/lib/collections";
import { Loader2 } from "lucide-react";

interface BulkCollectModalProps {
  isOpen: boolean;
  selectedTasks: CollectionRowView[];
  onClose: () => void;
  onSuccess: (updatedIds: string[]) => void;
}

/**
 * Bulk collection processor.
 * Note: Full instalment payments only; partial bulk payments are not supported.
 */
export function BulkCollectModal({
  isOpen,
  selectedTasks,
  onClose,
  onSuccess,
}: BulkCollectModalProps) {
  const [method, setMethod] = useState<"cash" | "upi">("cash");
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totalAmount = selectedTasks.reduce((sum, t) => sum + t.amountToCollect, 0);

  const isRefRequired = method === "upi";
  const isRefValid = !isRefRequired || reference.trim().length >= 4;
  const canSubmit = selectedTasks.length > 0 && isRefValid && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const paidAtIso = toPaidAtISO(todayIso(), "10:30");
    const updatedIds: string[] = [];

    try {
      for (const t of selectedTasks) {
        const res = await recordPayment({
          loanId: t.loanId,
          amount: t.amountToCollect,
          method,
          paidAt: paidAtIso,
          reference: reference.trim() || undefined,
          collectedBy: "Admin",
        });
        if (res.success) {
          updatedIds.push(t.id);
        }
      }

      setIsSubmitting(false);
      onSuccess(updatedIds);
      onClose();
    } catch (err: unknown) {
      setIsSubmitting(false);
      setSubmitError("Failed to complete bulk collection.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Collect Selected (${selectedTasks.length})`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-xs font-semibold text-[#B91C1C]">
            {submitError}
          </div>
        )}

        <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#EEF2F6] space-y-2 max-h-48 overflow-y-auto">
          {selectedTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0B1B3F]">
                {t.customerName} ({t.loanId})
              </span>
              <span className="font-extrabold text-[#1F6BFF] tabular-nums">
                {formatINR(t.amountToCollect)}
              </span>
            </div>
          ))}
          <div className="border-t border-[#CBD5E1] pt-2 flex justify-between text-sm font-bold">
            <span className="text-[#0B1B3F]">Total</span>
            <span className="text-[#1F6BFF] tabular-nums">
              {formatINR(totalAmount)}
            </span>
          </div>
        </div>

        <FormField label="Payment method *">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "cash" | "upi")}
            className="w-full h-11 px-3 rounded-lg border border-[#D9E1EC] text-sm font-medium text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
          </select>
        </FormField>

        {isRefRequired && (
          <FormField label="UPI Reference *">
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter reference ID"
              className="w-full h-11 px-3.5 rounded-lg border border-[#D9E1EC] text-sm text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
            />
          </FormField>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!canSubmit}
            className="h-11 px-6 font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Collecting...</span>
              </>
            ) : (
              <span>Confirm collection of {formatINR(totalAmount)}</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface RejectHandoverModalProps {
  isOpen: boolean;
  handoverId: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function RejectHandoverModal({
  isOpen,
  handoverId,
  onClose,
  onConfirm,
  isSubmitting = false,
}: RejectHandoverModalProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();
  const isValid = trimmed.length >= 10 && trimmed.length <= 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    await onConfirm(trimmed);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Reject handover ${handoverId}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-[#475569]">
          Please provide a reason for rejecting this cash handover. No ledger entry will be recorded, and the cash will remain outstanding with the agent.
        </p>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="reject-reason" className="text-xs font-bold text-[#0B1B3F]">
              Reason for rejection *
            </label>
            <span className="text-xs text-[#64748B] tabular-nums">
              {trimmed.length}/300
            </span>
          </div>

          <textarea
            id="reject-reason"
            rows={4}
            maxLength={300}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Specify reason (minimum 10 characters)..."
            className="w-full p-3 rounded-lg border border-[#D9E1EC] text-sm text-[#0B1B3F] focus:border-[#E5252A] focus:ring-2 focus:ring-[#E5252A]/20"
          />
          {trimmed.length > 0 && trimmed.length < 10 && (
            <p className="text-xs text-[#E5252A] mt-1">
              Reason must be at least 10 characters long.
            </p>
          )}
        </div>

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
            variant="danger"
            size="md"
            disabled={!isValid || isSubmitting}
            className="bg-[#E5252A] hover:bg-[#C91F24] text-white"
          >
            {isSubmitting ? "Rejecting..." : "Reject handover"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

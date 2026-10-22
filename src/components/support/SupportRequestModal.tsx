"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Paperclip, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { updateSupportStatus } from "@/lib/mockApi";
import type { SupportRequest, SupportStatus, SupportKind } from "@/data/mockSupport";

interface SupportRequestModalProps {
  request: SupportRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (id: string, newStatus: SupportStatus) => void;
}

export function SupportRequestModal({
  request,
  isOpen,
  onClose,
  onStatusUpdated,
}: SupportRequestModalProps) {
  const { showToast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<SupportStatus>(
    request?.status || "open"
  );
  const [isPending, startTransition] = useTransition();

  // Keep selectedStatus in sync with open request
  React.useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
    }
  }, [request]);

  if (!request) return null;

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSupportStatus(request.id, selectedStatus);
      if (!res.success) {
        showToast(res.error || "Failed to update status", "error");
        return;
      }
      showToast(`Support request ${request.id} status updated to ${selectedStatus}`, "success");
      onStatusUpdated(request.id, selectedStatus);
      onClose();
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getKindLabel = (kind?: SupportKind) => {
    switch (kind) {
      case "callback":
        return "Call back";
      case "profile_correction":
        return "Profile correction";
      case "general":
      default:
        return "General";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Support Request ${request.id}`}
      size="md"
    >
      <div className="space-y-5 text-sm text-[#0B1B3F]">
        {/* Meta summary strip */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-[#E2E8F0]">
          <div>
            <p className="text-xs text-[#64748B] font-medium">Customer</p>
            <p className="font-bold text-[#0B1B3F]">{request.customerName || request.customerId}</p>
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-medium">Request Type</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#EEF2F7] text-[#0B1B3F] mt-0.5">
              {getKindLabel(request.kind)}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-medium">Related Loan</p>
            <p className="font-bold text-[#0B1B3F]">{request.loanId || "None (General)"}</p>
          </div>
          <div>
            <p className="text-xs text-[#64748B] font-medium">Submitted on</p>
            <p className="font-medium text-[#334155]">{request.createdAt.slice(0, 10)}</p>
          </div>

          {/* Meta details: Field to correct or Preferred time */}
          {request.meta?.field && (
            <div className="col-span-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748B] font-medium">Field requiring correction</p>
                <p className="font-bold text-[#0B1B3F] capitalize">{request.meta.field}</p>
              </div>
              <Link
                href={`/admin/customers/${request.customerId}/edit`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F6BFF] hover:underline"
              >
                <span>Open customer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {request.meta?.preferredTime && (
            <div className="col-span-2 pt-2 border-t border-[#E2E8F0]">
              <p className="text-xs text-[#64748B] font-medium">Preferred call back window</p>
              <p className="font-bold text-[#0B1B3F] capitalize">{request.meta.preferredTime}</p>
            </div>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            Subject
          </label>
          <div className="p-3 bg-white rounded-lg border border-[#D9E1EC] font-semibold text-base text-[#0B1B3F]">
            {request.subject}
          </div>
        </div>

        {/* Message (escaped plain text) */}
        <div>
          <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            Message
          </label>
          <div className="p-4 bg-white rounded-lg border border-[#D9E1EC] text-[#334155] whitespace-pre-wrap leading-relaxed min-h-[100px] max-h-60 overflow-y-auto">
            {request.message}
          </div>
        </div>

        {/* Attachment preview if present */}
        {request.attachment && (
          <div>
            <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">
              Attachment
            </label>
            <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#D9E1EC] bg-[#F8FAFC]">
              <Paperclip className="w-4 h-4 text-[#1F6BFF] shrink-0" aria-hidden="true" />
              <span className="font-medium text-[#0B1B3F] truncate flex-1">
                {request.attachment.name}
              </span>
              <span className="text-xs text-[#64748B] shrink-0">
                ({formatFileSize(request.attachment.size)})
              </span>
            </div>
          </div>
        )}

        {/* Status select */}
        <div className="space-y-1.5 pt-2 border-t border-[#E6ECF5]">
          <label htmlFor="modal-status-select" className="block text-xs font-bold text-[#0B1B3F]">
            Update status
          </label>
          <select
            id="modal-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as SupportStatus)}
            className="w-full h-11 px-3 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
          >
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6ECF5]">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            <span>Save status</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

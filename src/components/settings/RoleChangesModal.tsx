"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import {
  ACTION_LABELS,
  PERMISSION_VALUE_LABELS,
  type ActionKey,
  type Role,
  type PermissionValue,
} from "@/config/permissions";

export interface PermissionDiff {
  action: ActionKey;
  role: Role;
  from: PermissionValue;
  to: PermissionValue;
}

interface RoleChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  changes: PermissionDiff[];
  isSaving: boolean;
}

export function RoleChangesModal({
  isOpen,
  onClose,
  onConfirm,
  changes,
  isSaving,
}: RoleChangesModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review permission changes"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs text-[#64748B] leading-relaxed">
          The following access control permissions will be updated in the system matrix and recorded in the audit log:
        </p>

        <div className="space-y-2 bg-[#F8FAFC] border border-[#E6ECF5] p-3 rounded-xl">
          {changes.map((ch, idx) => (
            <div
              key={idx}
              className="text-xs flex items-center justify-between py-1.5 border-b border-[#F1F5F9] last:border-0"
            >
              <div className="font-semibold text-[#0B1B3F]">
                {ACTION_LABELS[ch.action]}
                <span className="text-[11px] font-normal text-[#64748B] ml-1">
                  ({ch.role.charAt(0).toUpperCase() + ch.role.slice(1)})
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-bold tabular-nums">
                <span className="text-slate-500">
                  {PERMISSION_VALUE_LABELS[ch.from]}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#1F6BFF]">
                  {PERMISSION_VALUE_LABELS[ch.to]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0B1B3F] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1F6BFF] hover:bg-[#1A5CD6] rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Confirm & Save</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

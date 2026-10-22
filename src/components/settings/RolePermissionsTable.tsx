"use client";

import React, { useState, useEffect } from "react";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  ACTION_LABELS,
  PERMISSION_VALUE_LABELS,
  type PermissionMatrix,
  type ActionKey,
  type Role,
  type PermissionValue,
} from "@/config/permissions";
import { RoleChangesModal, type PermissionDiff } from "./RoleChangesModal";
import { updatePermissions, getPermissionsVersion } from "@/lib/mockApi";

interface RolePermissionsTableProps {
  initialMatrix: PermissionMatrix;
}

const ACTION_ORDER: ActionKey[] = [
  "manage_loans",
  "record_collections",
  "view_loans",
  "waive_penalties",
  "review_cash_handover",
];

const ROLES_ORDER: Role[] = ["admin", "agent", "customer"];

export function RolePermissionsTable({ initialMatrix }: RolePermissionsTableProps) {
  const [baseMatrix, setBaseMatrix] = useState<PermissionMatrix>(initialMatrix);
  const [matrix, setMatrix] = useState<PermissionMatrix>(initialMatrix);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Calculate changes diff
  const changes: PermissionDiff[] = [];
  ACTION_ORDER.forEach((act) => {
    ROLES_ORDER.forEach((r) => {
      const fromVal = baseMatrix[act][r].value;
      const toVal = matrix[act][r].value;
      if (fromVal !== toVal) {
        changes.push({
          action: act,
          role: r,
          from: fromVal,
          to: toVal,
        });
      }
    });
  });

  const hasChanges = changes.length > 0;

  // Dependency rule check
  const agentRecordVal = matrix.record_collections.agent.value;
  const agentViewVal = matrix.view_loans.agent.value;
  const hasDependencyConflict = agentRecordVal === "assigned" && agentViewVal === "no";

  // Prevent accidental navigation with unsaved edits
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleCellChange = (action: ActionKey, role: Role, newVal: PermissionValue) => {
    setServerError(null);
    setMatrix((prev) => {
      const copy: PermissionMatrix = JSON.parse(JSON.stringify(prev));
      copy[action][role].value = newVal;
      return copy;
    });
  };

  const handleReset = () => {
    setMatrix(JSON.parse(JSON.stringify(baseMatrix)));
    setServerError(null);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setServerError(null);
    try {
      const version = getPermissionsVersion();
      const res = await updatePermissions({
        changes,
        version,
      });

      if (!res.ok) {
        setServerError(res.error || "Failed to update permissions.");
        setIsModalOpen(false);
        return;
      }

      setBaseMatrix(JSON.parse(JSON.stringify(matrix)));
      setIsModalOpen(false);
      setToastMessage("Role permissions updated");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-5 right-5 z-50 bg-[#0B1B3F] text-white px-4 py-3 rounded-xl shadow-xl border border-[#13264F] flex items-center gap-3 text-sm animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Dependency Conflict Warning */}
      {hasDependencyConflict && (
        <div
          role="alert"
          className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Recording collections requires viewing assigned loans. Agent cannot have Record collections = Assigned while View loans = No.
          </span>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Desktop & Tablet Real Table (≥768px) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#D9E1EC]">
        <table className="w-full text-left text-xs border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-[#ECF0F6] text-[#0B1B3F] font-bold border-b border-[#D9E1EC]">
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] w-[35%]">
                Action
              </th>
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-center w-[21%]">
                Admin
              </th>
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-center w-[22%]">
                Agent
              </th>
              <th scope="col" className="py-3 px-4 font-bold text-[#0B1B3F] text-center w-[22%]">
                Customer
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] bg-white">
            {ACTION_ORDER.map((act) => (
              <tr key={act} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#0B1B3F]">
                  {ACTION_LABELS[act]}
                </td>
                {ROLES_ORDER.map((role) => {
                  const cell = matrix[act][role];
                  return (
                    <td key={role} className="py-3 px-4 text-center">
                      {cell.editable ? (
                        <div className="inline-block relative">
                          <select
                            aria-label={`${role.charAt(0).toUpperCase() + role.slice(1)} permission for ${ACTION_LABELS[act]}`}
                            value={cell.value}
                            onChange={(e) =>
                              handleCellChange(act, role, e.target.value as PermissionValue)
                            }
                            className="text-xs font-semibold text-[#0B1B3F] bg-transparent hover:bg-slate-100 focus:bg-white rounded-lg px-2.5 py-1 border border-transparent hover:border-[#D9E1EC] focus:border-[#1F6BFF] focus:outline-none transition-colors cursor-pointer"
                          >
                            {cell.allowed.map((val) => (
                              <option key={val} value={val}>
                                {PERMISSION_VALUE_LABELS[val]}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1 font-medium text-[#475569]">
                          <span>{PERMISSION_VALUE_LABELS[cell.value]}</span>
                          <Lock className="w-3 h-3 text-[#94A3B8] ml-0.5" aria-hidden="true" />
                          <span className="sr-only">Locked</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards (<768px) */}
      <div className="md:hidden space-y-3">
        {ACTION_ORDER.map((act) => (
          <div
            key={act}
            className="p-4 bg-white border border-[#E6ECF5] rounded-xl shadow-xs space-y-3"
          >
            <div className="font-bold text-[#0B1B3F] text-sm border-b border-[#F1F5F9] pb-2">
              {ACTION_LABELS[act]}
            </div>
            <div className="space-y-2 text-xs">
              {ROLES_ORDER.map((role) => {
                const cell = matrix[act][role];
                return (
                  <div key={role} className="flex items-center justify-between">
                    <span className="text-[#64748B] font-medium capitalize">{role}</span>
                    {cell.editable ? (
                      <select
                        aria-label={`${role} permission for ${ACTION_LABELS[act]}`}
                        value={cell.value}
                        onChange={(e) =>
                          handleCellChange(act, role, e.target.value as PermissionValue)
                        }
                        className="text-xs font-bold text-[#0B1B3F] bg-slate-50 border border-[#D9E1EC] rounded-lg px-2 py-1"
                      >
                        {cell.allowed.map((val) => (
                          <option key={val} value={val}>
                            {PERMISSION_VALUE_LABELS[val]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#475569]">
                        <span>{PERMISSION_VALUE_LABELS[cell.value]}</span>
                        <Lock className="w-3 h-3 text-[#94A3B8]" aria-hidden="true" />
                        <span className="sr-only">Locked</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <p className="text-[11px] text-[#64748B] italic pt-1">
        Locked values are fixed for security and cannot be changed.
      </p>

      {/* Sticky Bottom Action Bar (Roles Tab only) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-[#E6ECF5] p-3 px-6 shadow-[0_-4px_16px_rgba(11,27,63,0.08)] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasChanges || isSaving}
          className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0B1B3F] border border-[#D9E1EC] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={!hasChanges || hasDependencyConflict || isSaving}
          className="px-5 py-2 text-xs font-bold text-white bg-[#1F6BFF] hover:bg-[#1A5CD6] rounded-xl shadow-sm transition-colors cursor-pointer disabled:bg-[#94A3B8] disabled:cursor-not-allowed"
        >
          Save changes
        </button>
      </div>

      {/* Review Modal */}
      <RoleChangesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        changes={changes}
        isSaving={isSaving}
      />
    </div>
  );
}

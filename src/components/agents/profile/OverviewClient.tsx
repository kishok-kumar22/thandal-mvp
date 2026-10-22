"use client";

import React, { useState, useRef } from "react";
import { AssignedCustomersCard } from "./AssignedCustomersCard";
import { AssignCustomersPanel } from "./AssignCustomersPanel";
import { AssignmentsProvider, useAssignments, type StagedAssignmentItem } from "./AssignmentsContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { saveAssignments } from "@/lib/mockApi";
import type { Agent } from "@/data/mockAgents";

interface OverviewClientProps {
  agent: Agent;
  initialAssigned: StagedAssignmentItem[];
}

function OverviewInner({ agent }: { agent: Agent }) {
  const { stagedList, clearStaged, commitAll, isDirty } = useAssignments();
  const selectRef = useRef<HTMLSelectElement>(null);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleFocusAssign = () => {
    if (selectRef.current) {
      selectRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      selectRef.current.focus();
    }
  };

  const handleSaveAll = async () => {
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    try {
      const payload = stagedList.map((s) => ({
        customerId: s.customerId,
        routeId: s.routeId,
        effectiveDate: s.effectiveDate,
      }));

      const res = await saveAssignments(agent.id, payload);
      if (res.success) {
        commitAll();
        setToastMessage(`${res.count} customer${res.count > 1 ? "s" : ""} assigned to ${agent.name}`);
        setToastOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      setCancelModalOpen(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-6 items-start">
        {/* Card 1: Assigned Customers Table */}
        <AssignedCustomersCard
          agentId={agent.id}
          totalCount={agent.assignedCustomers}
          onFocusAssign={handleFocusAssign}
        />

        {/* Card 2: Assign Customers Panel */}
        <AssignCustomersPanel ref={selectRef} currentAgentName={agent.name} />
      </div>

      {/* Sticky Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6ECF5] py-3.5 px-4 sm:px-8 shadow-lg"
        style={{
          bottom: "var(--bottom-nav-h, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={!isDirty || isSaving}
            onClick={handleCancel}
            className="w-full sm:w-auto px-6"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!isDirty || isSaving}
            onClick={handleSaveAll}
            className="w-full sm:w-auto px-6"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      {/* Confirm Discard Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Discard staged assignments?"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B]">
            You have unsaved customer assignments staged. Discarding will clear these pending changes.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setCancelModalOpen(false)}
            >
              Keep editing
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                clearStaged();
                setCancelModalOpen(false);
              }}
            >
              Discard changes
            </Button>
          </div>
        </div>
      </Modal>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type="success"
      />
    </>
  );
}

export function OverviewClient({ agent, initialAssigned }: OverviewClientProps) {
  return (
    <AssignmentsProvider initialAssigned={initialAssigned}>
      <OverviewInner agent={agent} />
    </AssignmentsProvider>
  );
}

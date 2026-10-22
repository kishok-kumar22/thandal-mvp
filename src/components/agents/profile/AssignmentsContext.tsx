"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Frequency } from "@/lib/loan";

export interface StagedAssignmentItem {
  customerId: string;
  customerName: string;
  loanNo: string;
  area: string;
  amount: number;
  frequency: Frequency;
  routeId: string;
  effectiveDate: string; // YYYY-MM-DD
  isStaged?: boolean;
}

interface AssignmentsContextType {
  stagedList: StagedAssignmentItem[];
  addStagedAssignment: (item: StagedAssignmentItem) => { success: boolean; error?: string };
  clearStaged: () => void;
  committedList: StagedAssignmentItem[];
  commitAll: () => void;
  isDirty: boolean;
}

const AssignmentsContext = createContext<AssignmentsContextType | null>(null);

export function AssignmentsProvider({
  initialAssigned,
  children,
}: {
  initialAssigned: StagedAssignmentItem[];
  children: React.ReactNode;
}) {
  const [committedList, setCommittedList] = useState<StagedAssignmentItem[]>(initialAssigned);
  const [stagedList, setStagedList] = useState<StagedAssignmentItem[]>([]);

  const isDirty = stagedList.length > 0;

  // beforeunload warning if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const addStagedAssignment = (item: StagedAssignmentItem) => {
    // Check if already in staged or committed
    if (stagedList.some((s) => s.customerId === item.customerId)) {
      return { success: false, error: "This customer is already staged for assignment." };
    }
    if (committedList.some((c) => c.customerId === item.customerId)) {
      return { success: false, error: "This customer is already assigned to this agent." };
    }

    setStagedList((prev) => [{ ...item, isStaged: true }, ...prev]);
    return { success: true };
  };

  const clearStaged = () => {
    setStagedList([]);
  };

  const commitAll = () => {
    setCommittedList((prev) => [...stagedList.map((s) => ({ ...s, isStaged: false })), ...prev]);
    setStagedList([]);
  };

  return (
    <AssignmentsContext.Provider
      value={{
        stagedList,
        addStagedAssignment,
        clearStaged,
        committedList,
        commitAll,
        isDirty,
      }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentsContext);
  if (!context) {
    throw new Error("useAssignments must be used within an AssignmentsProvider");
  }
  return context;
}

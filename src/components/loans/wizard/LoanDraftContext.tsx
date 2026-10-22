"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { LoanDraft } from "@/lib/loan";
import { saveDraftToStorage, clearDraftFromStorage } from "@/lib/draftStorage";
import { getSettings } from "@/lib/settings";
import { nextWeekday, nextMonthlyDate } from "@/lib/calendar";
import { todayIso } from "@/lib/clock";

export function getDefaultLoanDraft(customerId = "C-001"): LoanDraft {
  const settings = getSettings();
  const freq = settings.loanDefaults.repaymentFrequency;
  const todayStr = todayIso();

  let firstDueDate = todayStr;
  if (freq === "weekly") {
    // When weekly, nextWeekday(today(), weeklyDueDay)
    firstDueDate = nextWeekday(todayStr, settings.calendar.weeklyDueDay, false);
  } else if (freq === "monthly") {
    // When monthly, nextMonthlyDate(today(), monthlyDueDay, monthEndRule)
    firstDueDate = nextMonthlyDate(todayStr, settings.calendar.monthlyDueDay, settings.calendar.monthEndRule);
  }

  return {
    customerId,
    product: "standard",
    principal: 5000,
    ratePercent: 5,
    rateBasis: "entire_loan_term",
    interestMethod: settings.loanDefaults.interestMethod,
    frequency: freq,
    term: 50,
    firstDueDate,
    agentId: "Selvam",
    penaltyPolicy: "standard",
    collectFirstAtDisbursement: true,
    paymentMethod: "cash",
    disbursementDate: todayStr,
    reference: "",
  };
}

export const defaultLoanDraft: LoanDraft = getDefaultLoanDraft("C-001");

interface LoanDraftContextType {
  draft: LoanDraft;
  updateDraft: (updates: Partial<LoanDraft>) => void;
  resetDraft: () => void;
  saveDraft: () => boolean;
  clearDraft: () => void;
}

const LoanDraftContext = createContext<LoanDraftContextType | null>(null);

export function LoanDraftProvider({
  children,
  initialCustomerId,
}: {
  children: React.ReactNode;
  initialCustomerId?: string;
}) {
  const [draft, setDraft] = useState<LoanDraft>(() => {
    return getDefaultLoanDraft(initialCustomerId || "C-001");
  });

  // If initialCustomerId changes from URL, update draft
  useEffect(() => {
    if (initialCustomerId) {
      setDraft((prev) => ({ ...prev, customerId: initialCustomerId }));
    }
  }, [initialCustomerId]);

  const updateDraft = (updates: Partial<LoanDraft>) => {
    setDraft((prev) => {
      const nextDraft = { ...prev, ...updates };

      // If frequency was changed without explicit firstDueDate, re-calculate default firstDueDate
      if (updates.frequency && updates.frequency !== prev.frequency && !updates.firstDueDate) {
        const settings = getSettings();
        const todayStr = todayIso();
        if (updates.frequency === "weekly") {
          nextDraft.firstDueDate = nextWeekday(todayStr, settings.calendar.weeklyDueDay, false);
        } else if (updates.frequency === "monthly") {
          nextDraft.firstDueDate = nextMonthlyDate(todayStr, settings.calendar.monthlyDueDay, settings.calendar.monthEndRule);
        } else {
          nextDraft.firstDueDate = todayStr;
        }
      }

      return nextDraft;
    });
  };

  const resetDraft = () => {
    clearDraftFromStorage();
    setDraft(getDefaultLoanDraft(initialCustomerId || "C-001"));
  };

  const saveDraft = (): boolean => {
    return saveDraftToStorage(draft);
  };

  const clearDraft = () => {
    clearDraftFromStorage();
    setDraft(getDefaultLoanDraft(initialCustomerId || "C-001"));
  };

  return (
    <LoanDraftContext.Provider
      value={{
        draft,
        updateDraft,
        resetDraft,
        saveDraft,
        clearDraft,
      }}
    >
      {children}
    </LoanDraftContext.Provider>
  );
}

export function useLoanDraft() {
  const context = useContext(LoanDraftContext);
  if (!context) {
    throw new Error("useLoanDraft must be used within a LoanDraftProvider");
  }
  return context;
}

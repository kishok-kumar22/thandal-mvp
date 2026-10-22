import type { LoanDraft } from "./loan";

const STORAGE_KEY = "thandal_loan_draft_v1";

/**
 * Safely saves the LoanDraft to localStorage.
 * Only the defined fields are persisted.
 */
export function saveDraftToStorage(draft: LoanDraft): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cleanDraft: LoanDraft = {
      customerId: draft.customerId || "",
      product: draft.product || "standard",
      principal: Number(draft.principal) || 5000,
      ratePercent: Number(draft.ratePercent) || 5,
      rateBasis: draft.rateBasis || "entire_loan_term",
      interestMethod: draft.interestMethod || "flat",
      frequency: draft.frequency || "daily",
      term: Number(draft.term) || 50,
      firstDueDate: draft.firstDueDate || "",
      agentId: draft.agentId || "",
      penaltyPolicy: draft.penaltyPolicy || "standard",
      collectFirstAtDisbursement: draft.collectFirstAtDisbursement ?? true,
      paymentMethod: draft.paymentMethod || "cash",
      disbursementDate: draft.disbursementDate || "",
      reference: draft.reference || "",
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanDraft));
    return true;
  } catch (e) {
    console.error("Failed to save draft to storage", e);
    return false;
  }
}

/**
 * Safely loads the saved LoanDraft from localStorage.
 */
export function loadDraftFromStorage(): LoanDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.customerId) {
      return parsed as LoanDraft;
    }
    return null;
  } catch (e) {
    console.error("Failed to read draft from storage", e);
    return null;
  }
}

/**
 * Checks if a saved draft exists in localStorage.
 */
export function hasSavedDraft(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

/**
 * Clears the saved draft from localStorage.
 */
export function clearDraftFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear draft from storage", e);
  }
}

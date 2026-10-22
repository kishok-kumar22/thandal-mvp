"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { LoanSummaryCard } from "./LoanSummaryCard";
import { FirstInstalmentCard } from "./FirstInstalmentCard";
import { DisbursementPreviewMiniCard } from "./DisbursementPreviewMiniCard";
import { DraftBanner } from "./DraftBanner";
import { useLoanDraft } from "./LoanDraftContext";
import { mockCustomersList } from "@/data/mockCustomers";
import { mockAgentsList } from "@/data/mockAgents";
import {
  calculateLoan,
  type Frequency,
  type RateBasis,
  type InterestMethod,
  type PenaltyPolicy,
} from "@/lib/loan";
import { hasSavedDraft, loadDraftFromStorage, clearDraftFromStorage } from "@/lib/draftStorage";

interface FormErrors {
  customerId?: string;
  principal?: string;
  ratePercent?: string;
  term?: string;
  firstDueDate?: string;
}

export function LoanTermsForm() {
  const router = useRouter();
  const { draft, updateDraft, saveDraft } = useLoanDraft();

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Active customers sorted by name
  const activeCustomers = [...mockCustomersList]
    .filter((c) => c.status === "active")
    .sort((a, b) => a.name.localeCompare(b.name));

  // Check if saved draft exists on mount
  useEffect(() => {
    if (hasSavedDraft()) {
      setShowDraftBanner(true);
    }
  }, []);

  const handleResumeDraft = () => {
    const saved = loadDraftFromStorage();
    if (saved) {
      updateDraft(saved);
      setToastMessage("Saved draft restored");
      setToastOpen(true);
    }
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    clearDraftFromStorage();
    setShowDraftBanner(false);
  };

  // When customer changes, update assigned agent automatically if available
  const handleCustomerChange = (newCustomerId: string) => {
    const cust = mockCustomersList.find((c) => c.id === newCustomerId);
    const updates: Partial<typeof draft> = { customerId: newCustomerId };
    if (cust && cust.assignedAgent) {
      updates.agentId = cust.assignedAgent;
    }
    updateDraft(updates);
    if (errors.customerId) {
      setErrors((prev) => ({ ...prev, customerId: undefined }));
    }
  };

  // Recompute financials live using calculateLoan
  const calc = calculateLoan({
    principal: draft.principal,
    ratePercent: draft.ratePercent,
    term: draft.term,
    frequency: draft.frequency,
    collectFirstAtDisbursement: draft.collectFirstAtDisbursement,
  });

  // Validation functions
  const validateField = (field: keyof FormErrors): string | undefined => {
    switch (field) {
      case "customerId":
        if (!draft.customerId) return "Customer is required";
        return undefined;

      case "principal":
        if (!draft.principal || draft.principal <= 0) return "Principal must be greater than 0";
        if (draft.principal % 100 !== 0) return "Principal must be a multiple of 100";
        return undefined;

      case "ratePercent":
        if (draft.ratePercent <= 0 || draft.ratePercent > 100)
          return "Interest rate must be between 0.1% and 100%";
        return undefined;

      case "term": {
        const maxInstalments = draft.frequency === "monthly" ? 60 : 365;
        if (!draft.term || draft.term < 1 || draft.term > maxInstalments) {
          return `Instalments must be between 1 and ${maxInstalments}`;
        }
        return undefined;
      }

      case "firstDueDate": {
        if (!draft.firstDueDate) return "First due date is required";
        const selected = new Date(draft.firstDueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          return "First due date cannot be in the past";
        }
        return undefined;
      }

      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    const err = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {
      customerId: validateField("customerId"),
      principal: validateField("principal"),
      ratePercent: validateField("ratePercent"),
      term: validateField("term"),
      firstDueDate: validateField("firstDueDate"),
    };

    setErrors(newErrors);

    // Scroll and focus first invalid field
    const firstInvalidKey = Object.keys(newErrors).find(
      (k) => Boolean(newErrors[k as keyof FormErrors])
    );

    if (firstInvalidKey) {
      const el = document.getElementById(`field-${firstInvalidKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return false;
    }

    return true;
  };

  const handleSaveDraft = () => {
    const success = saveDraft();
    if (success) {
      setToastMessage("Draft saved");
      setToastOpen(true);
    }
  };

  const handlePreviewSchedule = () => {
    if (!validateAll()) return;
    router.push("/admin/loans/new/schedule");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Resume draft notice banner */}
      {showDraftBanner && (
        <DraftBanner onResume={handleResumeDraft} onDiscard={handleDiscardDraft} />
      )}

      {/* Main Grid: Left Form Card + Right Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-6 items-start">
        {/* Left Column: Form Card */}
        <div className="bg-white rounded-xl border border-[#E6ECF5] p-6 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[#0B1B3F]">Loan details</h2>

          <div className="space-y-5">
            {/* Customer Select (Full width) */}
            <FormField
              label="Customer"
              htmlFor="field-customerId"
              required
              error={errors.customerId}
            >
              <div className="relative">
                <select
                  id="field-customerId"
                  value={draft.customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  onBlur={() => handleBlur("customerId")}
                  aria-invalid={Boolean(errors.customerId)}
                  aria-describedby={errors.customerId ? "field-customerId-error" : undefined}
                  className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
                >
                  <option value="">Select a customer</option>
                  {activeCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </FormField>

            {/* Row: Principal Amount (₹) | Interest Rate (%) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Principal amount (₹)"
                htmlFor="field-principal"
                required
                error={errors.principal}
              >
                <input
                  id="field-principal"
                  type="number"
                  inputMode="numeric"
                  step="100"
                  value={draft.principal || ""}
                  onChange={(e) =>
                    updateDraft({ principal: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  onBlur={() => handleBlur("principal")}
                  aria-invalid={Boolean(errors.principal)}
                  aria-describedby={errors.principal ? "field-principal-error" : undefined}
                  className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all tabular-nums"
                />
              </FormField>

              <FormField
                label="Interest rate (%)"
                htmlFor="field-ratePercent"
                required
                error={errors.ratePercent}
              >
                <input
                  id="field-ratePercent"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={draft.ratePercent || ""}
                  onChange={(e) =>
                    updateDraft({
                      ratePercent: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  onBlur={() => handleBlur("ratePercent")}
                  aria-invalid={Boolean(errors.ratePercent)}
                  aria-describedby={errors.ratePercent ? "field-ratePercent-error" : undefined}
                  className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all tabular-nums"
                />
              </FormField>
            </div>

            {/* Row: Rate Basis | Interest Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Rate basis" htmlFor="field-rateBasis" required>
                <div className="relative">
                  <select
                    id="field-rateBasis"
                    value={draft.rateBasis}
                    onChange={(e) => updateDraft({ rateBasis: e.target.value as RateBasis })}
                    className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-medium text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
                  >
                    <option value="entire_loan_term">Entire loan term</option>
                    <option value="per_month" disabled>
                      Per month (coming soon)
                    </option>
                    <option value="per_annum" disabled>
                      Per annum (coming soon)
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </FormField>

              <FormField label="Interest method" htmlFor="field-interestMethod" required>
                <div className="relative">
                  <select
                    id="field-interestMethod"
                    value={draft.interestMethod}
                    onChange={(e) =>
                      updateDraft({ interestMethod: e.target.value as InterestMethod })
                    }
                    className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-medium text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
                  >
                    <option value="flat">Flat</option>
                    <option value="reducing_balance" disabled>
                      Reducing balance (coming soon)
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </FormField>
            </div>

            {/* Row: Repayment Frequency | Number of Instalments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <FormField label="Repayment frequency" required>
                <SegmentedControl<Frequency>
                  value={draft.frequency}
                  onChange={(val) => {
                    updateDraft({ frequency: val });
                    if (val === "monthly" && draft.term > 60) {
                      updateDraft({ frequency: val, term: 60 });
                    }
                  }}
                  options={[
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                  ]}
                  name="loan-frequency"
                />
              </FormField>

              <FormField
                label="Number of instalments"
                htmlFor="field-term"
                required
                error={errors.term}
              >
                <input
                  id="field-term"
                  type="number"
                  min="1"
                  max={draft.frequency === "monthly" ? "60" : "365"}
                  value={draft.term || ""}
                  onChange={(e) =>
                    updateDraft({ term: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  onBlur={() => handleBlur("term")}
                  aria-invalid={Boolean(errors.term)}
                  aria-describedby={errors.term ? "field-term-error" : undefined}
                  className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all tabular-nums"
                />
              </FormField>
            </div>

            {/* Row: First Due Date | Agent */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="First due date"
                htmlFor="field-firstDueDate"
                required
                error={errors.firstDueDate}
              >
                <div className="relative">
                  <input
                    id="field-firstDueDate"
                    type="date"
                    value={draft.firstDueDate}
                    onChange={(e) => updateDraft({ firstDueDate: e.target.value })}
                    onBlur={() => handleBlur("firstDueDate")}
                    aria-invalid={Boolean(errors.firstDueDate)}
                    aria-describedby={
                      errors.firstDueDate ? "field-firstDueDate-error" : undefined
                    }
                    className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm font-medium text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
                  />
                  <CalendarIcon
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </FormField>

              <FormField label="Agent" htmlFor="field-agentId" required>
                <div className="relative">
                  <select
                    id="field-agentId"
                    value={draft.agentId}
                    onChange={(e) => updateDraft({ agentId: e.target.value })}
                    className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
                  >
                    {mockAgentsList.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </FormField>
            </div>

            {/* Row: Penalty Policy (half width) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Penalty policy" htmlFor="field-penaltyPolicy" required>
                <div className="relative">
                  <select
                    id="field-penaltyPolicy"
                    value={draft.penaltyPolicy}
                    onChange={(e) =>
                      updateDraft({ penaltyPolicy: e.target.value as PenaltyPolicy })
                    }
                    className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-medium text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
                  >
                    <option value="standard">Standard</option>
                    <option value="none">None</option>
                    <option value="custom" disabled>
                      Custom (coming soon)
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </FormField>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Stacked Cards */}
        <div className="space-y-6">
          {/* Card 1: Loan Summary */}
          <LoanSummaryCard calc={calc} />

          {/* Card 2: First Instalment at Disbursement Toggle */}
          <FirstInstalmentCard
            checked={draft.collectFirstAtDisbursement}
            onChange={(checked) => updateDraft({ collectFirstAtDisbursement: checked })}
            instalmentAmount={calc.instalment}
          />

          {/* Card 3: Disbursement Preview */}
          <DisbursementPreviewMiniCard
            calc={calc}
            toggleOn={draft.collectFirstAtDisbursement}
          />
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div
        className="fixed bottom-0 sm:bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6ECF5] py-3.5 px-4 sm:px-8 shadow-lg"
        style={{
          // On mobile, stick above mobile bottom nav
          bottom: "var(--bottom-nav-h, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleSaveDraft}
            className="w-full sm:w-auto px-6"
          >
            Save draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handlePreviewSchedule}
            className="w-full sm:w-auto px-6 flex items-center justify-center gap-2"
          >
            Preview schedule
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type="success"
      />
    </div>
  );
}

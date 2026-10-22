"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, CalendarCheck, Clock, Info, Loader2 } from "lucide-react";
import { CustomerPayCard } from "./CustomerPayCard";
import { DueBreakdownCard } from "./DueBreakdownCard";
import { PaymentMethodRadioGroup } from "./PaymentMethodRadioGroup";
import { AllocationPreviewCard } from "./AllocationPreviewCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { todayIso, now, formatTime12h, toPaidAtISO } from "@/lib/clock";
import { allocatePayment, type AllocationResult } from "@/lib/payments";
import { recordPayment } from "@/lib/mockApi";
import type { PaymentMethod } from "@/config/payments";
import type { LoanItem } from "@/data/mockLoans";
import type { CollectionTask } from "@/data/mockCollections";
import { MAX_BACKDATE_DAYS } from "@/config/payments";

interface RecordPaymentFormProps {
  role: "admin" | "agent";
  loan: LoanItem;
  task?: CollectionTask;
}

export function RecordPaymentForm({
  role,
  loan,
  task,
}: RecordPaymentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Financial dues
  const scheduledDue = task ? task.amountDue : loan.instalment;
  const arrears = task ? task.arrears : 0;
  const penalty = task ? task.penalty : 0;
  const totalDue = scheduledDue + arrears + penalty;

  // Amount prefill logic (query param ?amount= or default to totalDue)
  const initialAmount = searchParams.get("amount")
    ? parseInt(searchParams.get("amount") || "0", 10)
    : totalDue;

  // Form State
  const [amountStr, setAmountStr] = useState<string>(String(initialAmount > 0 ? initialAmount : totalDue));
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [date, setDate] = useState<string>(todayIso());
  const [time, setTime] = useState<string>("10:30");
  const [reference, setReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // UI & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // Accessible IDs
  const amountHelpId = useId();
  const refHelpId = useId();
  const submitHelpId = useId();

  // Generate idempotency key on mount
  useEffect(() => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      setIdempotencyKey(crypto.randomUUID());
    } else {
      setIdempotencyKey(`IDEM-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    }
  }, []);

  // Allocation computation with short debounce
  const [allocation, setAllocation] = useState<AllocationResult | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);

  const parsedAmount = parseInt(amountStr, 10) || 0;

  useEffect(() => {
    const handler = setTimeout(() => {
      if (parsedAmount <= 0) {
        setAmountError("Amount must be greater than ₹0");
        setAllocation(null);
        return;
      }
      if (parsedAmount > totalDue) {
        setAmountError(`Amount cannot exceed the total due of ₹${totalDue}`);
        setAllocation(null);
        return;
      }

      setAmountError(null);
      try {
        const result = allocatePayment({
          amount: parsedAmount,
          penaltyDue: penalty,
          arrearsDue: arrears,
          scheduledDue: scheduledDue,
        });
        setAllocation(result);
      } catch (err: unknown) {
        setAllocation(null);
        if (err instanceof Error) {
          setAmountError(err.message);
        }
      }
    }, 150);

    return () => clearTimeout(handler);
  }, [parsedAmount, totalDue, penalty, arrears, scheduledDue]);

  // Reference validation (mandatory for UPI & Bank transfer)
  let refError: string | null = null;
  if (method === "upi" || method === "bank_transfer") {
    const trimmed = reference.trim();
    if (!trimmed) {
      refError = "Reference number is required for this payment method";
    } else if (trimmed.length < 4 || trimmed.length > 40) {
      refError = "Reference must be between 4 and 40 characters";
    } else if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
      refError = "Reference can only contain letters, digits, hyphen, and underscore";
    }
  }

  // Date & Time validation
  let dateTimeError: string | null = null;
  if (date > todayIso()) {
    dateTimeError = "Payment date cannot be in the future";
  } else {
    // Check max backdate
    const selectedDate = new Date(date);
    const currentDate = new Date(todayIso());
    const diffDays = Math.round((currentDate.getTime() - selectedDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays > MAX_BACKDATE_DAYS) {
      dateTimeError = `Date cannot be more than ${MAX_BACKDATE_DAYS} days in the past`;
    }
  }

  const isFormValid =
    parsedAmount > 0 &&
    parsedAmount <= totalDue &&
    !amountError &&
    !refError &&
    !dateTimeError;

  const isDirty =
    parsedAmount !== totalDue ||
    method !== "cash" ||
    reference.trim().length > 0 ||
    notes.trim().length > 0;

  // Handle amount change (numeric only)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "");
    setAmountStr(clean);
  };

  const handleConfirm = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const paidAtIso = toPaidAtISO(date, time);

    try {
      const res = await recordPayment({
        idempotencyKey,
        loanId: loan.id,
        amount: parsedAmount,
        method,
        paidAt: paidAtIso,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
        collectedBy: role === "agent" ? "Selvam" : "Admin",
      });

      if (res.success) {
        const dest = role === "agent"
          ? `/agent/receipts/${res.receiptNo}`
          : `/admin/receipts/${res.receiptNo}`;
        router.push(dest);
      } else {
        setSubmitError("Failed to record payment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      setSubmitError("An unexpected error occurred while recording payment.");
      setIsSubmitting(false);
    }
  };

  const collectionsHref = role === "agent" ? "/agent/customers" : "/admin/collections";

  const handleBackClick = (e: React.MouseEvent) => {
    if (isDirty) {
      e.preventDefault();
      setShowDiscardModal(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-28 lg:pb-16">
      {/* Desktop Breadcrumbs */}
      <nav
        aria-label="Breadcrumbs"
        className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#64748B]"
      >
        <Link href={collectionsHref} className="hover:text-[#1F6BFF] transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#0B1B3F] font-semibold" aria-current="page">
          Record payment
        </span>
      </nav>

      {/* Header Row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleBackClick}
          aria-label="Back"
          className="w-10 h-10 rounded-xl bg-white border border-[#E6ECF5] flex items-center justify-center text-[#0B1B3F] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
          Record payment
        </h1>
      </div>

      {/* Main Grid: Left = Details + Form; Right = Sticky Allocation Preview + Confirm */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* 1. Customer Card */}
          <CustomerPayCard
            customerId={loan.customerId}
            customerName={loan.customerName}
            loanId={loan.id}
            role={role}
          />

          {/* 2. Due Breakdown Card */}
          <DueBreakdownCard
            scheduledDue={scheduledDue}
            arrears={arrears}
            penalty={penalty}
            totalDue={totalDue}
          />

          {/* 3. Payment Form Card */}
          <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 sm:p-6 shadow-xs space-y-5">
            {/* Amount received */}
            <div>
              <label
                htmlFor="amount-input"
                className="block text-sm font-bold text-[#0B1B3F] mb-1.5"
              >
                Amount received *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#64748B] pointer-events-none">
                  ₹
                </span>
                <input
                  id="amount-input"
                  type="text"
                  inputMode="numeric"
                  value={amountStr}
                  onChange={handleAmountChange}
                  aria-invalid={Boolean(amountError)}
                  aria-describedby={amountError ? amountHelpId : undefined}
                  className={`w-full h-14 pl-10 pr-4 text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tabular-nums rounded-xl border transition-all ${
                    amountError
                      ? "border-[#E5252A] focus:ring-2 focus:ring-[#E5252A]/20"
                      : "border-[#D9E1EC] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
                  }`}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between mt-1.5">
                {amountError ? (
                  <p id={amountHelpId} className="text-xs font-semibold text-[#E5252A]">
                    {amountError}
                  </p>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => setAmountStr(String(totalDue))}
                  className="text-xs font-semibold text-[#1F6BFF] hover:underline cursor-pointer"
                >
                  Use total due
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <span className="block text-sm font-semibold text-[#0B1B3F]">
                Payment method *
              </span>
              <PaymentMethodRadioGroup
                value={method}
                onChange={(m) => setMethod(m)}
              />
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Date *"
                error={dateTimeError || undefined}
              >
                <div className="relative">
                  <CalendarCheck className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    max={todayIso()}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#D9E1EC] text-sm font-medium text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
                  />
                </div>
              </FormField>

              <FormField label="Time *">
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#D9E1EC] text-sm font-medium text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
                  />
                </div>
              </FormField>
            </div>

            {/* Reference field */}
            <FormField
              label={
                method === "cash"
                  ? "Reference (optional)"
                  : "Reference *"
              }
              error={refError || undefined}
            >
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter reference number (optional)"
                aria-describedby={refError ? refHelpId : undefined}
                className={`w-full h-11 px-3.5 rounded-lg border text-sm font-medium text-[#0B1B3F] transition-all ${
                  refError
                    ? "border-[#E5252A] focus:ring-2 focus:ring-[#E5252A]/20"
                    : "border-[#D9E1EC] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20"
                }`}
              />
            </FormField>

            {/* Notes field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="notes-area"
                  className="text-xs font-semibold text-[#0B1B3F]"
                >
                  Notes (optional)
                </label>
                <span className="text-xs text-[#94A3B8] tabular-nums">
                  {notes.length}/300
                </span>
              </div>
              <textarea
                id="notes-area"
                rows={3}
                maxLength={300}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes (optional)"
                className="w-full p-3 rounded-lg border border-[#D9E1EC] text-sm font-medium text-[#0B1B3F] focus:border-[#1F6BFF] focus:ring-2 focus:ring-[#1F6BFF]/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Allocation Preview & Actions */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <AllocationPreviewCard
            allocation={allocation}
            isValid={isFormValid}
          />

          {/* Desktop Confirm Button & Info Line */}
          <div className="hidden lg:block space-y-2 pt-2">
            {submitError && (
              <div className="p-3 bg-[#FEE2E2] border border-[#FECACA] rounded-xl text-xs font-semibold text-[#B91C1C]">
                {submitError}
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!isFormValid || isSubmitting}
              onClick={handleConfirm}
              aria-describedby={!isFormValid ? submitHelpId : undefined}
              className="w-full h-12 text-base font-semibold justify-center shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Recording...</span>
                </>
              ) : (
                <span>Confirm payment</span>
              )}
            </Button>

            {!isFormValid && (
              <p id={submitHelpId} className="text-xs text-[#64748B] text-center">
                Please enter a valid amount and required fields to proceed.
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] pt-1">
              <Info className="w-4 h-4 text-[#94A3B8]" />
              <span>Receipt created after confirmation.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-[var(--bottom-nav-h)] left-0 right-0 z-30 bg-white border-t border-[#E6ECF5] p-4 shadow-lg">
        {submitError && (
          <div className="mb-2 p-2 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-xs font-semibold text-[#B91C1C]">
            {submitError}
          </div>
        )}

        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={!isFormValid || isSubmitting}
          onClick={handleConfirm}
          className="w-full h-12 text-base font-semibold justify-center shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Recording...</span>
            </>
          ) : (
            <span>Confirm payment</span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] mt-2">
          <Info className="w-4 h-4 text-[#94A3B8]" />
          <span>Receipt created after confirmation.</span>
        </div>
      </div>

      {/* Discard changes confirmation modal */}
      <Modal
        isOpen={showDiscardModal}
        title="Discard payment entry?"
        onClose={() => setShowDiscardModal(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#475569]">
            You have unsaved changes in the payment form. Leaving now will discard these entries.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowDiscardModal(false)}
            >
              Keep editing
            </Button>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => router.push(collectionsHref)}
            >
              Discard &amp; leave
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

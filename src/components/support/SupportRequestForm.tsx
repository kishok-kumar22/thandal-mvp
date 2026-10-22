"use client";

import React, { useState, useEffect, useTransition } from "react";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { FileInput, type SelectedFileMeta } from "@/components/ui/FileInput";
import { useToast } from "@/components/ui/Toast";
import { submitSupportRequest } from "@/lib/mockApi";
import type { LoanItem } from "@/data/mockLoans";
import type { SupportRequest } from "@/data/mockSupport";

interface SupportRequestFormProps {
  customerLoans: LoanItem[];
  onRequestSubmitted: (newReq: SupportRequest) => void;
}

export function SupportRequestForm({
  customerLoans,
  onRequestSubmitted,
}: SupportRequestFormProps) {
  const { showToast } = useToast();

  // Generate idempotency key once on mount
  const [idempotencyKey, setIdempotencyKey] = useState("");
  useEffect(() => {
    setIdempotencyKey(`idemp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
  }, []);

  const defaultLoanId = customerLoans.length === 1 ? customerLoans[0].id : "none";

  const [loanId, setLoanId] = useState(defaultLoanId);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<SelectedFileMeta | null>(null);

  const [errors, setErrors] = useState<{ subject?: string; message?: string; form?: string }>({});
  const [isPending, startTransition] = useTransition();

  const isFormValid =
    subject.trim().length >= 3 &&
    subject.trim().length <= 100 &&
    message.trim().length >= 10 &&
    message.trim().length <= 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { subject?: string; message?: string; form?: string } = {};

    if (!subject.trim() || subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters.";
    } else if (subject.trim().length > 100) {
      newErrors.subject = "Subject cannot exceed 100 characters.";
    }

    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (message.trim().length > 1000) {
      newErrors.message = "Message cannot exceed 1000 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      const res = await submitSupportRequest({
        idempotencyKey,
        loanId: loanId === "none" ? undefined : loanId,
        subject: subject.trim(),
        message: message.trim(),
        attachmentMeta: attachment || undefined,
      });

      if (!res.success || !res.request) {
        setErrors({ form: res.error || "Failed to submit support request. You can retry." });
        return;
      }

      showToast(`Request ${res.request.id} submitted. We'll get back to you soon.`, "success");

      // Reset form and regenerate idempotency key for subsequent request
      setSubject("");
      setMessage("");
      setAttachment(null);
      setLoanId(defaultLoanId);
      setIdempotencyKey(`idemp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

      onRequestSubmitted(res.request);
    });
  };

  const messageLength = message.length;

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-5">
      {/* Form Error Banner with Retry */}
      {errors.form && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between text-xs text-[#B91C1C]"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E5252A]" />
            <span className="font-semibold">{errors.form}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="text-xs font-bold text-[#1F6BFF] hover:underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Related loan select */}
        <FormField
          label="Related loan"
          optional
          requiredMarker="none"
          htmlFor="support-loan-id"
        >
          <div className="relative">
            <select
              id="support-loan-id"
              value={loanId}
              onChange={(e) => setLoanId(e.target.value)}
              className="w-full h-14 pl-4 pr-10 text-base rounded-xl border border-[#D9E1EC] bg-white appearance-none text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
            >
              {customerLoans.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id}
                </option>
              ))}
              <option value="none">No related loan</option>
            </select>
            <ChevronDown
              className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </FormField>

        {/* Subject */}
        <FormField
          label="Subject"
          required
          requiredMarker="none"
          htmlFor="support-subject"
          error={errors.subject}
        >
          <input
            id="support-subject"
            type="text"
            required
            aria-required="true"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
            }}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "support-subject-error" : undefined}
            className={`w-full h-14 px-4 text-base rounded-xl border bg-white text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
              errors.subject ? "border-[#E5252A]" : "border-[#D9E1EC]"
            }`}
          />
        </FormField>

        {/* Message */}
        <FormField
          label="Message"
          required
          requiredMarker="none"
          htmlFor="support-message"
          error={errors.message}
        >
          <div className="space-y-1">
            <textarea
              id="support-message"
              rows={5}
              required
              aria-required="true"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "support-message-error" : "support-char-count"}
              className={`w-full p-4 text-base rounded-xl border bg-white text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] resize-none ${
                errors.message ? "border-[#E5252A]" : "border-[#D9E1EC]"
              }`}
            />
            <div className="flex justify-end text-xs text-[#94A3B8]" id="support-char-count">
              <span>{messageLength} / 1000</span>
            </div>
          </div>
        </FormField>

        {/* Attachment FileInput */}
        <FormField
          label="Attachment"
          optional
          requiredMarker="none"
          htmlFor="support-attachment-file"
        >
          <FileInput
            id="support-attachment-file"
            value={attachment}
            onChange={setAttachment}
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            maxSizeMb={5}
          />
        </FormField>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid || isPending}
            aria-describedby="support-submit-hint"
            className="w-full h-12 rounded-xl bg-[#1F6BFF] hover:bg-[#1549B8] active:bg-[#0F3894] text-white font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] focus:ring-offset-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Submitting request...</span>
              </>
            ) : (
              <span>Submit request</span>
            )}
          </button>
          {!isFormValid && (
            <p id="support-submit-hint" className="text-[11px] text-[#94A3B8] text-center mt-1.5">
              Please enter a valid subject (3-100 chars) and message (10-1000 chars) to submit.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

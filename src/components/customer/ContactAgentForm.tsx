"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Phone, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { submitSupportRequest } from "@/lib/mockApi";
import type { SupportMeta } from "@/data/mockSupport";

interface ContactAgentFormProps {
  agentFirstName?: string;
  area?: string;
  loans: { id: string; label: string }[];
  officePhone?: string;
}

export function ContactAgentForm({
  agentFirstName = "Selvam",
  area = "Anna Nagar",
  loans,
  officePhone,
}: ContactAgentFormProps) {
  const router = useRouter();
  const [loanId, setLoanId] = useState<string>("none");
  const [preferredTime, setPreferredTime] = useState<"morning" | "afternoon" | "evening">("morning");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const meta: SupportMeta = { preferredTime };
      const res = await submitSupportRequest({
        kind: "callback",
        loanId: loanId !== "none" ? loanId : undefined,
        meta,
        message: message.trim() || undefined,
      });

      if (!res.success) {
        showToast(res.error || "Failed to submit call back request", "error");
        return;
      }

      showToast(`Request ${res.request?.id || "SR-003"} submitted. We'll arrange a call back.`, "success");
      router.push("/customer/profile");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Agent Info Card */}
      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Assigned Field Agent
            </span>
            <span className="block text-xl font-bold text-[#0B1B3F] mt-0.5">
              {agentFirstName}
            </span>
            <span className="block text-xs font-medium text-[#64748B] mt-0.5">
              Route: {area}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#334155] leading-relaxed pt-2 border-t border-[#EEF2F6]">
          Your agent visits your area to collect instalments. Ask for a call back and we will pass your request on.
        </p>
      </div>

      {/* Request Call Back Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Related Loan (optional) */}
        <div className="space-y-2">
          <label htmlFor="field-callback-loan" className="block text-sm font-semibold text-[#0B1B3F]">
            Related loan (optional)
          </label>
          <select
            id="field-callback-loan"
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            className="w-full h-12 px-4 text-base rounded-xl bg-white border border-[#D9E1EC] transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
          >
            <option value="none">No specific loan</option>
            {loans.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Time */}
        <div className="space-y-2">
          <label htmlFor="field-callback-time" className="block text-sm font-semibold text-[#0B1B3F]">
            Preferred time
          </label>
          <select
            id="field-callback-time"
            value={preferredTime}
            onChange={(e) =>
              setPreferredTime(e.target.value as "morning" | "afternoon" | "evening")
            }
            className="w-full h-12 px-4 text-base rounded-xl bg-white border border-[#D9E1EC] transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer capitalize"
          >
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
            <option value="evening">Evening (4 PM - 7 PM)</option>
          </select>
        </div>

        {/* Message (optional, max 300) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="field-callback-message" className="block text-sm font-semibold text-[#0B1B3F]">
              Message (optional)
            </label>
            <span className="text-xs text-[#64748B] tabular-nums">
              {message.length}/300
            </span>
          </div>
          <textarea
            id="field-callback-message"
            rows={4}
            maxLength={300}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add any specific questions or timing notes"
            className="w-full p-4 text-base rounded-xl bg-white border border-[#D9E1EC] transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF]"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-full sm:w-auto px-8 h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Request a call back</span>
          </Button>
        </div>
      </form>

      {/* Office phone line if available */}
      {officePhone && (
        <div className="p-4 rounded-xl bg-white border border-[#E6ECF5] text-sm text-[#64748B] flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#1F6BFF] shrink-0" />
          <span>
            Or call the office:{" "}
            <a
              href={`tel:${officePhone.replace(/\s+/g, "")}`}
              className="font-bold text-[#1F6BFF] hover:underline"
            >
              {officePhone}
            </a>
          </span>
        </div>
      )}
    </div>
  );
}

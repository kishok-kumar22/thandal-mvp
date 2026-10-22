"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { submitSupportRequest } from "@/lib/mockApi";
import type { SupportMeta } from "@/data/mockSupport";

export function CorrectionForm() {
  const router = useRouter();
  const [field, setField] = useState<"name" | "mobile" | "address" | "other">("name");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 10) {
      setError("Please provide at least 10 characters detailing the correction.");
      return;
    }
    if (trimmed.length > 500) {
      setError("Correction details cannot exceed 500 characters.");
      return;
    }

    startTransition(async () => {
      const meta: SupportMeta = { field };
      const res = await submitSupportRequest({
        kind: "profile_correction",
        meta,
        message: trimmed,
      });

      if (!res.success) {
        showToast(res.error || "Failed to submit correction request", "error");
        return;
      }

      showToast(`Request ${res.request?.id || "SR-002"} submitted. We'll review it soon.`, "success");
      router.push("/customer/profile");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Field Select */}
        <div className="space-y-2">
          <label htmlFor="field-correction-type" className="block text-sm font-semibold text-[#0B1B3F]">
            What needs correcting? <span className="text-red-500">*</span>
          </label>
          <select
            id="field-correction-type"
            value={field}
            onChange={(e) => setField(e.target.value as "name" | "mobile" | "address" | "other")}
            className="w-full h-12 px-4 text-base rounded-xl bg-white border border-[#D9E1EC] transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] cursor-pointer"
          >
            <option value="name">Name</option>
            <option value="mobile">Mobile number</option>
            <option value="address">Address</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="field-correction-details" className="block text-sm font-semibold text-[#0B1B3F]">
              Correct details <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-[#64748B] tabular-nums">
              {message.length}/500
            </span>
          </div>
          <textarea
            id="field-correction-details"
            rows={5}
            maxLength={500}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter the correct information"
            aria-required="true"
            className="w-full p-4 text-base rounded-xl bg-white border border-[#D9E1EC] transition-all text-[#0B1B3F] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF]"
          />
        </div>

        <InfoPanel variant="info">
          Your details change only after an administrator approves the request.
        </InfoPanel>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || message.trim().length < 10}
          className="w-full sm:w-auto px-8 h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          <span>Submit request</span>
        </Button>
      </div>
    </form>
  );
}

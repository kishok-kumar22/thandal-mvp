"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { MakePaymentModal } from "./MakePaymentModal";
import type { NextDueInfo } from "@/lib/loanOverview";

interface HowDoIPayTriggerProps {
  nextDue: NextDueInfo | null;
  agentFirstName?: string;
  businessPhone?: string;
}

export function HowDoIPayTrigger({
  nextDue,
  agentFirstName = "Selvam",
  businessPhone,
}: HowDoIPayTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!nextDue) return null;

  return (
    <>
      <div className="flex justify-end pt-1 px-1">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-xs font-semibold text-[#64748B] hover:text-[#1F6BFF] underline underline-offset-2 transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How do I pay?</span>
        </button>
      </div>

      <MakePaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        nextDue={nextDue}
        agentFirstName={agentFirstName}
        businessPhone={businessPhone}
      />
    </>
  );
}

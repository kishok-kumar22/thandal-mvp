"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { MakePaymentModal } from "./MakePaymentModal";
import type { NextDueInfo } from "@/lib/loanOverview";

interface MakePaymentTriggerProps {
  nextDue: NextDueInfo | null;
  agentFirstName?: string;
  businessPhone?: string;
}

export function MakePaymentTrigger({
  nextDue,
  agentFirstName = "Selvam",
  businessPhone,
}: MakePaymentTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#1F6BFF] hover:bg-[#1A5BD8] text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer"
      >
        <span>Make a Payment</span>
        <ArrowRight className="w-4 h-4 shrink-0" />
      </button>

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

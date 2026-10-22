"use client";

import React from "react";
import Link from "next/link";
import { Phone, Headset, ShieldCheck, Calendar, IndianRupee } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";
import type { NextDueInfo } from "@/lib/loanOverview";

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextDue: NextDueInfo | null;
  agentFirstName?: string;
  businessPhone?: string;
}

/**
 * PRODUCTION INTEGRATION POINT:
 * Online payment gateways (Razorpay, Cashfree, PayU, or NPCI UPI Deep Links)
 * can be plugged in here to initialize checkout orders and trigger dynamic UPI intents.
 */
export function MakePaymentModal({
  isOpen,
  onClose,
  nextDue,
  agentFirstName = "Selvam",
  businessPhone = "+91 98765 43210",
}: MakePaymentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to pay your instalment" maxWidth="md">
      <div className="p-6 space-y-6">
        {/* Next Due Snapshot */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Current Due
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0B1B3F]">
                {nextDue ? formatINR(nextDue.amount) : "₹0"}
              </span>
              {nextDue?.isPartial && (
                <span className="text-xs font-semibold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                  Part paid balance
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
              Due Date
            </span>
            <span className="mt-1 text-sm font-bold text-[#0B1B3F] flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5 text-[#1F6BFF]" />
              {nextDue ? nextDue.dueOn : "No payment due"}
            </span>
          </div>
        </div>

        {/* In-Person Agent Payment Guidance */}
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-sm text-[#334155] leading-relaxed">
              <p className="font-semibold text-[#0B1B3F]">In-person collection by agent</p>
              <p className="mt-1 text-[#64748B]">
                Pay your instalment to your collection agent, <span className="font-semibold text-[#0B1B3F]">{agentFirstName}</span>.
                Your payment appears here immediately after the agent records it and a digital receipt is issued.
              </p>
            </div>
          </div>
        </div>

        {/* Business Office & Support Contacts */}
        <div className="border-t border-[#EEF2F6] pt-4 space-y-3">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block">
            Questions or urgent visit request?
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`tel:${businessPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1F6BFF] hover:bg-[#F8FAFC] transition-colors text-sm font-semibold text-[#0B1B3F]"
            >
              <Phone className="w-4 h-4 text-[#1F6BFF] shrink-0" />
              <span className="truncate">{businessPhone}</span>
            </a>
            <Link
              href="/customer/support"
              onClick={onClose}
              className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1F6BFF] hover:bg-[#F8FAFC] transition-colors text-sm font-semibold text-[#0B1B3F]"
            >
              <Headset className="w-4 h-4 text-[#1F6BFF] shrink-0" />
              <span>Contact support</span>
            </Link>
          </div>
        </div>

        {/* Modal Close Action */}
        <div className="pt-2">
          <Button variant="primary" onClick={onClose} className="w-full h-12 rounded-xl font-semibold">
            Understood
          </Button>
        </div>
      </div>
    </Modal>
  );
}

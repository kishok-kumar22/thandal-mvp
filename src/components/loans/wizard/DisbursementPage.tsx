"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, User, Wallet, Calendar, AlertCircle } from "lucide-react";
import { useLoanDraft, defaultLoanDraft } from "./LoanDraftContext";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Toast } from "@/components/ui/Toast";
import { mockCustomersList } from "@/data/mockCustomers";
import { calculateLoan, buildSchedule, type PaymentMethod } from "@/lib/loan";
import { formatINR, formatNumberIN } from "@/lib/format";
import { maskMobile } from "@/lib/mask";
import { confirmDisbursement } from "@/lib/mockApi";

export function DisbursementPage() {
  const router = useRouter();
  const { draft, updateDraft, clearDraft } = useLoanDraft();

  const activeDraft = draft.customerId && draft.principal ? draft : defaultLoanDraft;
  const customer =
    mockCustomersList.find((c) => c.id === activeDraft.customerId) || mockCustomersList[0];

  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const calc = calculateLoan({
    principal: activeDraft.principal,
    ratePercent: activeDraft.ratePercent,
    term: activeDraft.term,
    frequency: activeDraft.frequency,
    collectFirstAtDisbursement: activeDraft.collectFirstAtDisbursement,
  });

  const fullSchedule = buildSchedule({
    principal: activeDraft.principal,
    ratePercent: activeDraft.ratePercent,
    term: activeDraft.term,
    frequency: activeDraft.frequency,
    firstDueDate: activeDraft.firstDueDate,
    collectFirstAtDisbursement: activeDraft.collectFirstAtDisbursement,
  });

  const firstThreeInstalments = fullSchedule.slice(0, 3);

  const handleConfirm = async () => {
    if (!acknowledged || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await confirmDisbursement(activeDraft);
      if (res.success) {
        clearDraft();
        setToastMessage(`Loan ${res.loanId} created and disbursed successfully`);
        setToastOpen(true);
        setTimeout(() => {
          router.push(`/admin/loans/${res.loanId}`);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-6 items-start">
        {/* Left Column: Borrower Card + First 3 instalments */}
        <div className="space-y-6">
          {/* Borrower Card */}
          <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-[#0B1B3F]">
              <User className="w-5 h-5 text-[#1F6BFF]" />
              <h2 className="text-base font-bold">Borrower details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-[#64748B] block">Customer Name</span>
                <span className="font-semibold text-[#0B1B3F]">
                  {customer.name} ({customer.id})
                </span>
              </div>

              <div>
                <span className="text-xs text-[#64748B] block">Mobile Number</span>
                <span className="font-semibold text-[#0B1B3F] tabular-nums">
                  {maskMobile(customer.mobile, "stars")}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-[#64748B] block">Current Address</span>
                <span className="font-medium text-[#334155]">{customer.currentAddress}</span>
              </div>

              <div>
                <span className="text-xs text-[#64748B] block">Assigned Collection Agent</span>
                <span className="font-semibold text-[#0B1B3F]">
                  {activeDraft.agentId || customer.assignedAgent || "Selvam"}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#64748B] block">Penalty Policy</span>
                <span className="font-semibold text-[#0B1B3F] capitalize">
                  {activeDraft.penaltyPolicy}
                </span>
              </div>
            </div>
          </div>

          {/* First 3 instalments preview */}
          <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0B1B3F]">
                Upcoming instalments (preview)
              </h3>
              <span className="text-xs text-[#64748B]">
                Showing first 3 of {activeDraft.term}
              </span>
            </div>

            <div className="border border-[#E6ECF5] rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-[#64748B]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">Due date</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6ECF5]">
                  {firstThreeInstalments.map((inst) => (
                    <tr key={inst.instalmentNumber} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 px-3 font-medium text-[#64748B]">
                        {inst.instalmentNumber}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#0B1B3F]">
                        {inst.dueDate}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#0B1B3F] text-right tabular-nums">
                        ₹{formatNumberIN(inst.amount)}
                      </td>
                      <td className="py-2.5 px-3">
                        {inst.status === "Paid at disbursement" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Paid at disbursement
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown + Payment Method + Acknowledgement */}
        <div className="space-y-6">
          {/* Disbursement Breakdown */}
          <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-[#0B1B3F]">
              <Wallet className="w-5 h-5 text-[#1F6BFF]" />
              <h2 className="text-base font-bold">Disbursement breakdown</h2>
            </div>

            <div className="space-y-3 bg-[#F3F6FB] rounded-xl p-4 border border-[#E2E8F0]/60">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">Principal amount</span>
                <span className="font-bold text-[#0B1B3F] tabular-nums">
                  {formatINR(calc.principal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748B]">
                  First instalment ({activeDraft.collectFirstAtDisbursement ? "withheld" : "not withheld"})
                </span>
                <span className="font-bold text-[#0B1B3F] tabular-nums">
                  {activeDraft.collectFirstAtDisbursement
                    ? `- ${formatINR(calc.firstInstalmentWithheld)}`
                    : "₹0"}
                </span>
              </div>

              <div className="border-t border-[#CBD5E1]" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0B1B3F]">Net cash released</span>
                <span className="text-lg font-extrabold text-[#1F6BFF] tabular-nums">
                  {formatINR(calc.netCash)}
                </span>
              </div>

              <div className="border-t border-[#CBD5E1]" />

              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Remaining balance</span>
                <span className="font-bold text-[#0B1B3F] tabular-nums">
                  {formatINR(calc.remainingToCollect)}
                </span>
              </div>
            </div>
          </div>

          {/* Disbursement Details Form */}
          <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0B1B3F]">Payment release details</h3>

            <div>
              <label
                htmlFor="disburse-method"
                className="block text-xs font-semibold text-[#0B1B3F] mb-1.5"
              >
                Payment method *
              </label>
              <select
                id="disburse-method"
                value={activeDraft.paymentMethod}
                onChange={(e) =>
                  updateDraft({ paymentMethod: e.target.value as PaymentMethod })
                }
                className="w-full h-10 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF] cursor-pointer"
              >
                <option value="cash">Cash in hand</option>
                <option value="bank_transfer">Bank transfer (NEFT/IMPS)</option>
                <option value="upi">UPI transfer</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="disburse-date"
                className="block text-xs font-semibold text-[#0B1B3F] mb-1.5"
              >
                Disbursement date *
              </label>
              <input
                id="disburse-date"
                type="date"
                value={activeDraft.disbursementDate}
                onChange={(e) => updateDraft({ disbursementDate: e.target.value })}
                className="w-full h-10 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF]"
              />
            </div>

            <div>
              <label
                htmlFor="disburse-ref"
                className="block text-xs font-semibold text-[#0B1B3F] mb-1.5"
              >
                Reference / Voucher # (optional)
              </label>
              <input
                id="disburse-ref"
                type="text"
                value={activeDraft.reference}
                onChange={(e) => updateDraft({ reference: e.target.value })}
                placeholder="e.g. VCH-99201"
                className="w-full h-10 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#0B1B3F] focus:outline-none focus:border-[#1F6BFF]"
              />
            </div>

            {/* Preview notice banner */}
            <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-xs text-[#1D4ED8] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                This will disburse <strong>{formatINR(calc.netCash)}</strong> to{" "}
                <strong>{customer.name}</strong>. First repayment due on{" "}
                <strong>{activeDraft.firstDueDate}</strong>.
              </span>
            </div>

            {/* Acknowledgement Checkbox */}
            <div className="pt-2">
              <Checkbox
                id="disburse-ack"
                checked={acknowledged}
                onChange={setAcknowledged}
                label="I confirm that the cash/transfer has been handed over to the borrower and loan terms are acknowledged."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div
        className="fixed bottom-0 sm:bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6ECF5] py-3.5 px-4 sm:px-8 shadow-lg"
        style={{
          bottom: "var(--bottom-nav-h, 0px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/admin/loans/new/schedule" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full sm:w-auto px-6 flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to schedule
            </Button>
          </Link>

          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={!acknowledged || isSubmitting}
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6"
          >
            {isSubmitting ? "Processing disbursement..." : "Confirm & Disburse"}
          </Button>
        </div>
      </div>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type="success"
      />
    </div>
  );
}

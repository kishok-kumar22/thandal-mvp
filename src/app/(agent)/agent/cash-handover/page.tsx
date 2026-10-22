import React from "react";
import { getCurrentUser } from "@/lib/session";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { SubmitHandoverForm } from "@/components/handover/SubmitHandoverForm";
import { getOpeningCash, getCashSummary, getAvailableForHandover } from "@/lib/cashbook";
import { mockHandoversList } from "@/data/mockHandovers";

export const metadata = {
  title: "Submit Cash Handover - THANDAL",
  description: "Record physical cash handover amount to designated branch or vault recipient.",
};

export const instant = false;

export default async function AgentCashHandoverPage() {
  const currentUser = await getCurrentUser();

  // Non-agent users get AccessDenied
  if (!currentUser || currentUser.role !== "agent") {
    return (
      <AccessDenied
        message="Agent Portal Access Only"
        description="The cash handover submission flow is restricted to field collection agents."
        backHref="/admin/overview"
        backLabel="Go to Admin Overview"
      />
    );
  }

  const agentId = currentUser.agentId || "A-001";
  const agentName = currentUser.name || "Selvam";
  const targetDate = "2026-10-22";

  // Derive cash numbers dynamically
  const openingCash = getOpeningCash(agentId, targetDate);
  const summary = getCashSummary({ date: targetDate, agentId });
  const availableCash = getAvailableForHandover(agentId, targetDate);

  // Pending review sum
  const pendingHandovers = mockHandoversList.filter(
    (h) => h.agentId === agentId && h.status === "pending_review"
  );
  const pendingReviewAmount = pendingHandovers.reduce((sum, h) => sum + h.reportedAmount, 0);

  // Agent's handovers history
  const agentHandovers = mockHandoversList.filter((h) => h.agentId === agentId);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 lg:pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3F] tracking-tight">
          Submit cash handover
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Record the amount you are handing over to the designated recipient.
        </p>
      </div>

      {/* Main Handover Interface */}
      <SubmitHandoverForm
        agentName={agentName}
        openingCash={openingCash}
        cashCollected={summary.cashReceived}
        acceptedHandovers={summary.acceptedHandovers}
        pendingReview={pendingReviewAmount}
        availableCash={availableCash}
        handovers={agentHandovers}
      />
    </div>
  );
}

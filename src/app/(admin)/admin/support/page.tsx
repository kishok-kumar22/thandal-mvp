import React from "react";
import { requireRole } from "@/lib/session";
import { can } from "@/lib/permissions";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { getSupportRequests } from "@/lib/mockApi";
import { SupportInboxTable } from "@/components/support/SupportInboxTable";

export const metadata = {
  title: "Support Inbox - Administration | THANDAL",
  description: "Review and manage borrower support tickets and queries.",
};

export default async function AdminSupportInboxPage() {
  const user = await requireRole("admin", "/admin/support");

  if (!can(user, "manage_support")) {
    return (
      <AccessDenied
        message="Administration Access Only"
        description="Support inbox management is restricted to authorized administrative users."
        backHref="/admin/overview"
        backLabel="Return to Overview"
      />
    );
  }

  const requests = getSupportRequests();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight">
          Support inbox
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Review customer inquiries, payment dispute attachments, and update ticket statuses.
        </p>
      </div>

      <SupportInboxTable initialRequests={requests} />
    </div>
  );
}

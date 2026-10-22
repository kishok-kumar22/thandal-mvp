import React, { Suspense } from "react";
import { mockAuditEntriesList } from "@/data/mockAudit";
import { filterAuditEntries, getDistinctActors } from "@/lib/audit";
import { AuditLogTabClient } from "@/components/audit/AuditLogTabClient";
import { SettingsHeader } from "@/components/settings/SettingsHeader";

interface AuditLogPageProps {
  searchParams?: Promise<{
    user?: string;
    action?: string;
    range?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

async function AuditLogContent({
  searchParamsPromise,
}: {
  searchParamsPromise?: AuditLogPageProps["searchParams"];
}) {
  const searchParams = searchParamsPromise ? await searchParamsPromise : {};
  const distinctUsers = getDistinctActors(mockAuditEntriesList);
  const filtered = filterAuditEntries(mockAuditEntriesList, searchParams);
  const pageNum = parseInt(searchParams.page || "1", 10) || 1;

  return (
    <AuditLogTabClient
      entries={filtered}
      distinctUsers={distinctUsers}
      currentPage={pageNum}
    />
  );
}

export default function SettingsAuditLogPage(props: AuditLogPageProps) {
  return (
    <div className="space-y-6">
      <SettingsHeader
        title="Settings"
        subtitle="Read-only chronological trail of administrative and financial audit events."
      />
      <Suspense
        fallback={
          <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground animate-pulse">
            Loading audit logs...
          </div>
        }
      >
        <AuditLogContent searchParamsPromise={props.searchParams} />
      </Suspense>
    </div>
  );
}

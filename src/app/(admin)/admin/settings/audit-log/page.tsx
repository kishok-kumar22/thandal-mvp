import React from "react";
import { mockAuditEntriesList } from "@/data/mockAudit";
import { filterAuditEntries, getDistinctActors } from "@/lib/audit";
import { AuditLogTabClient } from "@/components/audit/AuditLogTabClient";

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

export default async function SettingsAuditLogPage(props: AuditLogPageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
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

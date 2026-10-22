"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { AuditEntry } from "@/data/mockAudit";
import { AUDIT_ACTION_LABELS } from "@/data/mockAudit";
import { formatDateTime24 } from "@/lib/dates";
import { formatActor } from "@/lib/audit";
import { buildCsvString, downloadCsv } from "@/lib/csv";
import { logAuditExport } from "@/lib/mockApi";

interface ExportAuditButtonProps {
  entries: AuditEntry[];
  filename?: string;
}

export function ExportAuditButton({
  entries,
  filename = "audit-log_2026-10-22.csv",
}: ExportAuditButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const header = ["Log ID", "Date & Time", "Action", "Details", "Actor Name", "Actor Role", "Entity Type", "Entity ID"];
      const dataRows = entries.map((e) => [
        e.id,
        formatDateTime24(e.at),
        AUDIT_ACTION_LABELS[e.action] || e.action,
        e.details,
        formatActor(e),
        e.actorRole,
        e.entityType,
        e.entityId,
      ]);

      const csvContent = buildCsvString([header, ...dataRows]);
      downloadCsv(filename, csvContent);

      // Log append-only audit entry
      await logAuditExport();
    } catch (err) {
      console.error("Failed to export audit log:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#1F6BFF] hover:bg-[#EAF1FE] border border-[#1F6BFF] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
    >
      {isExporting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      <span>Export CSV</span>
    </button>
  );
}

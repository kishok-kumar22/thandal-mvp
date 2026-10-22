"use client";

import React, { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { buildCsvString, downloadCsv } from "@/lib/csv";
import { logReportExport } from "@/lib/mockApi";

interface ReportActionsProps {
  reportName: string;
  from: string;
  to: string;
  branch?: string;
  agent?: string;
  csvHeader: string[];
  csvRows: (string | number)[][];
  filenamePrefix?: string;
}

export function ReportActions({
  reportName,
  from,
  to,
  branch = "All",
  agent = "All",
  csvHeader,
  csvRows,
  filenamePrefix = "collection-summary",
}: ReportActionsProps) {
  const [isExportingCsv, setIsExportingCsv] = useState(false);

  const handleExportCsv = async () => {
    setIsExportingCsv(true);
    try {
      const metadataRows = [
        ["Report", reportName],
        ["Period", `${from} to ${to}`],
        ["Branch", branch || "All"],
        ["Agent", agent || "All"],
        ["Generated At", "2026-10-22 10:30 Asia/Kolkata"],
        [], // blank row before table
      ];

      const fullRows = [...metadataRows, csvHeader, ...csvRows];
      const csvContent = buildCsvString(fullRows);
      const filename = `${filenamePrefix}_${from}_${to}.csv`;
      downloadCsv(filename, csvContent);

      // Append audit log entry
      await logReportExport({ report: reportName, from, to });
    } catch (err) {
      console.error("Failed to export CSV:", err);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handlePrintPdf = () => {
    // Audit export
    logReportExport({ report: reportName, from, to });

    /**
     * NOTE: Client uses browser native print dialog with print stylesheet.
     * In a production deployment with high-fidelity server PDF requirements,
     * integrate headless Chromium (Puppeteer / Playwright) or @react-pdf/renderer
     * via an authenticated API endpoint /api/reports/pdf.
     */
    window.print();
  };

  return (
    <div className="flex items-center gap-3 w-full sm:w-auto">
      {/* Export CSV (outline blue) */}
      <button
        type="button"
        onClick={handleExportCsv}
        disabled={isExportingCsv}
        className="flex-1 sm:flex-initial h-10 px-4 inline-flex items-center justify-center gap-2 text-xs font-bold text-[#1F6BFF] hover:bg-[#EAF1FE] border border-[#1F6BFF] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
      >
        {isExportingCsv ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span>Export CSV</span>
      </button>

      {/* Download PDF (solid blue) */}
      <button
        type="button"
        onClick={handlePrintPdf}
        title="Choose 'Save as PDF' in the print dialog"
        className="flex-1 sm:flex-initial h-10 px-4 inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#1F6BFF] hover:bg-[#1A5CD6] rounded-xl shadow-sm transition-colors cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Download PDF</span>
      </button>
    </div>
  );
}

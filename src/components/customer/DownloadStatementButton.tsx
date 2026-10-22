"use client";

import React, { useTransition } from "react";
import { Download, ArrowRight, Loader2 } from "lucide-react";
import { downloadStatementAction } from "@/app/(customer)/customer/actions";
import { downloadCsv } from "@/lib/csv";
import { showToast } from "@/components/ui/Toast";

interface DownloadStatementButtonProps {
  loanId: string;
  variant?: "primary" | "outline";
  showArrow?: boolean;
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export function DownloadStatementButton({
  loanId,
  variant = "outline",
  showArrow = false,
  label = "Download statement",
  ariaLabel,
  className = "",
}: DownloadStatementButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      const res = await downloadStatementAction(loanId);
      if (res.success && res.csvContent && res.filename) {
        downloadCsv(res.filename, res.csvContent);
        showToast("Statement downloaded successfully", "success");
      } else {
        showToast(res.error || "Failed to download statement", "error");
      }
    });
  };

  const isPrimary = variant === "primary";

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isPending}
      aria-label={ariaLabel || `Download statement for ${loanId}`}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
        isPrimary
          ? "bg-[#1F6BFF] hover:bg-[#1A5BD8] text-white shadow-xs"
          : "border border-[#1F6BFF] text-[#1F6BFF] hover:bg-[#EFF6FF]"
      } ${className}`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : showArrow ? (
        <>
          <span>{label}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </>
      ) : (
        <>
          <Download className="w-4 h-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
      {isPending && <span>Downloading...</span>}
    </button>
  );
}

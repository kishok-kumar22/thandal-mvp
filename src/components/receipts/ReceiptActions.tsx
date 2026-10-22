"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { Receipt } from "@/data/mockReceipts";
import { formatINR } from "@/lib/format";

interface ReceiptActionsProps {
  receipt: Receipt;
  role?: "admin" | "agent";
}

export function ReceiptActions({ receipt, role = "admin" }: ReceiptActionsProps) {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const dateObj = new Date(receipt.paidAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "22 Oct 2026";

  const shareText = `Payment receipt ${receipt.receiptNo}: ${formatINR(receipt.amount)} received on ${formattedDate}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${receipt.receiptNo} | THANDAL`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share cancelled or unsupported
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setToastMsg("Receipt details copied");
      setToastOpen(true);
    }
  };

  const handleDownload = () => {
    /**
     * Note for Production Architecture:
     * Server-side PDF generation (e.g., using headless Chromium or PDFKit API)
     * would be called here via: window.open(`/api/receipts/${receipt.receiptNo}/pdf`);
     * In client mock mode, we trigger native window.print() using the CSS @media print layout.
     */
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const backHref = role === "agent" ? "/agent/customers" : "/admin/collections";

  return (
    <div className="space-y-3 pt-2" data-no-print>
      {/* 1. Share button */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        onClick={handleShare}
        icon={<Share2 className="w-4.5 h-4.5" />}
        aria-label={`Share receipt ${receipt.receiptNo}`}
        className="w-full h-12 text-base font-semibold shadow-xs justify-center"
      >
        Share receipt
      </Button>

      {/* 2. Download / Print button */}
      <div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleDownload}
          icon={<Download className="w-4.5 h-4.5 text-[#1F6BFF]" />}
          aria-label={`Download receipt ${receipt.receiptNo} as PDF`}
          className="w-full h-12 text-base font-semibold justify-center text-[#1F6BFF] border-[#BFDBFE] hover:bg-[#F3F7FF]"
        >
          Download receipt
        </Button>
        <p className="text-[11px] text-[#64748B] text-center mt-1">
          Choose &ldquo;Save as PDF&rdquo; in the print dialog
        </p>
      </div>

      {/* 3. Back to collections */}
      <Link href={backHref} className="block">
        <Button
          type="button"
          variant="outline"
          size="lg"
          icon={<ArrowLeft className="w-4.5 h-4.5 text-[#1F6BFF]" />}
          aria-label="Back to collections"
          className="w-full h-12 text-base font-semibold justify-center text-[#1F6BFF] border-[#BFDBFE] hover:bg-[#F3F7FF]"
        >
          Back to collections
        </Button>
      </Link>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMsg}
        type="success"
      />
    </div>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { Receipt } from "@/data/mockReceipts";
import { ReceiptCard } from "./ReceiptCard";
import { ReceiptActions } from "./ReceiptActions";

interface ReceiptViewProps {
  receipt: Receipt;
  role?: "admin" | "agent" | "customer";
  backHref?: string;
}

export function ReceiptView({ receipt, role = "admin", backHref }: ReceiptViewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Focus page heading on load for screen-reader accessibility
    headingRef.current?.focus();
  }, []);

  const defaultBackHref =
    role === "customer"
      ? "/customer/receipts"
      : role === "agent"
      ? "/agent/customers"
      : "/admin/collections";

  const resolvedBackHref = backHref || defaultBackHref;
  const parentLabel =
    role === "customer"
      ? "My receipts"
      : role === "agent"
      ? "Customers"
      : "Collections";

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16">
      {/* Screen-reader announcement */}
      <div role="status" className="sr-only">
        Payment recorded successfully. Receipt {receipt.receiptNo} created.
      </div>

      {/* Breadcrumbs for Desktop (>=1024px) */}
      <nav
        aria-label="Breadcrumbs"
        className="hidden lg:flex items-center gap-2 text-xs font-medium text-[#64748B]"
        data-no-print
      >
        <Link href={resolvedBackHref} className="hover:text-[#1F6BFF] transition-colors">
          {parentLabel}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
        <span className="text-[#0B1B3F] font-semibold" aria-current="page">
          Receipt {receipt.receiptNo}
        </span>
      </nav>

      {/* Mobile Top Header Row */}
      <div className="flex items-center gap-3 lg:hidden" data-no-print>
        <Link
          href={resolvedBackHref}
          className="w-10 h-10 rounded-xl bg-white border border-[#E6ECF5] flex items-center justify-center text-[#0B1B3F] hover:bg-slate-50 transition-colors shadow-xs"
          aria-label={`Back to ${parentLabel}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl sm:text-[28px] font-bold text-[#0B1B3F] tracking-tight outline-none"
        >
          Payment receipt
        </h1>
      </div>

      {/* Desktop Heading (hidden on mobile) */}
      <div className="hidden lg:block" data-no-print>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-bold text-[#0B1B3F] tracking-tight outline-none"
        >
          Payment receipt
        </h1>
      </div>

      {/* The Printable Receipt Card */}
      <ReceiptCard receipt={receipt} />

      {/* Action Buttons */}
      <ReceiptActions receipt={receipt} role={role} backHref={resolvedBackHref} />
    </div>
  );
}

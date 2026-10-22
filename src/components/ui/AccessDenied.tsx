"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface AccessDeniedProps {
  message?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export function AccessDenied({
  message = "Access Denied",
  description = "You do not have administrative or authorized permissions to view this resource.",
  backHref = "/admin/overview",
  backLabel = "Return to Dashboard",
}: AccessDeniedProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#E5252A] mb-4 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-[#0B1B3F] mb-2">{message}</h2>
      <p className="text-sm text-[#64748B] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1F6BFF] hover:bg-[#1A5CD6] rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Link>
    </div>
  );
}

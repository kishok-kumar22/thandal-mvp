"use client";

import React from "react";
import { MessageSquareOff } from "lucide-react";
import type { SupportRequest, SupportKind } from "@/data/mockSupport";

interface MyRequestsListProps {
  requests: SupportRequest[];
}

export function MyRequestsList({ requests }: MyRequestsListProps) {
  const getStatusBadge = (status: SupportRequest["status"]) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            In progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const getKindText = (kind?: SupportKind) => {
    switch (kind) {
      case "callback":
        return "Call back";
      case "profile_correction":
        return "Profile correction";
      case "general":
      default:
        return "General";
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return iso.slice(0, 10);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6ECF5] p-5 sm:p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold text-[#0B1B3F]">Your requests</h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          History of support requests submitted from your account.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#E2E8F0] rounded-xl">
          <MessageSquareOff className="w-8 h-8 text-[#94A3B8] mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#0B1B3F]">No requests yet</p>
          <p className="text-xs text-[#64748B] mt-0.5 max-w-xs">
            Submit a query or report an issue using the contact form above.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (>=640px) */}
          <div className="hidden sm:block border border-[#E6ECF5] rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm" aria-label="Submitted support requests">
              <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
                <tr>
                  <th scope="col" className="py-3 px-4">
                    Request ID
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Type
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Subject
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 text-right">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF5]">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1F6BFF] whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-[#64748B] whitespace-nowrap">
                      {getKindText(req.kind)}
                    </td>
                    <td className="py-3 px-4 text-[#0B1B3F] font-medium max-w-[200px] truncate">
                      {req.subject}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-[#64748B] whitespace-nowrap">
                      {formatDate(req.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards (<640px) */}
          <div className="sm:hidden space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-[#E6ECF5] bg-slate-50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#1F6BFF]">
                      {req.id}
                    </span>
                    <span className="text-xs font-medium text-[#64748B]">
                      • {getKindText(req.kind)}
                    </span>
                  </div>
                  {getStatusBadge(req.status)}
                </div>
                <p className="text-sm font-semibold text-[#0B1B3F] truncate">
                  {req.subject}
                </p>
                <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                  <span>{req.loanId || "General query"}</span>
                  <span>{formatDate(req.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

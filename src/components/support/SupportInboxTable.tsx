"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquareOff, Eye } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { SupportRequestModal } from "./SupportRequestModal";
import type { SupportRequest, SupportStatus } from "@/data/mockSupport";

interface SupportInboxTableProps {
  initialRequests: SupportRequest[];
}

export function SupportInboxTable({ initialRequests }: SupportInboxTableProps) {
  const [requests, setRequests] = useState<SupportRequest[]>(initialRequests);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRequest, setActiveRequest] = useState<SupportRequest | null>(null);

  const filtered = requests.filter((r) => {
    if (selectedStatus !== "all" && r.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pagedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleStatusUpdated = (id: string, newStatus: SupportStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const getStatusBadge = (status: SupportStatus) => {
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

  return (
    <div className="space-y-4">
      {/* Detail Modal */}
      <SupportRequestModal
        request={activeRequest}
        isOpen={Boolean(activeRequest)}
        onClose={() => setActiveRequest(null)}
        onStatusUpdated={handleStatusUpdated}
      />

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="support-status-filter" className="text-xs font-semibold text-[#64748B]">
            Status:
          </label>
          <select
            id="support-status-filter"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 text-sm rounded-lg border border-[#D9E1EC] bg-white text-[#0B1B3F] font-semibold cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <span className="text-xs text-[#64748B] font-medium">
          Showing {filtered.length} request{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-[#E6ECF5] text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#E8F0FE] flex items-center justify-center text-[#1F6BFF] mb-4">
            <MessageSquareOff className="w-8 h-8" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold text-[#0B1B3F]">No support requests</h3>
          <p className="text-sm text-[#64748B] mt-1 max-w-sm">
            Borrower support queries and disputes will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6ECF5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Support requests inbox">
              <thead className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
                <tr>
                  <th scope="col" className="py-3.5 px-4">
                    SR ID
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Customer
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Loan
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Subject
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Status
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Date
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF5]">
                {pagedItems.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1F6BFF] whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Link
                        href={`/admin/customers/${req.customerId}`}
                        className="font-bold text-[#0B1B3F] hover:text-[#1F6BFF] hover:underline"
                      >
                        {req.customerName || req.customerId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] font-medium whitespace-nowrap">
                      {req.loanId || "None"}
                    </td>
                    <td className="py-3.5 px-4 text-[#0B1B3F] font-medium max-w-[220px] truncate">
                      {req.subject}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-xs whitespace-nowrap">
                      {req.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveRequest(req)}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#1F6BFF]" />
                        <span>Open</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-[#E6ECF5]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

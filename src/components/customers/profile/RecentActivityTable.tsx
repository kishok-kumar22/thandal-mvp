"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatINR } from "@/lib/format";
import type { Activity } from "@/data/mockCustomers";

interface RecentActivityTableProps {
  activities?: Activity[];
}

export function RecentActivityTable({ activities = [] }: RecentActivityTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<Activity | null>(null);

  return (
    <>
      <Card className="p-6 rounded-xl border border-[#E6ECF5]">
        <h2 className="text-base font-bold text-[#0B1B3F] mb-4">Recent activity</h2>

        {activities.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#64748B]">
            No activity yet.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-sm border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-y border-[#E6ECF5]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6ECF5]">
                {activities.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 text-xs text-[#0B1B3F] whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="py-3.5 px-3 text-xs font-medium text-[#0B1B3F]">
                      {item.description}
                    </td>

                    <td className="py-3.5 px-3 text-xs font-bold text-[#0B1B3F]">
                      {formatINR(item.amount)}
                    </td>

                    <td className="py-3.5 px-3">
                      <Badge variant={item.type} />
                    </td>

                    <td className="py-3.5 px-3 text-xs font-mono text-[#64748B]">
                      {item.reference}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href={`/admin/loans/${item.reference}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs px-2.5"
                            icon={<ExternalLink className="w-3 h-3" />}
                          >
                            View loan
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2.5"
                          icon={<FileText className="w-3 h-3" />}
                          onClick={() => setSelectedReceipt(item)}
                        >
                          View receipt
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Receipt Modal */}
      <Modal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        title={`Payment Receipt: ${selectedReceipt?.reference}`}
        maxWidth="md"
      >
        {selectedReceipt && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-[#E6ECF5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Receipt Number:</span>
                <span className="font-bold text-[#0B1B3F] font-mono">
                  RCP-{selectedReceipt.id.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date & Time:</span>
                <span className="font-medium text-[#0B1B3F]">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Loan Account:</span>
                <span className="font-bold text-[#1F6BFF] font-mono">
                  {selectedReceipt.reference}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#CBD5E1] pt-2">
                <span className="font-bold text-[#0B1B3F]">Amount Collected:</span>
                <span className="font-extrabold text-[#0B1B3F] text-sm">
                  {formatINR(selectedReceipt.amount)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#15803D] bg-green-50 p-2.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Verified and deposited to daily collection register.</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedReceipt(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

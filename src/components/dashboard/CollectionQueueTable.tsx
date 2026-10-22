import React from "react";
import Link from "next/link";
import { List } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatINR } from "@/lib/format";
import type { QueueItem } from "@/data/mock";

interface CollectionQueueTableProps {
  items: QueueItem[];
  totalScheduled: number;
}

export function CollectionQueueTable({ items, totalScheduled }: CollectionQueueTableProps) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-[#1F6BFF]" />
          <h3 className="font-bold text-[#0B1B3F] text-base">Today&apos;s collection queue</h3>
        </div>
        <Link
          href="/admin/collections"
          className="text-xs font-semibold text-[#1F6BFF] hover:underline inline-flex items-center gap-0.5"
        >
          View all &gt;
        </Link>
      </div>

      {/* Table container with horizontal scroll for mobile */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-sm border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-y border-[#E6ECF5]">
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Loan</th>
              <th className="py-2.5 px-3">Due</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6ECF5]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3 font-medium text-[#0B1B3F]">{item.customer}</td>
                <td className="py-3 px-3 text-[#64748B] font-mono text-xs">{item.loanId}</td>
                <td className="py-3 px-3 font-semibold text-[#0B1B3F]">
                  {formatINR(item.dueAmount)}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-3 px-3 text-right">
                  {item.status === "Paid" ? (
                    <Button variant="outline" size="sm" className="px-3 text-xs h-7">
                      Receipt
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" className="px-3 text-xs h-7">
                      Collect
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer text */}
      <div className="pt-4 border-t border-[#E6ECF5] mt-4">
        <span className="text-xs text-[#64748B]">
          Showing {items.length} of {totalScheduled} scheduled accounts
        </span>
      </div>
    </Card>
  );
}

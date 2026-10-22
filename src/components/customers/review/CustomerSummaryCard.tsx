import React from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { maskMobile } from "@/lib/mask";
import type { Customer } from "@/data/mockCustomers";

interface CustomerSummaryCardProps {
  customer: Customer;
  customerId: string;
}

export function CustomerSummaryCard({ customer, customerId }: CustomerSummaryCardProps) {
  const details = [
    { label: "Full name", value: customer.name },
    { label: "Customer ID", value: customerId },
    { label: "Mobile number", value: maskMobile(customer.mobile, "portal") },
    { label: "Current address", value: customer.currentAddress, multiline: true },
    { label: "Permanent address", value: customer.permanentAddress },
    { label: "Assigned agent", value: customer.assignedAgent },
    { label: "Branch", value: customer.branch },
  ];

  return (
    <Card className="p-6 flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6ECF5]">
          <h2 className="text-base font-bold text-[#0B1B3F]">Customer summary</h2>
          <Link
            href={`/admin/customers/${customerId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit details</span>
          </Link>
        </div>

        {/* Definition List */}
        <dl className="divide-y divide-[#E6ECF5]/80 text-xs">
          {details.map((item) => (
            <div key={item.label} className="py-3 flex justify-between items-start gap-4">
              <dt className="text-[#64748B] w-2/5 shrink-0 font-medium">{item.label}</dt>
              <dd className={`text-[#0B1B3F] font-semibold w-3/5 text-right ${item.multiline ? "leading-relaxed" : "truncate"}`}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  );
}

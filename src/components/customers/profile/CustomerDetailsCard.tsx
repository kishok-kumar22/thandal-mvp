import React from "react";
import { User, CreditCard, Phone, MapPin, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { maskMobile } from "@/lib/mask";
import type { Customer } from "@/data/mockCustomers";

interface CustomerDetailsCardProps {
  customer: Customer;
}

export function CustomerDetailsCard({ customer }: CustomerDetailsCardProps) {
  const details = [
    {
      icon: <User className="w-4.5 h-4.5 text-[#64748B]" />,
      label: "Full name",
      value: customer.name,
    },
    {
      icon: <CreditCard className="w-4.5 h-4.5 text-[#64748B]" />,
      label: "Customer ID",
      value: customer.id,
    },
    {
      icon: <Phone className="w-4.5 h-4.5 text-[#64748B]" />,
      label: "Mobile number",
      value: maskMobile(customer.mobile, "stars"),
    },
    {
      icon: <MapPin className="w-4.5 h-4.5 text-[#64748B]" />,
      label: "Address",
      value: customer.currentAddress,
      multiline: true,
    },
    {
      icon: <Users className="w-4.5 h-4.5 text-[#64748B]" />,
      label: "Agent",
      value: customer.assignedAgent,
    },
    {
      icon: <Calendar className="w-4.5 h-4.5 text-[#64748B]" />,
      label: "Customer since",
      value: customer.customerSince,
    },
  ];

  return (
    <Card className="p-6 rounded-xl border border-[#E6ECF5]">
      <h2 className="text-base font-bold text-[#0B1B3F] mb-4">Customer details</h2>

      <div className="space-y-4">
        {details.map((item) => (
          <div key={item.label} className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-[#F1F5F9]">
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#64748B] block font-medium leading-tight">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-[#0B1B3F] block mt-0.5 leading-snug">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

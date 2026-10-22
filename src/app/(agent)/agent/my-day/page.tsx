import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  MapPin,
  Phone,
  Wallet,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatINR } from "@/lib/format";

export const metadata = {
  title: "My Day | Collection Agent Portal",
  description: "Daily field collection routes and customer visits",
};

export default function AgentMyDayPage() {
  const agentStats = {
    assignedToday: 24,
    collectedCount: 19,
    collectedAmount: 18000,
    pendingAmount: 3000,
    cashInHand: 18000,
  };

  const scheduledVisits = [
    {
      id: "v-1",
      customer: "K. Murugan",
      loanId: "LN-1088",
      address: "Cross Street 4, North Market",
      amount: 150,
      phone: "+91 98401 23456",
      status: "Pending" as const,
      timeSlot: "10:30 AM",
    },
    {
      id: "v-2",
      customer: "A. Lakshmi",
      loanId: "LN-1092",
      address: "Shop 12, Gandhi Bazaar",
      amount: 200,
      phone: "+91 97100 87654",
      status: "Pending" as const,
      timeSlot: "11:15 AM",
    },
    {
      id: "v-3",
      customer: "R. Sundaram",
      loanId: "LN-1064",
      address: "18 Railway Station Road",
      amount: 250,
      phone: "+91 94440 11223",
      status: "Overdue" as const,
      timeSlot: "12:00 PM",
    },
    {
      id: "v-4",
      customer: "S. Priya",
      loanId: "LN-1053",
      address: "Kamaraj Nagar, 2nd Main",
      amount: 150,
      phone: "+91 98840 99887",
      status: "Paid" as const,
      timeSlot: "09:45 AM",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#1F6BFF] uppercase tracking-wider">
            Field Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight mt-0.5">
            My Day &mdash; Selvam
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Route: Sector 3 &bull; North Market & Bullion Street
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/agent/handover">
            <Button variant="primary" size="sm" icon={<Wallet className="w-4 h-4" />}>
              Deposit Cash Handover
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#64748B]">Assigned Visits</span>
            <span className="text-2xl font-bold text-[#0B1B3F] block leading-tight">
              {agentStats.collectedCount}/{agentStats.assignedToday}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#1F6BFF] flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#64748B]">Collected Today</span>
            <span className="text-2xl font-bold text-[#0B1B3F] block leading-tight">
              {formatINR(agentStats.collectedAmount)}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#64748B]">Remaining Dues</span>
            <span className="text-2xl font-bold text-[#E5252A] block leading-tight">
              {formatINR(agentStats.pendingAmount)}
            </span>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#0B1B3F] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#64748B]">Cash in Hand</span>
            <span className="text-2xl font-bold text-[#0B1B3F] block leading-tight">
              {formatINR(agentStats.cashInHand)}
            </span>
          </div>
        </Card>
      </div>

      {/* Today's Route Queue */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[#0B1B3F] text-base">Assigned Collection Queue</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Prioritized by geographical proximity</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#1F6BFF]">
            4 Accounts Active
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-y border-[#E6ECF5]">
                <th className="py-2.5 px-3">Slot</th>
                <th className="py-2.5 px-3">Customer & Address</th>
                <th className="py-2.5 px-3">Loan ID</th>
                <th className="py-2.5 px-3">Due Today</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {scheduledVisits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 text-xs font-semibold text-[#64748B] whitespace-nowrap">
                    {item.timeSlot}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#0B1B3F]">{item.customer}</div>
                    <div className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#94A3B8]" />
                      <span className="truncate max-w-[220px]">{item.address}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-[#64748B]">{item.loanId}</td>
                  <td className="py-3 px-3 font-bold text-[#0B1B3F]">{formatINR(item.amount)}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <a
                        href={`tel:${item.phone}`}
                        className="p-1.5 rounded-lg border border-[#E6ECF5] text-[#64748B] hover:text-[#1F6BFF] hover:bg-blue-50 transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      {item.status === "Paid" ? (
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          View Receipt
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" className="h-7 text-xs px-2.5">
                          Collect Cash
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

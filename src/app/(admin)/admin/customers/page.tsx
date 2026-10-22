import React from "react";
import Link from "next/link";
import { Plus, Search, FileText, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Customers | THANDAL",
  description: "Customer management and onboarding",
};

export default function AdminCustomersPage() {
  const customerRecords = [
    {
      id: "C-001",
      name: "R. Kumar",
      phone: "+91 98XXX XX321",
      agent: "Selvam",
      branch: "Chennai Main",
      loansCount: 1,
      status: "pending-review" as const,
      statusLabel: "Verification pending",
    },
    {
      id: "C-002",
      name: "S. Priya",
      phone: "+91 98XXX XX887",
      agent: "Selvam",
      branch: "Chennai Main",
      loansCount: 1,
      status: "verified" as const,
      statusLabel: "Active / Verified",
    },
    {
      id: "C-003",
      name: "M. Arjun",
      phone: "+91 97XXX XX112",
      agent: "Karthik",
      branch: "Madurai North",
      loansCount: 2,
      status: "verified" as const,
      statusLabel: "Active / Verified",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Customers
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Manage customer profiles, proof verification, and onboarding workflows.
          </p>
        </div>

        <Link href="/admin/customers/new">
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Create customer
          </Button>
        </Link>
      </div>

      {/* Customer Table Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#0B1B3F]">Registered Customers</h2>
          <span className="text-xs text-[#64748B]">Showing 3 customer records</span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-sm border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] text-xs font-semibold uppercase tracking-wider border-y border-[#E6ECF5]">
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Mobile</th>
                <th className="py-2.5 px-3">Assigned Agent</th>
                <th className="py-2.5 px-3">Branch</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5]">
              {customerRecords.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#1F6BFF] text-xs">
                    <Link href={`/admin/customers/${cust.id}`} className="hover:underline">
                      {cust.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#0B1B3F]">
                    <Link href={`/admin/customers/${cust.id}`} className="hover:text-[#1F6BFF] hover:underline">
                      {cust.name}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#64748B] font-mono">
                    {cust.phone}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#334155]">{cust.agent}</td>
                  <td className="py-3.5 px-3 text-xs text-[#64748B]">{cust.branch}</td>
                  <td className="py-3.5 px-3">
                    <Badge variant={cust.status} label={cust.statusLabel} />
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link href={`/admin/customers/${cust.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2.5">
                          Profile
                        </Button>
                      </Link>
                      <Link href={`/admin/customers/${cust.id}/documents`}>
                        <Button variant="secondary" size="sm" className="h-7 text-xs px-2.5">
                          Docs
                        </Button>
                      </Link>
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

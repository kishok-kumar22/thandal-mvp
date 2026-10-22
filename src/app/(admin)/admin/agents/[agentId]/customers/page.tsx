import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentById, mockAgentsList } from "@/data/mockAgents";
import { mockCustomersList } from "@/data/mockCustomers";
import { getMockLoans } from "@/data/mockLoans";
import { FrequencyChip } from "@/components/ui/FrequencyChip";
import { formatINR } from "@/lib/format";

interface PageProps {
  params: Promise<{ agentId: string }>;
}

export function generateStaticParams() {
  return mockAgentsList.map((a) => ({ agentId: a.id }));
}

export default async function AgentAssignedCustomersPage({ params }: PageProps) {
  const resolvedParams = await params;
  const agent = getAgentById(resolvedParams.agentId);

  if (!agent) {
    notFound();
  }

  const loans = getMockLoans();
  const assigned = mockCustomersList.filter(
    (c) => c.assignedAgent && c.assignedAgent.toLowerCase() === agent.name.toLowerCase()
  );

  return (
    <div className="bg-white rounded-xl border border-[#E6ECF5] shadow-xs overflow-hidden">
      <div className="p-5 border-b border-[#E6ECF5]">
        <h2 className="text-lg font-bold text-[#0B1B3F]">All Assigned Customers</h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Complete list of active borrowers managed by {agent.name}.
        </p>
      </div>

      {assigned.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#64748B]">
          No customers currently assigned.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E6ECF5] text-xs font-semibold text-[#64748B]">
                <th scope="col" className="py-3 px-4">Customer name</th>
                <th scope="col" className="py-3 px-4">Loan No.</th>
                <th scope="col" className="py-3 px-4">Area</th>
                <th scope="col" className="py-3 px-4">Amount</th>
                <th scope="col" className="py-3 px-4">Frequency</th>
                <th scope="col" className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECF5] text-sm">
              {assigned.map((cust) => {
                const loan = loans.find((l) => l.customerId === cust.id);
                const loanNo = loan?.id || cust.activeLoan?.id || "LN-1052";
                const amount = loan?.instalment || cust.activeLoan?.instalment || 105;
                const freq = loan?.frequency || "daily";

                return (
                  <tr key={cust.id} className="hover:bg-[#F8FAFC]/60">
                    <td className="py-3.5 px-4 font-semibold text-[#0B1B3F]">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="hover:text-[#1F6BFF] hover:underline"
                      >
                        {cust.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#0B1B3F]">
                      <Link
                        href={`/admin/loans/${loanNo}`}
                        className="hover:text-[#1F6BFF] hover:underline"
                      >
                        {loanNo}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[#334155] text-xs">
                      {cust.currentAddress.split(",")[0]}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0B1B3F] tabular-nums">
                      {formatINR(amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <FrequencyChip frequency={freq} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-lg border border-[#1F6BFF] text-[#1F6BFF] text-xs font-semibold hover:bg-[#1F6BFF]/5"
                      >
                        Profile
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

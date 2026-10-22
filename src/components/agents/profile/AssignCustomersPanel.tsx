"use client";

import React, { useState, forwardRef } from "react";
import { Calendar, ChevronDown, AlertCircle } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { mockCustomersList } from "@/data/mockCustomers";
import { mockRoutesList } from "@/data/mockRoutes";
import { getMockLoans } from "@/data/mockLoans";
import { useAssignments } from "./AssignmentsContext";
import { todayIso } from "@/lib/clock";

interface AssignCustomersPanelProps {
  currentAgentName: string;
}

export const AssignCustomersPanel = forwardRef<HTMLSelectElement, AssignCustomersPanelProps>(
  function AssignCustomersPanel({ currentAgentName }, ref) {
    const { addStagedAssignment } = useAssignments();

    const [customerId, setCustomerId] = useState("");
    const [routeId, setRouteId] = useState("");
    const [effectiveDate, setEffectiveDate] = useState(todayIso());
    const [errorMsg, setErrorMsg] = useState("");

    const activeCustomers = mockCustomersList.filter((c) => c.status === "active");
    const selectedCustomer = activeCustomers.find((c) => c.id === customerId);

    const isAssignedToOther =
      selectedCustomer?.assignedAgent &&
      selectedCustomer.assignedAgent.toLowerCase() !== currentAgentName.toLowerCase();

    const handleCustomerSelect = (id: string) => {
      setCustomerId(id);
      setErrorMsg("");

      const cust = activeCustomers.find((c) => c.id === id);
      if (cust) {
        // Find matching route by customer's address
        const matchedRoute = mockRoutesList.find((r) =>
          cust.currentAddress.toLowerCase().includes(r.name.toLowerCase())
        );
        if (matchedRoute) {
          setRouteId(matchedRoute.id);
        }
      }
    };

    const handleStage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!customerId) {
        setErrorMsg("Please select a customer.");
        return;
      }
      if (!routeId) {
        setErrorMsg("Please select a collection route.");
        return;
      }
      if (!effectiveDate) {
        setErrorMsg("Effective date is required.");
        return;
      }

      const today = todayIso();
      if (effectiveDate < today) {
        setErrorMsg("Effective date cannot be in the past.");
        return;
      }

      if (!selectedCustomer) return;

      // Find active loan for customer
      const loans = getMockLoans();
      const customerLoan = loans.find((l) => l.customerId === customerId);

      const res = addStagedAssignment({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        loanNo: customerLoan ? customerLoan.id : selectedCustomer.activeLoan?.id || "LN-1052",
        area: selectedCustomer.currentAddress.split(",")[0] || "Anna Nagar",
        amount: customerLoan ? customerLoan.instalment : selectedCustomer.activeLoan?.instalment || 105,
        frequency: customerLoan ? customerLoan.frequency : "daily",
        routeId,
        effectiveDate,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Cannot stage assignment.");
      } else {
        // Reset form
        setCustomerId("");
        setRouteId("");
        setErrorMsg("");
      }
    };

    return (
      <div className="bg-white rounded-xl border border-[#E6ECF5] p-5 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-[#0B1B3F]">Assign customers</h2>

        <form onSubmit={handleStage} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#E5252A] rounded-lg text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Customer select */}
          <FormField label="Customer" htmlFor="assign-customer-select" required>
            <div className="relative">
              <select
                ref={ref}
                id="assign-customer-select"
                value={customerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
              >
                <option value="">Select customer</option>
                {activeCustomers.map((c) => {
                  const isOther =
                    c.assignedAgent &&
                    c.assignedAgent.toLowerCase() !== currentAgentName.toLowerCase();
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) {isOther ? `(${c.assignedAgent})` : ""}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Amber reassignment note */}
            {isAssignedToOther && (
              <p className="text-xs text-[#B45309] bg-[#FEF3C7] p-2 rounded-lg mt-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Currently assigned to <strong>{selectedCustomer?.assignedAgent}</strong>. Saving will reassign this customer.
                </span>
              </p>
            )}
          </FormField>

          {/* Route select */}
          <FormField label="Route" htmlFor="assign-route-select" required>
            <div className="relative">
              <select
                id="assign-route-select"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
              >
                <option value="">Select route</option>
                {mockRoutesList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </FormField>

          {/* Effective date input */}
          <FormField label="Effective date" htmlFor="assign-effective-date" required>
            <div className="relative">
              <input
                id="assign-effective-date"
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
              />
              <Calendar
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </FormField>

          {/* Save assignment button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full h-11 justify-center text-sm font-semibold mt-2"
          >
            Save assignment
          </Button>
        </form>
      </div>
    );
  }
);

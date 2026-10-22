import React from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { FormField } from "@/components/ui/FormField";
import { mockBranches, getRoutesByBranch } from "@/data/mockRoutes";
import type { AgentFormValues } from "@/lib/mockApi";

interface PersonalInfoSectionProps {
  values: AgentFormValues;
  errors: Partial<Record<keyof AgentFormValues, string>>;
  onChange: (field: keyof AgentFormValues, value: any) => void;
  onBlur: (field: keyof AgentFormValues) => void;
}

export function PersonalInfoSection({
  values,
  errors,
  onChange,
  onBlur,
}: PersonalInfoSectionProps) {
  const routes = getRoutesByBranch(values.branchId || "BR-001");

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-[#0B1B3F]">Personal information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <FormField label="Full name" htmlFor="agent-name" required error={errors.fullName}>
          <input
            id="agent-name"
            type="text"
            value={values.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            onBlur={() => onBlur("fullName")}
            placeholder="e.g. Ramesh Kumar"
            className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
          />
        </FormField>

        {/* Mobile */}
        <FormField label="Mobile" htmlFor="agent-mobile" required error={errors.mobile}>
          <input
            id="agent-mobile"
            type="tel"
            inputMode="tel"
            value={values.mobile}
            onChange={(e) => onChange("mobile", e.target.value)}
            onBlur={() => onBlur("mobile")}
            placeholder="+91 98765 43210"
            className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all font-mono"
          />
        </FormField>

        {/* Email */}
        <FormField label="Email" htmlFor="agent-email" required error={errors.email}>
          <input
            id="agent-email"
            type="email"
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            placeholder="e.g. ramesh.kumar@thandal.com"
            className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
          />
        </FormField>

        {/* Employee ID */}
        <FormField label="Employee ID" htmlFor="agent-empid" required error={errors.employeeId}>
          <input
            id="agent-empid"
            type="text"
            value={values.employeeId}
            onChange={(e) => onChange("employeeId", e.target.value)}
            onBlur={() => onBlur("employeeId")}
            placeholder="AGT0012"
            className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all font-mono uppercase"
          />
        </FormField>

        {/* Branch */}
        <FormField label="Branch" htmlFor="agent-branch" required>
          <div className="relative">
            <select
              id="agent-branch"
              value={values.branchId}
              onChange={(e) => onChange("branchId", e.target.value)}
              className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
            >
              {mockBranches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </FormField>

        {/* Route */}
        <FormField label="Route" htmlFor="agent-route" required error={errors.routeId}>
          <div className="relative">
            <select
              id="agent-route"
              value={values.routeId}
              disabled={!values.branchId}
              onChange={(e) => onChange("routeId", e.target.value)}
              className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer disabled:bg-[#F8FAFC] disabled:cursor-not-allowed"
            >
              <option value="">Select route</option>
              {routes.map((r) => (
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

        {/* Joining Date */}
        <FormField label="Joining date" htmlFor="agent-joiningDate" required error={errors.joiningDate}>
          <div className="relative">
            <input
              id="agent-joiningDate"
              type="date"
              placeholder="dd/mm/yyyy"
              value={values.joiningDate}
              onChange={(e) => onChange("joiningDate", e.target.value)}
              onBlur={() => onBlur("joiningDate")}
              className="w-full h-11 rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all"
            />
            <Calendar
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </FormField>

        {/* Status */}
        <FormField label="Status" htmlFor="agent-status" required>
          <div className="relative">
            <select
              id="agent-status"
              value={values.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </FormField>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";

export interface AssignmentProps {
  agent: string;
  status: "Active" | "Inactive";
  onChange: (field: string, value: string) => void;
  errors: Record<string, string | undefined>;
}

export function AssignmentSection({
  agent,
  status,
  onChange,
  errors,
}: AssignmentProps) {
  const agentOptions = [
    { value: "Selvam", label: "Selvam" },
    { value: "Karthik", label: "Karthik" },
    { value: "Meena", label: "Meena" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <Card className="p-5 md:p-6 rounded-xl border border-[#E6ECF5]">
      {/* Responsive title: Assignment on desktop, Assign agent on mobile */}
      <h2 className="text-base font-bold text-[#0B1B3F] mb-4">
        <span className="hidden sm:inline">Assignment</span>
        <span className="sm:hidden">Assign agent</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Collection Agent */}
        <FormField
          label="Collection agent"
          htmlFor="field-agent"
          required
          error={errors.agent}
        >
          <Select
            id="field-agent"
            placeholder="Select agent"
            value={agent}
            onChange={(e) => onChange("agent", e.target.value)}
            options={agentOptions}
          />
        </FormField>

        {/* Status */}
        <FormField
          label="Status"
          htmlFor="field-status"
          required
          error={errors.status}
        >
          <Select
            id="field-status"
            value={status}
            onChange={(e) => onChange("status", e.target.value as "Active" | "Inactive")}
            options={statusOptions}
          />
        </FormField>
      </div>
    </Card>
  );
}

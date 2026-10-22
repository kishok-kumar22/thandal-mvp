import React from "react";
import { ChevronDown } from "lucide-react";
import { FormField } from "@/components/ui/FormField";

interface InvitationSectionProps {
  method: "email" | "sms";
  onChange: (method: "email" | "sms") => void;
}

export function InvitationSection({ method, onChange }: InvitationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-[#0B1B3F]">Invitation method</h3>

      <div className="max-w-md">
        <FormField
          label="Send invitation via"
          htmlFor="agent-invitation-method"
          required
          hint="Invitation sent after account creation."
        >
          <div className="relative">
            <select
              id="agent-invitation-method"
              value={method}
              onChange={(e) => onChange(e.target.value as "email" | "sms")}
              aria-describedby="agent-invitation-method-hint"
              className="w-full h-11 appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] hover:border-[#CBD5E1] focus:border-[#1F6BFF] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 transition-all cursor-pointer"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
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

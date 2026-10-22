import React from "react";
import { ChevronDown } from "lucide-react";
import { rolePermissionsConfig } from "@/config/rolePermissions";

export function AccessPermissionsSection() {
  const agentPermissions = rolePermissionsConfig.agent || [];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-[#0B1B3F]">Access and permissions</h3>

      <div className="bg-[#F3F6FB] border border-[#E6ECF5] rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Role select */}
        <div>
          <label
            htmlFor="agent-role-select"
            className="block text-xs font-semibold text-[#0B1B3F] mb-1.5"
          >
            Role
          </label>
          <div className="relative">
            <select
              id="agent-role-select"
              value="collection_agent"
              disabled
              className="w-full h-11 appearance-none rounded-xl border border-[#CBD5E1] bg-white px-3.5 pr-9 text-sm font-semibold text-[#0B1B3F] cursor-not-allowed opacity-90 shadow-2xs"
            >
              <option value="collection_agent">Collection Agent</option>
            </select>
            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Vertical divider on desktop, horizontal on mobile */}
        <div className="md:border-l md:border-[#CBD5E1] md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#CBD5E1]">
          <ul className="space-y-2 text-xs font-medium text-[#334155]">
            {agentPermissions.map((perm, index) => (
              <li key={index} className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full bg-[#1F6BFF] shrink-0"
                  aria-hidden="true"
                />
                <span>{perm}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

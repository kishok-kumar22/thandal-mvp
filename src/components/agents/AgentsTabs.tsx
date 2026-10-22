"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Agents", href: "/admin/agents" },
  { label: "Routes", href: "/admin/agents/routes" },
  { label: "Assignments", href: "/admin/agents/assignments" },
];

export function AgentsTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#E2E8F0] -mb-px">
      <nav className="flex space-x-8" aria-label="Agent sections">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/admin/agents"
              ? pathname === "/admin/agents"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`py-3 px-1 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? "border-[#1F6BFF] text-[#1F6BFF]"
                  : "border-transparent text-[#64748B] hover:text-[#0B1B3F] hover:border-[#CBD5E1]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

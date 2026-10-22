"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CustomerTabsProps {
  customerId: string;
}

export function CustomerTabs({ customerId }: CustomerTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Customer details",
      href: `/admin/customers/${customerId}`,
      exact: true,
    },
    {
      label: "Proof documents",
      href: `/admin/customers/${customerId}/documents`,
      exact: false,
    },
    {
      label: "Review & activate",
      href: `/admin/customers/${customerId}/review`,
      exact: false,
    },
  ];

  return (
    <div className="border-b border-[#E6ECF5] mt-4">
      <nav className="flex items-center gap-8 -mb-px overflow-x-auto" aria-label="Customer Navigation Tabs">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`py-3 text-sm font-semibold whitespace-nowrap transition-colors relative cursor-pointer ${
                isActive
                  ? "text-[#1F6BFF]"
                  : "text-[#64748B] hover:text-[#0B1B3F]"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F6BFF] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

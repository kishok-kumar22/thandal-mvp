"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PageTabItem {
  label: string;
  href: string;
  count?: number;
  badgeVariant?: "amber" | "blue" | "default";
}

interface PageTabsProps {
  items?: PageTabItem[];
  tabs?: PageTabItem[];
  variant?: "default" | "settings";
  className?: string;
  onBeforeNavigate?: (href: string) => boolean;
}

export function PageTabs({
  items,
  tabs,
  variant = "default",
  className = "",
  onBeforeNavigate,
}: PageTabsProps) {
  const activeItems = items || tabs || [];
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll the active tab into view horizontally on mobile
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [pathname]);

  if (variant === "settings") {
    return (
      <div
        className={`w-full border-b border-[#E6ECF5] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        <nav
          className="flex items-center min-w-max"
          aria-label="Settings section tabs"
        >
          {activeItems.map((tab, idx) => {
            const isActive = pathname === tab.href || pathname?.startsWith(tab.href + "/");

            return (
              <React.Fragment key={tab.href}>
                <Link
                  ref={isActive ? activeTabRef : undefined}
                  href={tab.href}
                  onClick={(e) => {
                    if (onBeforeNavigate && !onBeforeNavigate(tab.href)) {
                      e.preventDefault();
                    }
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative px-4 sm:px-6 py-3.5 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-[#1F6BFF]"
                      : "text-[#64748B] hover:text-[#0B1B3F]"
                  }`}
                >
                  <span>{tab.label}</span>

                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1F6BFF]"
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {/* Thin vertical hairline separator between tabs */}
                {idx < activeItems.length - 1 && (
                  <span
                    className="h-4 w-[1px] bg-[#E2E8F0] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`w-full border-b border-[#E6ECF5] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      <nav className="flex space-x-6 min-w-max px-1" aria-label="Page navigation tabs">
        {activeItems.map((tab) => {
          const isActive = pathname === tab.href;
          const accessibleName =
            tab.count !== undefined ? `${tab.label}, ${tab.count} pending` : tab.label;

          return (
            <Link
              key={tab.href}
              ref={isActive ? activeTabRef : undefined}
              href={tab.href}
              onClick={(e) => {
                if (onBeforeNavigate && !onBeforeNavigate(tab.href)) {
                  e.preventDefault();
                }
              }}
              aria-current={isActive ? "page" : undefined}
              aria-label={accessibleName}
              className={`relative py-3.5 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive ? "text-[#1F6BFF]" : "text-[#64748B] hover:text-[#0B1B3F]"
              }`}
            >
              <span>{tab.label}</span>

              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full ${
                    tab.badgeVariant === "blue"
                      ? "bg-[#DBEAFE] text-[#1D4ED8]"
                      : "bg-[#FEF3C7] text-[#B45309]"
                  }`}
                  aria-hidden="true"
                >
                  {tab.count}
                </span>
              )}

              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F6BFF] rounded-t-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

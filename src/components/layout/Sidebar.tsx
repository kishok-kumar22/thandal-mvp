"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navigationConfig, type Role } from "@/config/navigation";
import { SidebarSection } from "./SidebarSection";
import { SidebarUserFooter } from "./SidebarUserFooter";

interface SidebarProps {
  role: Role;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function CubeLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm"
      aria-label="THANDAL Logo"
    >
      {/* Top Face */}
      <path
        d="M16 3L28 9.8L16 16.6L4 9.8L16 3Z"
        fill="#38BDF8"
        stroke="#0B1B3F"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* Left Face */}
      <path
        d="M4 9.8L16 16.6V29L4 22.2V9.8Z"
        fill="#1F6BFF"
        stroke="#0B1B3F"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* Right Face */}
      <path
        d="M16 16.6L28 9.8V22.2L16 29V16.6Z"
        fill="#1549B8"
        stroke="#0B1B3F"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* Inner highlights for 3D depth */}
      <path
        d="M16 16.6L4 9.8"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.75"
      />
      <path
        d="M16 16.6L28 9.8"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="0.75"
      />
      <path
        d="M16 16.6V29"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.75"
      />
    </svg>
  );
}

export function Sidebar({
  role,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  className = "",
}: SidebarProps) {
  const config = navigationConfig[role];
  const homeHref =
    role === "admin"
      ? "/admin/overview"
      : role === "agent"
      ? "/agent/my-day"
      : "/customer/home";

  return (
    <aside
      className={`bg-[#0B1B3F] text-[#C7D2E8] flex flex-col h-full border-r border-[#13264F] transition-all duration-300 select-none ${
        collapsed ? "w-[72px]" : "w-[260px]"
      } ${className}`}
      aria-label={`${config.portalTitle} Sidebar Navigation`}
    >
      {/* Top Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#13264F] shrink-0">
        <Link
          href={homeHref}
          onClick={onNavigate}
          className="flex items-center gap-3 overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] rounded-lg p-1"
        >
          <CubeLogo size={30} />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-white text-base tracking-wider leading-none">
                THANDAL
              </span>
              <span className="text-[11px] font-medium text-[#8C9BB7] leading-tight mt-1 truncate">
                {config.portalTitle}
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button for tablet */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex lg:hidden w-7 h-7 rounded-md items-center justify-center text-[#8C9BB7] hover:text-white hover:bg-[#13264F] transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {config.sections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Pinned User Footer */}
      <div className="p-3 shrink-0">
        <SidebarUserFooter user={config.footerUser} collapsed={collapsed} />
      </div>
    </aside>
  );
}

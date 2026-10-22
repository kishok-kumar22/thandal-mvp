"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ArrowLeft } from "lucide-react";
import type { Role } from "@/config/navigation";
import { CubeLogo } from "./Sidebar";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { type SessionUser, DEMO_USERS } from "@/config/auth";
import { getUnreadCount } from "@/lib/notifications";

export interface TopbarProps {
  role: Role;
  user?: SessionUser;
  onOpenMobileDrawer?: () => void;
  variant?: "light" | "navy";
  showBack?: boolean;
  backHref?: string;
}

export function Topbar({
  role,
  user,
  onOpenMobileDrawer,
  variant,
  showBack,
  backHref,
}: TopbarProps) {
  const pathname = usePathname();

  // If user prop is not supplied, determine from role / demo fallback
  const fallbackUser: SessionUser =
    role === "customer"
      ? DEMO_USERS.customer
      : role === "agent"
      ? DEMO_USERS.selvam
      : DEMO_USERS.admin;

  const currentUser = user || fallbackUser;

  // Compute unread count for bell
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    try {
      const count = getUnreadCount(currentUser);
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, [currentUser, pathname]);

  // Determine topbar variant: navy by default for /admin/** (unless /admin/overview which uses light) and for /agent/** and for customer
  const isNavy =
    variant === "navy" ||
    (variant === undefined &&
      ((role === "admin" && pathname?.startsWith("/admin") && pathname !== "/admin/overview") ||
        (role === "agent" && pathname?.startsWith("/agent")) ||
        role === "customer"));

  return (
    <header
      className={`sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
        isNavy
          ? "bg-[#0B1B3F] border-b border-[#13264F] text-white"
          : "bg-white border-b border-[#E6ECF5] text-[#0B1B3F]"
      }`}
    >
      {/* Left section: Logo (mobile) + search or back */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl">
        {(showBack || pathname?.startsWith("/agent/cash-handover")) && (
          <Link
            href={backHref || "/agent/my-day"}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer mr-1 ${
              isNavy
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        )}

        {/* Mobile Logo Mark (<768px) */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] rounded-lg p-0.5"
            aria-label="Open navigation menu"
          >
            <CubeLogo size={28} />
            <span
              className={`font-black text-lg tracking-tight ${
                isNavy ? "text-white" : "text-[#0B1B3F]"
              }`}
            >
              THANDAL
            </span>
          </button>
        </div>

        {/* Search Bar (Hidden on mobile, visible from sm up) */}
        <div className="hidden sm:flex items-center flex-1 max-w-md relative">
          <Search
            className={`w-4 h-4 absolute left-3.5 pointer-events-none ${
              isNavy ? "text-white/50" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            placeholder={
              role === "customer"
                ? "Search your loans, receipts..."
                : role === "agent"
                ? "Search my customers or loans..."
                : "Search customers, loans, or collections..."
            }
            className={`w-full h-10 pl-10 pr-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] ${
              isNavy
                ? "bg-[#13264F]/60 text-white placeholder-white/40 border border-white/10 focus:bg-[#13264F]"
                : "bg-[#F8FAFC] text-slate-800 placeholder-slate-400 border border-[#E2E8F0] focus:bg-white"
            }`}
          />
        </div>
      </div>

      {/* Right section: Notification Bell + UserMenu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <NotificationBell role={role} unreadCount={unreadCount} isNavy={isNavy} />

        {/* Replaces the inert avatar + chevron with accessible UserMenu */}
        <UserMenu user={currentUser} isNavy={isNavy} />
      </div>
    </header>
  );
}

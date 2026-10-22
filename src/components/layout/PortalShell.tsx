"use client";

import React, { useState, Suspense } from "react";
import type { Role } from "@/config/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileDrawer } from "./MobileDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
import type { SessionUser } from "@/config/auth";

interface PortalShellProps {
  role: Role;
  user?: SessionUser;
  children: React.ReactNode;
}

export function PortalShell({ role, user, children }: PortalShellProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [tabletCollapsed, setTabletCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F4F7FB] overflow-hidden">
      {/* Desktop & Tablet Sidebar (>=768px for admin/agent, >=1024px for customer) */}
      <div className={`${role === "customer" ? "hidden lg:flex" : "hidden md:flex"} shrink-0 h-full`}>
        <Suspense fallback={<aside className="w-[260px] bg-[#0B1B3F] h-full" />}>
          <Sidebar
            role={role}
            collapsed={tabletCollapsed}
            onToggleCollapse={() => setTabletCollapsed((prev) => !prev)}
          />
        </Suspense>
      </div>

      {/* Mobile Drawer (Opened via Bottom Nav 'More' or Topbar) */}
      <Suspense fallback={null}>
        <MobileDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          role={role}
        />
      </Suspense>

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Sticky Topbar */}
        <Topbar
          role={role}
          user={user}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto bg-[#F4F7FB] p-4 sm:p-6 lg:p-7 pb-24 md:pb-7">
          <Suspense fallback={null}>{children}</Suspense>
        </main>

        {/* Mobile Bottom Navigation (<768px or <1024px for customer) */}
        <div className={role === "customer" ? "lg:hidden" : "md:hidden"}>
          <Suspense fallback={null}>
            <MobileBottomNav role={role} onOpenMore={() => setMobileDrawerOpen(true)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

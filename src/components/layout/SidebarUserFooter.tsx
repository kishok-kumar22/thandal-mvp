"use client";

import React, { useTransition } from "react";
import { LogOut } from "lucide-react";
import type { RoleUserFooter } from "@/config/navigation";
import { signOut } from "@/app/login/actions";

interface SidebarUserFooterProps {
  user: RoleUserFooter;
  collapsed?: boolean;
}

export function SidebarUserFooter({ user, collapsed = false }: SidebarUserFooterProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <div className="pt-3 border-t border-[#13264F] mt-auto">
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } gap-2.5 px-1`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Circular blue avatar */}
          <div
            className="w-9 h-9 rounded-full bg-[#1F6BFF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
            title={`${user.name} (${user.roleCaption})`}
          >
            {user.initials}
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-[#8C9BB7] truncate leading-tight">
                {user.roleCaption}
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={handleSignOut}
            type="button"
            className="flex items-center gap-1.5 text-xs text-[#8C9BB7] hover:text-white transition-colors p-1.5 rounded-md hover:bg-[#13264F] cursor-pointer"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xl:inline text-xs">Sign out</span>
          </button>
        )}
      </div>
    </div>
  );
}

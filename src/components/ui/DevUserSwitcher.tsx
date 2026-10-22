"use client";

import React, { useState, useTransition } from "react";
import { UserCheck } from "lucide-react";
import { devSwitchUser } from "@/app/login/actions";

interface DevUserOption {
  id: string;
  name: string;
  caption: string;
}

const DEV_USERS: DevUserOption[] = [
  { id: "U-ADMIN", name: "Admin", caption: "Full Access" },
  { id: "U-002", name: "Selvam", caption: "Agent A-001" },
  { id: "U-004", name: "Karthik", caption: "Agent A-002" },
  { id: "U-003", name: "R. Kumar", caption: "Customer C-001" },
];

/**
 * Development-only User Role Switcher.
 * Writes real signed HMAC-SHA256 session cookie via server action devSwitchUser.
 * Never rendered in production (guarded by process.env.NODE_ENV === "development").
 */
export function DevUserSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const handleSelectUser = (userId: string) => {
    setIsOpen(false);
    startTransition(async () => {
      await devSwitchUser(userId);
    });
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 print:hidden select-none">
      {isOpen && (
        <div className="mb-2 bg-[#0B1B3F] text-white p-3 rounded-xl shadow-2xl border border-[#13264F] w-56 text-xs space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="font-bold text-[#38BDF8] pb-1 border-b border-[#13264F] flex items-center justify-between">
            <span>SWITCH DEMO USER</span>
            <span className="text-[10px] text-slate-400 font-normal">Dev Only</span>
          </div>

          {DEV_USERS.map((u) => (
            <button
              key={u.id}
              type="button"
              disabled={isPending}
              onClick={() => handleSelectUser(u.id)}
              className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors text-slate-200 hover:bg-white/10 cursor-pointer disabled:opacity-50"
            >
              <span className="font-medium">{u.name}</span>
              <span className="text-[10px] opacity-75">{u.caption}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={isPending}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Switch demo user"
        title="Switch demo user (Dev only - writes signed cookie)"
        className="flex items-center gap-1.5 bg-[#0B1B3F]/90 backdrop-blur hover:bg-[#0B1B3F] text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
      >
        <UserCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
        <span>{isPending ? "Switching..." : "Dev Switcher"}</span>
      </button>
    </div>
  );
}

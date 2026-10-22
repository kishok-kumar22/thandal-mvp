"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, User, Settings, LogOut, FileText, CreditCard, Folder, Shield } from "lucide-react";
import type { SessionUser } from "@/config/auth";
import { signOut } from "@/app/login/actions";

interface UserMenuProps {
  user: SessionUser;
  isNavy?: boolean;
}

export function UserMenu({ user, isNavy = false }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key and support arrow keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown" && !isOpen) {
      setIsOpen(true);
    }
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const customerLinks = [
    { label: "My loans", href: "/customer/loans", icon: CreditCard },
    { label: "Payment history", href: "/customer/payments", icon: FileText },
    { label: "Documents", href: "/customer/documents", icon: Folder },
    { label: "My profile", href: "/customer/profile", icon: User },
  ];

  const agentLinks = [
    { label: "My profile", href: "/agent/profile", icon: User },
  ];

  const adminLinks = [
    { label: "Settings", href: "/admin/settings/business", icon: Settings },
  ];

  const roleLinks =
    user.role === "customer"
      ? customerLinks
      : user.role === "agent"
      ? agentLinks
      : adminLinks;

  return (
    <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`User menu for ${user.name}`}
        className={`flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl transition-colors cursor-pointer select-none ${
          isNavy
            ? "hover:bg-white/10 text-white"
            : "hover:bg-slate-100 text-[#0B1B3F]"
        }`}
      >
        {/* Circular Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#1F6BFF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
          {user.avatarInitial}
        </div>

        {/* Name and Chevron (>=640px) */}
        <div className="hidden sm:flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-semibold truncate max-w-[120px]">
            {user.name}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby={buttonRef.current?.id}
          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E6ECF5] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-[#F1F5F9]">
            <p className="text-sm font-bold text-[#0B1B3F] truncate">{user.name}</p>
            <p className="text-xs text-[#64748B] truncate mt-0.5">{user.caption}</p>
          </div>

          {/* Role specific links */}
          <div className="py-1">
            {roleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#0B1B3F] hover:bg-[#F8FAFC] hover:text-[#1F6BFF] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sign out */}
          <div className="border-t border-[#F1F5F9] pt-1">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isPending}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E5252A] hover:bg-[#FEF2F2] transition-colors cursor-pointer text-left font-medium"
            >
              <LogOut className="w-4 h-4 text-[#E5252A]" aria-hidden="true" />
              <span>{isPending ? "Signing out..." : "Sign out"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

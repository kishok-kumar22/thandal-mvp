"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { Role } from "@/config/navigation";
import { Sidebar } from "./Sidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

export function MobileDrawer({ isOpen, onClose, role }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer automatically on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-in sidebar container */}
      <div className="relative z-10 w-[280px] h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close menu"
          className="absolute top-4 right-3 z-20 text-[#8C9BB7] hover:text-white p-1.5 rounded-lg hover:bg-[#13264F] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <Sidebar role={role} onNavigate={onClose} className="w-full" />
      </div>
    </div>
  );
}

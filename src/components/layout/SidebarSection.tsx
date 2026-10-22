"use client";

import React from "react";
import type { NavSection } from "@/config/navigation";
import { SidebarItem } from "./SidebarItem";

interface SidebarSectionProps {
  section: NavSection;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarSection({ section, collapsed = false, onNavigate }: SidebarSectionProps) {
  return (
    <div className="mb-4">
      {/* Section title */}
      {section.title && (
        !collapsed ? (
          <div className="mb-1.5 px-3">
            <span className="text-[10px] font-bold tracking-wider text-[#8C9BB7] uppercase block pb-1 border-b border-[#13264F]/80">
              {section.title}
            </span>
          </div>
        ) : (
          <div className="my-2 border-t border-[#13264F] mx-2" />
        )
      )}

      {/* Nav items */}
      <div className="space-y-0.5">
        {section.items.map((item) => (
          <SidebarItem
            key={item.href + item.label}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}

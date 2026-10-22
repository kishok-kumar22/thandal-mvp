"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
  id?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
  className = "",
  id = "collapsible",
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (controlledOpen === undefined) {
      setUncontrolledOpen(next);
    }
    onToggle?.(next);
  };

  return (
    <div className={`border-t border-[#EEF2F6] pt-4 ${className}`}>
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={handleToggle}
        className="w-full flex items-center justify-between text-left py-2 font-semibold text-sm text-[#1F6BFF] hover:text-[#1A5BD8] transition-colors cursor-pointer group"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-[#1F6BFF] transition-transform duration-200 group-hover:translate-y-0.5 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div id={`${id}-content`} aria-labelledby={`${id}-trigger`} className="pt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

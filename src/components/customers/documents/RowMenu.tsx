"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, RefreshCw, Download, Trash2 } from "lucide-react";

interface RowMenuProps {
  onReplace?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  fileName: string;
}

export function RowMenu({ onReplace, onDownload, onDelete, fileName }: RowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev)}
        }
        aria-label={`Actions for ${fileName}`}
        aria-expanded={isOpen}
        className="p-1.5 rounded-md text-[#64748B] hover:text-[#0B1B3F] hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[#E6ECF5] py-1 z-30 animate-in fade-in zoom-in-95"
        >
          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onReplace?.();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#334155] hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Replace file</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDownload?.();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#334155] hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Download</span>
          </button>

          <div className="my-1 border-t border-[#E6ECF5]" />

          <button
            type="button"
            role="menuitem"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete?.();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#E5252A] hover:bg-red-50 transition-colors text-left cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#E5252A]" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

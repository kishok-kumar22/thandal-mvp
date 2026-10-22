import React from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface ListLinkRowProps {
  icon: LucideIcon;
  label: string;
  href: string;
  className?: string;
}

export function ListLinkRow({ icon: Icon, label, href, className = "" }: ListLinkRowProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between min-h-[56px] py-3.5 px-4 rounded-xl hover:bg-[#F8FAFC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] focus:ring-offset-1 select-none ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-[#0B1B3F] group-hover:text-[#1F6BFF] transition-colors">
          <Icon className="w-6 h-6 stroke-[1.75]" aria-hidden="true" />
        </div>
        <span className="text-base font-semibold text-[#0B1B3F] group-hover:text-[#1F6BFF] transition-colors">
          {label}
        </span>
      </div>
      <ChevronRight
        className="w-5 h-5 text-[#94A3B8] group-hover:text-[#1F6BFF] transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

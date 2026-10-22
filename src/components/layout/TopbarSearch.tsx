"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Role } from "@/config/permissions";
import { SEARCH_PLACEHOLDERS } from "@/config/search";
import { routeSearch } from "@/lib/searchRoute";

interface TopbarSearchProps {
  role: Role;
  isNavy?: boolean;
}

export function TopbarSearch({ role, isNavy = false }: TopbarSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const placeholder = SEARCH_PLACEHOLDERS[role] || "Search...";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const destination = routeSearch(role, query);
    if (destination) {
      router.push(destination);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setQuery("");
    }
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="hidden sm:flex items-center flex-1 max-w-md relative"
      aria-label="Site search"
    >
      <label htmlFor="topbar-search" className="sr-only">
        {placeholder}
      </label>

      <Search
        className={`w-4 h-4 absolute left-3.5 pointer-events-none ${
          isNavy ? "text-white/50" : "text-slate-400"
        }`}
        aria-hidden="true"
      />

      <input
        id="topbar-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={80}
        autoComplete="off"
        className={`w-full h-10 pl-10 pr-4 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] ${
          isNavy
            ? "bg-[#13264F]/60 text-white placeholder-white/40 border border-white/10 focus:bg-[#13264F]"
            : "bg-[#F8FAFC] text-slate-800 placeholder-slate-400 border border-[#E2E8F0] focus:bg-white"
        }`}
      />
    </form>
  );
}

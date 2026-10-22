"use client";

import React from "react";
import { Shield } from "lucide-react";
import { LoginHero } from "./LoginHero";
import { CubeLogo } from "@/components/layout/Sidebar";
import { loginCopy } from "@/config/loginCopy";

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F7FB]">
      {/* Desktop Left Hero Panel (Hidden <1024px) */}
      <LoginHero />

      {/* Mobile Top Header Strip (<1024px only) */}
      <header className="lg:hidden w-full bg-[#0B1B3F] px-6 py-5 flex items-center justify-between text-white shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <CubeLogo size={36} />
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wider text-white leading-tight">
              THANDAL
            </span>
            <span className="text-xs text-[#8C9BB7] font-normal leading-tight">
              {loginCopy.mobile.tagline}
            </span>
          </div>
        </div>
      </header>

      {/* Form Area (Centered) */}
      <main className="flex-1 min-h-[calc(100vh-80px)] lg:min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md my-auto">
          {children}

          {/* Secure Access Footer under Card */}
          <div className="mt-8 flex flex-col items-center justify-center text-center text-xs text-[#64748B] select-none">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-[#64748B]">
              <Shield className="w-4 h-4" aria-hidden="true" />
            </div>
            <span>{loginCopy.fields.secureFooter}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

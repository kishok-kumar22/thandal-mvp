import React from "react";
import Link from "next/link";
import { Shield, Smartphone, User, ArrowRight } from "lucide-react";
import { CubeLogo } from "@/components/layout/Sidebar";

export default function RootHomePage() {
  const portals = [
    {
      title: "Admin Portal",
      subtitle: "Executive & operations management",
      description: "Manage customers, disburse loans, track daily collection queues, view live analytics, and inspect cashbook audits.",
      href: "/admin/overview",
      icon: <Shield className="w-6 h-6 text-[#1F6BFF]" />,
      badge: "Full Control",
      roleCode: "admin",
      features: ["Live Collection KPI Dashboard", "Loans & Customer Records", "Agent Routes & Verification", "Reports & Audit Logs"],
    },
    {
      title: "Collection Agent",
      subtitle: "Field collection agent portal",
      description: "Access today's assigned customers, collect installment payments, issue instant digital receipts, and submit cash handovers.",
      href: "/agent/my-day",
      icon: <Smartphone className="w-6 h-6 text-[#1F6BFF]" />,
      badge: "Field Operations",
      roleCode: "agent",
      features: ["My Day Route & Due Lists", "Collect & Issue Receipts", "Overdue Follow-up Pipeline", "Cash Handover Reconciliation"],
    },
    {
      title: "Customer Portal",
      subtitle: "Borrower self-service experience",
      description: "Check outstanding loan balances, view upcoming repayment schedules, download past payment receipts, and contact agents.",
      href: "/customer/home",
      icon: <User className="w-6 h-6 text-[#1F6BFF]" />,
      badge: "Self Service",
      roleCode: "customer",
      features: ["Active Loan Status & Balance", "Repayment Timelines", "Payment History & Receipts", "Direct Agent Support"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-between p-6 sm:p-10">
      <div className="max-w-6xl mx-auto w-full py-8">
        {/* Header Branding */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-[#E6ECF5] shadow-xs mb-4">
            <CubeLogo size={28} />
            <span className="font-extrabold text-[#0B1B3F] text-lg tracking-wider">THANDAL</span>
            <span className="text-xs bg-[#EFF6FF] text-[#1F6BFF] font-semibold px-2 py-0.5 rounded-full">
              Lending & Collection
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3F] tracking-tight">
            Role-Based Portals Preview
          </h1>
          <p className="text-base text-[#64748B] mt-3">
            Select a portal to explore the dedicated navigation, workflows, and responsive views built for each persona.
          </p>
        </div>

        {/* 3 Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal) => (
            <div
              key={portal.title}
              className="bg-white rounded-[16px] border border-[#E6ECF5] p-6 shadow-sm hover:shadow-md hover:border-[#1F6BFF]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                    {portal.icon}
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#0B1B3F]">
                    {portal.badge}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#0B1B3F] group-hover:text-[#1F6BFF] transition-colors">
                  {portal.title}
                </h2>
                <p className="text-xs font-semibold text-[#1F6BFF] mt-0.5">{portal.subtitle}</p>

                <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
                  {portal.description}
                </p>

                <div className="mt-6 pt-5 border-t border-[#F1F5F9]">
                  <span className="text-[11px] font-bold text-[#8C9BB7] uppercase tracking-wider block mb-2.5">
                    Key Features
                  </span>
                  <ul className="space-y-1.5">
                    {portal.features.map((feat) => (
                      <li key={feat} className="text-xs text-[#334155] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1F6BFF] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href={portal.href}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0B1B3F] text-white hover:bg-[#1F6BFF] font-medium text-sm transition-all shadow-sm group-hover:shadow"
                >
                  <span>Launch {portal.title}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-[#8C9BB7] pt-8">
        THANDAL Lending & Collection Management Platform • Designed for high-volume daily micro-lending operations.
      </footer>
    </div>
  );
}

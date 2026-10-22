import React from "react";
import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";
import { requireRole } from "@/lib/session";

export const metadata = {
  title: "Contact Agent | THANDAL",
  description: "Get in touch with your assigned collection agent",
};

export default async function ContactAgentPage() {
  await requireRole("customer", "/customer/contact-agent");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        href="/customer/home"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6BFF] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to home</span>
      </Link>

      <div className="bg-white rounded-2xl border border-[#E6ECF5] p-8 text-center shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#0B1B3F]">Contact assigned agent</h1>
        <p className="text-sm text-[#64748B] max-w-sm mx-auto">
          Direct messaging and call scheduling with your field collection agent is coming soon. In the meantime, use <Link href="/customer/support" className="text-[#1F6BFF] font-semibold hover:underline">Support</Link> to send inquiries.
        </p>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Building2, Info, Headphones } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { getPublicBusinessInfo } from "@/lib/settings";

export const metadata = {
  title: "Contact support | THANDAL",
  description: "Contact THANDAL administrator and support team",
};

export default function ContactSupportPage() {
  const business = getPublicBusinessInfo();

  return (
    <AuthShell>
      <div className="w-full bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(11,27,63,0.08)]">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F6BFF] hover:text-[#1549B8] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to sign in</span>
        </Link>

        {/* Title */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#E8F0FE] text-[#1F6BFF] flex items-center justify-center mb-3">
            <Headphones className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Contact support
          </h1>
          <p className="text-sm text-[#64748B] mt-1.5">
            Get in touch with the {business.name} operations and support desk.
          </p>
        </div>

        {/* Business details card */}
        <div className="space-y-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-5">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#64748B] shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-[#64748B] font-medium">Institution</p>
              <p className="text-sm font-bold text-[#0B1B3F]">{business.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#1F6BFF] shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-[#64748B] font-medium">Phone Support</p>
              <a
                href={`tel:${business.phone}`}
                className="text-sm font-semibold text-[#1F6BFF] hover:underline"
              >
                +91 {business.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#1F6BFF] shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-[#64748B] font-medium">Email Desk</p>
              <a
                href={`mailto:${business.email}`}
                className="text-sm font-semibold text-[#1F6BFF] hover:underline"
              >
                {business.email}
              </a>
            </div>
          </div>
        </div>

        {/* Admin notice */}
        <div className="mt-6 p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#1F6BFF] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-medium leading-relaxed">
            New accounts and activation links are issued by your administrator. If you are a field agent or borrower requiring activation, please reach out using the contacts above.
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-[#E6ECF5] text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#1F6BFF] hover:underline"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

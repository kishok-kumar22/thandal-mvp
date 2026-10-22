"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ArrowLeft, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { requestPasswordReset, type ForgotPasswordFormState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-14 rounded-xl bg-[#1F6BFF] hover:bg-[#1549B8] active:bg-[#0F3894] text-white font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F6BFF] focus:ring-offset-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          <span>Sending link...</span>
        </>
      ) : (
        <span>Send reset link</span>
      )}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, {});

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
          <h1 className="text-3xl font-bold text-[#0B1B3F] tracking-tight">
            Forgot password
          </h1>
          <p className="text-sm text-[#64748B] mt-2">
            Enter your registered mobile number or email address to receive password reset instructions.
          </p>
        </div>

        {/* Success Confirmation Panel */}
        {state.submitted && (
          <div
            role="status"
            className="mb-6 p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-sm text-[#1E3A8A] flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-[#1F6BFF] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#0B1B3F]">Request received</p>
              <p className="mt-1">{state.message}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {state.error && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-3 text-sm font-semibold text-[#B91C1C]"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-[#E5252A]" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        {!state.submitted && (
          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="reset-identifier"
                className="block text-sm font-semibold text-[#0B1B3F]"
              >
                Mobile number or email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <User className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="reset-identifier"
                  name="identifier"
                  type="text"
                  inputMode="text"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="Enter mobile number or email"
                  required
                  className="w-full h-14 pl-12 pr-4 text-base rounded-xl bg-white border border-[#D9E1EC] transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF]"
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        )}

        {/* Already have password */}
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

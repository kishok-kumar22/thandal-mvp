"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Lock, AlertCircle, Loader2, Info } from "lucide-react";
import { signIn, type SignInFormState } from "@/app/login/actions";
import { PasswordInput } from "./PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { loginCopy } from "@/config/loginCopy";

const initialState: SignInFormState = {};

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
          <span>Signing in...</span>
        </>
      ) : (
        <span>{loginCopy.fields.signInButton}</span>
      )}
    </button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "";
  const reason = searchParams.get("reason");

  const [state, formAction] = useActionState(signIn, initialState);
  const [identifier, setIdentifier] = useState(state.identifier || "");
  const [rememberMe, setRememberMe] = useState(true);

  const alertRef = useRef<HTMLDivElement>(null);

  // Focus error alert panel for screen readers on error
  useEffect(() => {
    if (state.error && alertRef.current) {
      alertRef.current.focus();
    }
  }, [state.error]);

  // Determine banner message from URL parameters
  const bannerMessage =
    reason === "expired"
      ? loginCopy.banners.expired
      : reason === "signed-out"
      ? loginCopy.banners.signedOut
      : null;

  // Quick fill helper for reviewers
  const handleQuickFill = (val: string) => {
    setIdentifier(val);
  };

  return (
    <div className="w-full">
      {/* Status banner above card */}
      {bannerMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 p-4 rounded-xl bg-[#E8F0FE] border border-[#C9DBFB] text-sm text-[#1E3A8A] font-medium flex items-center gap-3 shadow-sm"
        >
          <Info className="w-5 h-5 text-[#1F6BFF] shrink-0" aria-hidden="true" />
          <span>{bannerMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="w-full bg-white rounded-2xl border border-[#E6ECF5] p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(11,27,63,0.08)]">
        {/* Card Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#0B1B3F] tracking-tight leading-tight">
            <span className="lg:hidden">{loginCopy.mobile.title}</span>
            <span className="hidden lg:inline">{loginCopy.desktop.title}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 font-normal">
            <span className="lg:hidden">{loginCopy.mobile.subtitle}</span>
            <span className="hidden lg:inline">{loginCopy.desktop.subtitle}</span>
          </p>
        </div>

        {/* Generic Failure Alert Panel (Enforces account enumeration protection) */}
        {state.error && (
          <div
            ref={alertRef}
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-3 text-sm font-semibold text-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-[#E5252A]" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form action={formAction} className="space-y-5" noValidate>
          <input type="hidden" name="next" value={nextPath} />

          {/* Field: Mobile number or email */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-identifier"
              className="block text-sm font-semibold text-[#0B1B3F]"
            >
              {loginCopy.fields.identifier}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center pointer-events-none text-[#94A3B8]">
                <User className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                inputMode="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder={loginCopy.fields.identifierPlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-invalid={Boolean(state.fieldErrors?.identifier)}
                aria-describedby={
                  state.fieldErrors?.identifier ? "login-identifier-error" : undefined
                }
                className={`w-full h-14 pl-12 pr-4 text-base rounded-xl bg-white border transition-all text-[#0B1B3F] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F6BFF]/20 focus:border-[#1F6BFF] ${
                  state.fieldErrors?.identifier
                    ? "border-[#E5252A] focus:border-[#E5252A]"
                    : "border-[#D9E1EC]"
                }`}
              />
            </div>
            {state.fieldErrors?.identifier && (
              <p
                id="login-identifier-error"
                className="text-xs text-[#E5252A] mt-1 font-medium"
                role="alert"
              >
                {state.fieldErrors.identifier}
              </p>
            )}
          </div>

          {/* Field: Password */}
          <div className="space-y-2">
            <PasswordInput
              id="login-password"
              name="password"
              label={loginCopy.fields.password}
              placeholder={loginCopy.fields.passwordPlaceholder}
              error={state.fieldErrors?.password}
              required
            />

            {/* Forgot password link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-semibold text-[#1F6BFF] hover:text-[#1549B8] hover:underline"
              >
                {loginCopy.fields.forgotPassword}
              </Link>
            </div>
          </div>

          {/* Desktop Only: Remember Me checkbox */}
          <div className="hidden lg:flex items-center pt-1">
            <Checkbox
              id="remember-me"
              name="rememberMe"
              checked={rememberMe}
              onChange={setRememberMe}
              label={
                <span className="text-sm font-medium text-[#334155]">
                  {loginCopy.fields.rememberMe}
                </span>
              }
            />
          </div>

          {/* Submit button */}
          <SubmitButton />

          {/* Divider: Need help signing in? */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6ECF5]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#64748B] font-medium">
                {loginCopy.fields.needHelp}
              </span>
            </div>
          </div>

          {/* Contact Support Link */}
          <div className="text-center">
            <Link
              href="/contact-support"
              className="text-sm font-semibold text-[#1F6BFF] hover:text-[#1549B8] hover:underline"
            >
              {loginCopy.fields.contactSupport}
            </Link>
          </div>

          {/* Desktop Only: Admin notice */}
          <div className="hidden lg:block pt-3 border-t border-[#F1F5F9] text-center">
            <p className="text-xs text-[#64748B] flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" aria-hidden="true" />
              <span>{loginCopy.fields.adminNotice}</span>
            </p>
          </div>
        </form>

        {/* Demo Fast Fill Helper (Dev Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 pt-4 border-t border-dashed border-[#E6ECF5]">
            <span className="text-[11px] font-bold text-[#8C9BB7] uppercase tracking-wider block text-center mb-2">
              Dev Fast-Fill Identifier (Password is Password@123)
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@thandal.in")}
                className="text-[11px] px-2 py-1 rounded bg-[#EFF6FF] text-[#1F6BFF] font-medium hover:bg-blue-100"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("agent@thandal.in")}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 text-[#334155] font-medium hover:bg-slate-200"
              >
                Agent (Selvam)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("karthik@thandal.in")}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 text-[#334155] font-medium hover:bg-slate-200"
              >
                Agent (Karthik)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("9876543210")}
                className="text-[11px] px-2 py-1 rounded bg-slate-100 text-[#334155] font-medium hover:bg-slate-200"
              >
                Customer (9876543210)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
